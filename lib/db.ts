import { Pool, PoolClient } from 'pg'

// Database connection pool configuration
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
}

let pool: Pool | null = null

/**
 * Get or create the database connection pool
 * Uses singleton pattern to ensure only one pool is created
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(poolConfig)

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })

    // Log pool configuration in development
    if (process.env.NODE_ENV === 'development') {
      pool.on('connect', () => {
        console.log('New client connected to PostgreSQL')
      })

      pool.on('remove', () => {
        console.log('Client removed from PostgreSQL pool')
      })
    }
  }

  return pool
}

/**
 * Execute a SQL query
 * @param text - The SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function query<T = any>(text: string, params?: any[]): Promise<any> {
  const start = Date.now()
  try {
    const pool = getPool()
    const res = await pool.query(text, params)
    const duration = Date.now() - start

    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount })
    }

    return res
  } catch (error) {
    console.error('Database query error', { text, params, error })
    throw error
  }
}

/**
 * Get a client from the pool for transactions
 * @returns PoolClient
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool()
  const client = await pool.connect()

  if (process.env.NODE_ENV === 'development') {
    const release = client.release
    const startTime = Date.now()

    client.release = () => {
      const duration = Date.now() - startTime
      console.log('Client released', { duration })
      release.call(client)
    }
  }

  return client
}

/**
 * Execute a transaction
 * @param callback - Function to execute within the transaction
 * @returns Result of the callback
 */
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getClient()

  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

/**
 * Health check for database connection
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as health_check')
    return result.rows[0]?.health_check === 1
  } catch (error) {
    console.error('Database health check failed', error)
    return false
  }
}

// Export pool instance for direct access if needed
export { getPool as pool }
