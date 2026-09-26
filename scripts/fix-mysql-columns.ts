import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

async function fixColumns() {
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = parseInt(process.env.MYSQL_PORT || '3306', 10);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'codenova_db';

  console.log(`Connecting to ${database} on ${host}:${port}...`);
  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
  });

  console.log('Connected! Checking table columns...');

  const [cols]: any = await conn.query(
    'SELECT TABLE_NAME, COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ?',
    [database]
  );

  const existingCols = new Set(cols.map((r: any) => `${r.TABLE_NAME}.${r.COLUMN_NAME}`.toLowerCase()));

  async function addColIfMissing(table: string, col: string, definition: string) {
    const key = `${table}.${col}`.toLowerCase();
    if (!existingCols.has(key)) {
      console.log(`Adding missing column: ${table}.${col}`);
      try {
        await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${definition}`);
        console.log(`✓ Added ${table}.${col}`);
      } catch (err: any) {
        console.error(`Error adding ${table}.${col}:`, err.message);
      }
    } else {
      console.log(`✓ Found column: ${table}.${col}`);
    }
  }

  // Check leads
  await addColIfMissing('leads', 'country', 'VARCHAR(100) NULL AFTER company');
  await addColIfMissing('leads', 'timeline', 'VARCHAR(100) NULL AFTER message');
  await addColIfMissing('leads', 'source', 'VARCHAR(100) NULL AFTER timeline');

  // Check consultations
  await addColIfMissing('consultations', 'message', 'TEXT NULL AFTER preferred_time');
  await addColIfMissing('consultations', 'project_type', 'VARCHAR(100) NULL AFTER company');
  await addColIfMissing('consultations', 'meeting_url', 'VARCHAR(512) NULL AFTER status');

  // Check orders
  await addColIfMissing('orders', 'selected_addons', 'JSON NULL');
  await addColIfMissing('orders', 'deposit_amount', 'DECIMAL(12, 2) DEFAULT 0');
  await addColIfMissing('orders', 'remaining_balance', 'DECIMAL(12, 2) DEFAULT 0');
  await addColIfMissing('orders', 'assigned_lead', 'VARCHAR(255) NULL');
  await addColIfMissing('orders', 'progress_percentage', 'INT DEFAULT 0');
  await addColIfMissing('orders', 'requirements_brief', 'TEXT NULL');

  // Check clients
  await addColIfMissing('clients', 'billing_address', 'TEXT NULL');
  await addColIfMissing('clients', 'gst_tax_id', 'VARCHAR(64) NULL');
  await addColIfMissing('clients', 'notes', 'TEXT NULL');

  // Check users
  await addColIfMissing('users', 'password_hash', 'VARCHAR(255) NULL');
  await addColIfMissing('users', 'client_id', 'VARCHAR(64) NULL');
  await addColIfMissing('users', 'phone', 'VARCHAR(50) NULL');
  await addColIfMissing('users', 'status', 'VARCHAR(50) DEFAULT "Active"');

  // Check projects
  await addColIfMissing('projects', 'assigned_lead', 'VARCHAR(255) NULL');
  await addColIfMissing('projects', 'currency', 'VARCHAR(10) DEFAULT "INR"');

  // Check support_tickets
  await addColIfMissing('support_tickets', 'category', 'VARCHAR(100) NULL');
  await addColIfMissing('support_tickets', 'assigned_to', 'VARCHAR(255) NULL');

  console.log('\nAll table column checks and migrations completed successfully!');
  await conn.end();
}

fixColumns().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
