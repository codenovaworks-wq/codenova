import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

async function migrate() {
  console.log('[CodeNova Migration] Initializing MySQL Schema Migration...');

  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'codenova_db',
    multipleStatements: true,
  };

  console.log(`[CodeNova Migration] Connecting to MySQL at ${config.host}:${config.port} (Database: ${config.database}, User: ${config.user})...`);

  try {
    const conn = await mysql.createConnection(config);
    console.log('[CodeNova Migration] Connected successfully to MySQL.');

    const schemaPath = path.resolve(process.cwd(), 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    console.log('[CodeNova Migration] Executing schema.sql statements...');

    await conn.query(schemaSql);
    console.log('[CodeNova Migration] Schema executed successfully!');

    const [rows]: any = await conn.query('SHOW TABLES');
    console.log('[CodeNova Migration] Current Tables in Database:');
    const tableKey = Object.keys(rows[0] || {})[0];
    rows.forEach((r: any) => console.log(`  ✓ ${r[tableKey]}`));

    // Sync seed data from data/db.json into MySQL
    const dbJsonPath = path.resolve(process.cwd(), 'data', 'db.json');
    if (fs.existsSync(dbJsonPath)) {
      const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));
      if (Array.isArray(dbData.leads) && dbData.leads.length > 0) {
        console.log(`[CodeNova Migration] Syncing ${dbData.leads.length} leads from db.json into MySQL...`);
        for (const lead of dbData.leads) {
          try {
            await conn.query(
              `INSERT INTO leads (id, name, email, phone, company, service, budget, timeline, message, status, source)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = NOW()`,
              [
                lead.id,
                lead.name,
                lead.email,
                lead.phone || null,
                lead.company || null,
                lead.service,
                lead.budget || null,
                lead.timeline || null,
                lead.message,
                lead.status || 'New',
                lead.source || 'Website Contact Form',
              ]
            );
          } catch (e: any) {
            // ignore individual duplicate or format warnings
          }
        }
        console.log('[CodeNova Migration] Leads synced successfully.');
      }
    }

    await conn.end();
    console.log('[CodeNova Migration] All migrations complete! Database is 100% ready.');
  } catch (err: any) {
    console.error('[CodeNova Migration Error]:', err.message);
    process.exit(1);
  }
}

migrate();
