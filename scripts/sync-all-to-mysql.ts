import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

function toMySQLDate(val?: string | null): string | null {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function toMySQLDateTime(val?: string | null): string | null {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function syncAllData() {
  console.log('[CodeNova Sync] Starting complete synchronization of all website data to MySQL...');

  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'codenova_db',
  };

  const dbJsonPath = path.resolve(process.cwd(), 'data', 'db.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.error('db.json not found!');
    return;
  }
  const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

  try {
    const conn = await mysql.createConnection(config);
    console.log('[CodeNova Sync] Connected to MySQL database:', config.database);

    // 1. Sync Services
    if (Array.isArray(dbData.services)) {
      console.log(`[CodeNova Sync] Syncing ${dbData.services.length} services...`);
      for (const s of dbData.services) {
        await conn.query(
          `INSERT INTO services (id, slug, name, short_description, full_description, icon, status, sort_order, platforms, capabilities, deliverables, technologies)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), full_description=VALUES(full_description)`,
          [
            s.id,
            s.slug,
            s.name,
            s.short_description || '',
            s.full_description || '',
            s.icon || 'Code',
            s.status !== false,
            s.sort_order || 0,
            JSON.stringify(s.platforms || []),
            JSON.stringify(s.capabilities || []),
            JSON.stringify(s.deliverables || []),
            JSON.stringify(s.technologies || []),
          ]
        );
      }
    }

    // 2. Sync Clients
    if (Array.isArray(dbData.clients)) {
      console.log(`[CodeNova Sync] Syncing ${dbData.clients.length} client organizations...`);
      for (const c of dbData.clients) {
        await conn.query(
          `INSERT INTO clients (id, name, company, email, phone, status, billing_address, gst_tax_id, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company), status=VALUES(status)`,
          [
            c.id,
            c.name,
            c.company,
            c.email,
            c.phone || '',
            c.status || 'Active',
            c.billing_address || null,
            c.gst_tax_id || null,
            c.notes || null,
          ]
        );
      }
    }

    // 3. Sync Users
    const users = dbData.portal_users || dbData.users || [];
    if (Array.isArray(users)) {
      console.log(`[CodeNova Sync] Syncing ${users.length} users & portal accounts...`);
      for (const u of users) {
        await conn.query(
          `INSERT INTO users (id, name, email, password_hash, role, client_id, phone, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), status=VALUES(status)`,
          [
            u.id,
            u.name,
            u.email,
            u.password_hash || 'SHA256_SECURED_USER_HASH',
            u.role || 'client',
            u.client_id || null,
            u.phone || null,
            u.status || 'Active',
          ]
        );
      }
    }

    // 4. Sync Projects
    const projects = dbData.portal_projects || [];
    if (Array.isArray(projects)) {
      console.log(`[CodeNova Sync] Syncing ${projects.length} engineering projects...`);
      for (const p of projects) {
        await conn.query(
          `INSERT INTO projects (id, client_id, title, service_type, status, progress_percentage, start_date, target_delivery_date, budget, currency, description, assigned_lead)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status), progress_percentage=VALUES(progress_percentage)`,
          [
            p.id,
            p.client_id,
            p.title,
            p.service_type || 'Web Application Development',
            p.status || 'In_Progress',
            p.progress_percentage || 0,
            toMySQLDate(p.start_date) || new Date().toISOString().split('T')[0],
            toMySQLDate(p.target_delivery_date) || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
            p.budget || 0,
            p.currency || 'INR',
            p.description || '',
            p.assigned_lead || 'Er. Gagandeep Singh (CodeNova)',
          ]
        );
      }
    }

    // 5. Sync Orders
    if (Array.isArray(dbData.orders)) {
      console.log(`[CodeNova Sync] Syncing ${dbData.orders.length} service bookings & orders...`);
      for (const o of dbData.orders) {
        await conn.query(
          `INSERT INTO orders (id, customer_name, customer_email, customer_phone, customer_company, service_id, service_name, package_tier, selected_addons, total_amount, deposit_amount, remaining_balance, currency, payment_status, order_status, progress_percentage, assigned_lead, target_delivery_date, requirements_brief)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE payment_status=VALUES(payment_status), order_status=VALUES(order_status)`,
          [
            o.id,
            o.customer_name,
            o.customer_email,
            o.customer_phone || '',
            o.customer_company || null,
            o.service_id || 'custom-eng',
            o.service_name || 'Custom Engineering',
            o.package_tier || 'Business',
            JSON.stringify(o.selected_addons || []),
            o.total_amount || 0,
            o.deposit_amount || 0,
            o.remaining_balance || 0,
            o.currency || 'INR',
            o.payment_status || 'Pending',
            o.order_status || 'Initiated',
            o.progress_percentage || 0,
            o.assigned_lead || 'Er. Gagandeep Singh',
            toMySQLDate(o.target_delivery_date),
            o.requirements_brief || null,
          ]
        );
      }
    }

    // 6. Sync Invoices
    if (Array.isArray(dbData.invoices)) {
      console.log(`[CodeNova Sync] Syncing ${dbData.invoices.length} invoices...`);
      for (const inv of dbData.invoices) {
        await conn.query(
          `INSERT INTO invoices (id, invoice_number, client_id, project_id, issue_date, due_date, status, subtotal, tax_rate_percent, tax_amount, total_amount, currency, notes, paid_at, payment_method, receipt_number)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status=VALUES(status), total_amount=VALUES(total_amount)`,
          [
            inv.id,
            inv.invoice_number,
            inv.client_id,
            inv.project_id || null,
            toMySQLDate(inv.issue_date) || new Date().toISOString().split('T')[0],
            toMySQLDate(inv.due_date) || new Date().toISOString().split('T')[0],
            inv.status || 'Sent',
            inv.subtotal || inv.total_amount || 0,
            inv.tax_rate_percent || 18,
            inv.tax_amount || 0,
            inv.total_amount || 0,
            inv.currency || 'INR',
            inv.notes || null,
            toMySQLDateTime(inv.paid_at),
            inv.payment_method || null,
            inv.receipt_number || null,
          ]
        );
      }
    }

    // 7. Sync Consultations
    if (Array.isArray(dbData.consultations)) {
      console.log(`[CodeNova Sync] Syncing ${dbData.consultations.length} consultations...`);
      for (const c of dbData.consultations) {
        await conn.query(
          `INSERT INTO consultations (id, lead_id, name, email, phone, company, project_type, preferred_date, preferred_time, meeting_url, status, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status=VALUES(status), meeting_url=VALUES(meeting_url)`,
          [
            c.id,
            c.lead_id || null,
            c.name,
            c.email,
            c.phone || null,
            c.company || null,
            c.project_type,
            toMySQLDate(c.preferred_date) || new Date().toISOString().split('T')[0],
            c.preferred_time,
            c.meeting_url || null,
            c.status || 'Pending',
            c.notes || null,
          ]
        );
      }
    }

    // 8. Sync Support Tickets
    if (Array.isArray(dbData.support_tickets)) {
      console.log(`[CodeNova Sync] Syncing ${dbData.support_tickets.length} support tickets...`);
      for (const t of dbData.support_tickets) {
        await conn.query(
          `INSERT INTO support_tickets (id, client_id, project_id, subject, category, priority, status, assigned_to)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE status=VALUES(status)`,
          [
            t.id,
            t.client_id,
            t.project_id || null,
            t.subject,
            t.category || 'Technical',
            t.priority || 'Medium',
            t.status || 'Open',
            t.assigned_to || 'Harike Desk',
          ]
        );
      }
    }

    // 9. Sync Audit Logs
    if (Array.isArray(dbData.audit_logs)) {
      console.log(`[CodeNova Sync] Syncing ${dbData.audit_logs.length} audit logs...`);
      for (const log of dbData.audit_logs) {
        await conn.query(
          `INSERT INTO audit_logs (id, user_id, user_name, user_role, action, details, ip_address, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE action=VALUES(action)`,
          [
            log.id,
            log.user_id || 'system',
            log.user_name || 'System Actor',
            log.user_role || 'admin',
            log.action,
            log.details || '',
            log.ip_address || '127.0.0.1',
            toMySQLDateTime(log.created_at) || new Date().toISOString().slice(0, 19).replace('T', ' '),
          ]
        );
      }
    }

    console.log('[CodeNova Sync] Checking updated row counts in MySQL:');
    const tables = ['services', 'leads', 'clients', 'users', 'projects', 'orders', 'invoices', 'consultations', 'support_tickets', 'audit_logs'];
    for (const t of tables) {
      const [res]: any = await conn.query(`SELECT COUNT(*) as count FROM ${t}`);
      console.log(`  ✓ ${t}: ${res[0].count} records`);
    }

    await conn.end();
    console.log('[CodeNova Sync] SUCCESS: All website data is now LIVE in your MySQL database!');
  } catch (err: any) {
    console.error('[CodeNova Sync Error]:', err.message);
  }
}

syncAllData();
