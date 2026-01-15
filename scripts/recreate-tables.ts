import { readFileSync } from 'fs';
import { join } from 'path';
import pg from 'pg';

const { Client } = pg;

// Load environment variables
function loadEnvFile() {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key && !key.startsWith('#') && value) {
        process.env[key.trim()] = value;
      }
    });
  } catch (error) {
    console.error('Warning: Could not load .env file');
  }
}

loadEnvFile();

async function recreateTables() {
  console.log('🔄 Recreating database tables...\n');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Drop existing tables
    console.log('\n🗑️  Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS activity CASCADE');
    await client.query('DROP TABLE IF EXISTS link CASCADE');
    console.log('✅ Tables dropped');

    // Drop existing function
    await client.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');

    // Read and execute SQL file
    const sqlPath = join(process.cwd(), 'migrations', '001_create_tables.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    console.log('\n📝 Executing migration script...');
    await client.query(sql);

    console.log('\n✅ Migration completed successfully!\n');

    // Verify tables were created
    console.log('📋 Checking created tables...\n');

    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('Tables in database:');
    tables.rows.forEach((row: any) => {
      console.log('  -', row.table_name);
    });

    // Show table schemas
    console.log('\n📊 Table schemas:\n');

    const linkColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'link'
      ORDER BY ordinal_position
    `);

    console.log('link table:');
    linkColumns.rows.forEach((col: any) => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

    console.log();

    const activityColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'activity'
      ORDER BY ordinal_position
    `);

    console.log('activity table:');
    activityColumns.rows.forEach((col: any) => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

    await client.end();
    console.log('\n✅ Done!\n');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Operation failed!');
    console.error('Error:', error.message);
    await client.end().catch(() => {});
    process.exit(1);
  }
}

recreateTables();
