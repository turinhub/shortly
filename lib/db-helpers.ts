import { query, transaction } from './db';

/**
 * Common database helper functions
 */

/**
 * Find a single record by ID
 * @param table - Table name
 * @param id - Record ID
 * @returns The found record or null
 */
export async function findById<T extends { id: any }>(
  table: string,
  id: string | number
): Promise<T | null> {
  const result = await query<T>(
    `SELECT * FROM ${table} WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Find all records from a table
 * @param table - Table name
 * @param options - Query options (limit, offset, orderBy)
 * @returns Array of records
 */
export async function findAll<T>(
  table: string,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
  }
): Promise<T[]> {
  const { limit = 100, offset = 0, orderBy = 'created_at', orderDirection = 'DESC' } = options || {};

  const result = await query<T>(
    `SELECT * FROM ${table} ORDER BY ${orderBy} ${orderDirection} LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows;
}

/**
 * Find records matching conditions
 * @param table - Table name
 * @param conditions - Object with key-value pairs for WHERE clause
 * @returns Array of matching records
 */
export async function findBy<T>(
  table: string,
  conditions: Record<string, any>
): Promise<T[]> {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);

  if (keys.length === 0) {
    return findAll<T>(table);
  }

  const whereClause = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
  const result = await query<T>(
    `SELECT * FROM ${table} WHERE ${whereClause}`,
    values
  );

  return result.rows;
}

/**
 * Find a single record matching conditions
 * @param table - Table name
 * @param conditions - Object with key-value pairs for WHERE clause
 * @returns The found record or null
 */
export async function findOne<T>(
  table: string,
  conditions: Record<string, any>
): Promise<T | null> {
  const records = await findBy<T>(table, conditions);
  return records[0] || null;
}

/**
 * Create a new record
 * @param table - Table name
 * @param data - Object with key-value pairs to insert
 * @returns The created record
 */
export async function create<T>(
  table: string,
  data: Record<string, any>
): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

  const result = await query<T>(
    `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );

  return result.rows[0];
}

/**
 * Update a record by ID
 * @param table - Table name
 * @param id - Record ID
 * @param data - Object with key-value pairs to update
 * @returns The updated record
 */
export async function update<T>(
  table: string,
  id: string | number,
  data: Record<string, any>
): Promise<T> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

  const result = await query<T>(
    `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );

  return result.rows[0];
}

/**
 * Delete a record by ID
 * @param table - Table name
 * @param id - Record ID
 * @returns true if deleted, false otherwise
 */
export async function deleteById(
  table: string,
  id: string | number
): Promise<boolean> {
  const result = await query(
    `DELETE FROM ${table} WHERE id = $1`,
    [id]
  );

  return (result.rowCount || 0) > 0;
}

/**
 * Count records in a table
 * @param table - Table name
 * @param conditions - Optional conditions for WHERE clause
 * @returns Count of records
 */
export async function count(
  table: string,
  conditions?: Record<string, any>
): Promise<number> {
  let queryText = `SELECT COUNT(*) as count FROM ${table}`;
  let params: any[] = [];

  if (conditions && Object.keys(conditions).length > 0) {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const whereClause = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    queryText += ` WHERE ${whereClause}`;
    params = values;
  }

  const result = await query<{ count: string }>(queryText, params);
  return parseInt(result.rows[0].count, 10);
}

/**
 * Check if a record exists
 * @param table - Table name
 * @param conditions - Conditions for WHERE clause
 * @returns true if exists, false otherwise
 */
export async function exists(
  table: string,
  conditions: Record<string, any>
): Promise<boolean> {
  const countResult = await count(table, conditions);
  return countResult > 0;
}

/**
 * Execute a raw SQL query
 * @param sql - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function raw<T = any>(sql: string, params?: any[]): Promise<any> {
  return query<T>(sql, params);
}

/**
 * Batch insert records
 * @param table - Table name
 * @param records - Array of objects to insert
 * @returns Array of created records
 */
export async function batchCreate<T>(
  table: string,
  records: Record<string, any>[]
): Promise<T[]> {
  if (records.length === 0) return [];

  const keys = Object.keys(records[0]);
  const placeholders = records.map((_, rowIndex) =>
    keys.map((_, colIndex) => `$${rowIndex * keys.length + colIndex + 1}`).join(', ')
  );

  const values = records.flatMap((record) => keys.map((key) => record[key]));

  const result = await query<T>(
    `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join('), (')}) RETURNING *`,
    values
  );

  return result.rows;
}

/**
 * Execute multiple queries in a transaction
 * @param queries - Array of query functions
 * @returns Array of query results
 */
export async function batchQuery<T>(
  queries: Array<() => Promise<T>>
): Promise<T[]> {
  return transaction(async (client) => {
    const results: T[] = [];
    for (const queryFn of queries) {
      results.push(await queryFn());
    }
    return results;
  });
}

// Re-export transaction for convenience
export { transaction };
