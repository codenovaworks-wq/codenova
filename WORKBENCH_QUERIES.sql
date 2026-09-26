-- =====================================================================
-- CodeNova Technologies — MySQL Workbench Query Sheet
-- Copy and run these queries in MySQL Workbench or phpMyAdmin
-- =====================================================================

-- Step 1: Select the CodeNova Database
USE codenova_db;

-- Step 2: View All Tables in the Database
SHOW TABLES;

-- =====================================================================
-- 1. VIEW ALL LEADS & INQUIRIES
-- =====================================================================
SELECT id, name, email, phone, company, service, budget, status, created_at 
FROM leads 
ORDER BY created_at DESC;

-- View only New or Qualified Leads
SELECT * FROM leads WHERE status IN ('New', 'Qualified');


-- =====================================================================
-- 2. VIEW ALL CLIENT ORGANIZATIONS
-- =====================================================================
SELECT id, name, company, email, phone, status, created_at 
FROM clients 
ORDER BY created_at DESC;


-- =====================================================================
-- 3. VIEW ALL ACTIVE ENGINEERING PROJECTS
-- =====================================================================
SELECT id, client_id, title, service_type, status, progress_percentage, budget, currency, target_delivery_date, assigned_lead 
FROM projects 
ORDER BY created_at DESC;


-- =====================================================================
-- 4. VIEW ORDERS & SERVICE BOOKINGS
-- =====================================================================
SELECT id, customer_name, customer_email, service_name, package_tier, total_amount, deposit_amount, remaining_balance, payment_status, order_status 
FROM orders 
ORDER BY created_at DESC;


-- =====================================================================
-- 5. VIEW INVOICES & BILLING
-- =====================================================================
SELECT id, invoice_number, client_id, total_amount, currency, status, due_date, paid_at, receipt_number 
FROM invoices 
ORDER BY created_at DESC;


-- =====================================================================
-- 6. VIEW DISCOVERY CONSULTATIONS & APPOINTMENTS
-- =====================================================================
SELECT id, name, email, company, project_type, preferred_date, preferred_time, meeting_url, status 
FROM consultations 
ORDER BY created_at DESC;


-- =====================================================================
-- 7. VIEW CLIENT USERS & AUTHENTICATION ACCOUNTS
-- =====================================================================
SELECT id, name, email, role, client_id, phone, status, created_at 
FROM users 
ORDER BY created_at DESC;


-- =====================================================================
-- 8. VIEW SUPPORT TICKETS & DESK
-- =====================================================================
SELECT id, client_id, subject, category, priority, status, assigned_to, created_at 
FROM support_tickets 
ORDER BY created_at DESC;


-- =====================================================================
-- 9. VIEW SECURITY & FINANCIAL AUDIT LOGS
-- =====================================================================
SELECT id, user_name, user_role, action, details, ip_address, created_at 
FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 50;


-- =====================================================================
-- 10. VIEW CATALOG OF AGENCY SERVICES
-- =====================================================================
SELECT id, slug, name, icon, status, sort_order 
FROM services 
ORDER BY sort_order ASC;
