-- =====================================================================
-- CodeNova Production Relational Database Schema (MySQL 8.0+ Compatible)
-- Location: Harike Kalan, Sri Muktsar Sahib, 152025, Punjab, India
-- Contact: +91 6280538868 | codenovaworks@gmail.com
-- =====================================================================

CREATE DATABASE IF NOT EXISTS codenova_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE codenova_db;

-- 1. Services Catalog Table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  full_description LONGTEXT NOT NULL,
  icon VARCHAR(64) NOT NULL,
  status BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  platforms JSON,
  capabilities JSON,
  deliverables JSON,
  technologies JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_service_slug (slug)
) ENGINE=InnoDB;

-- 2. Leads & CRM Table
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  company VARCHAR(255),
  country VARCHAR(100),
  service VARCHAR(128) NOT NULL,
  budget VARCHAR(64),
  timeline VARCHAR(64),
  message TEXT NOT NULL,
  status ENUM('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost') DEFAULT 'New',
  source VARCHAR(64) DEFAULT 'Website Contact Form',
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_leads_status (status),
  INDEX idx_leads_email (email)
) ENGINE=InnoDB;

-- 3. Appointments & Consultations (with Google Calendar Sync)
CREATE TABLE IF NOT EXISTS consultations (
  id VARCHAR(64) PRIMARY KEY,
  lead_id VARCHAR(64),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  company VARCHAR(255),
  project_type VARCHAR(128) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(32) NOT NULL,
  message TEXT,
  meeting_url VARCHAR(512),
  google_calendar_event_id VARCHAR(255),
  status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_consult_date (preferred_date),
  INDEX idx_consult_status (status),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Service Bookings & Orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY, -- e.g. CN-ORD-84920
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_company VARCHAR(255),
  service_id VARCHAR(64) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  package_tier ENUM('Starter', 'Business', 'Enterprise', 'Custom') NOT NULL,
  selected_addons JSON,
  total_amount DECIMAL(12, 2) NOT NULL,
  deposit_amount DECIMAL(12, 2) NOT NULL,
  remaining_balance DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'INR',
  payment_status ENUM('Pending', 'Advance_Paid', 'Fully_Paid', 'Refunded') DEFAULT 'Pending',
  order_status ENUM('Initiated', 'Requirements_Analysis', 'Architecture_Design', 'Development_Sprint', 'QA_Testing', 'Deployed', 'Delivered') DEFAULT 'Initiated',
  progress_percentage INT DEFAULT 10,
  assigned_lead VARCHAR(128) DEFAULT 'Er. Gagandeep Singh (Principal Architect)',
  target_delivery_date DATE,
  requirements_brief TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order_customer_email (customer_email),
  INDEX idx_order_status (order_status)
) ENGINE=InnoDB;

-- 5. Order Milestones & Live Tracking
CREATE TABLE IF NOT EXISTS order_milestones (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  milestone_title VARCHAR(255) NOT NULL,
  description TEXT,
  sequence_order INT NOT NULL,
  status ENUM('Pending', 'In_Progress', 'Completed') DEFAULT 'Pending',
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_milestone_order (order_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Online Payments & Gateway Transactions
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) PRIMARY KEY, -- e.g. TXN_CN_98124
  order_id VARCHAR(64) NOT NULL,
  transaction_ref VARCHAR(128) NOT NULL UNIQUE,
  payment_method ENUM('UPI', 'CARD', 'NETBANKING', 'STRIPE', 'RAZORPAY') NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'INR',
  payment_status ENUM('Success', 'Failed', 'Pending', 'Processing') DEFAULT 'Pending',
  gateway_response JSON,
  payer_vpa VARCHAR(128),
  payer_email VARCHAR(255),
  payer_phone VARCHAR(32),
  receipt_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_payment_order (order_id),
  INDEX idx_payment_status (payment_status),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Site Global Settings
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(64) PRIMARY KEY,
  setting_value LONGTEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'client') NOT NULL DEFAULT 'client',
  client_id VARCHAR(64),
  phone VARCHAR(32),
  avatar_url VARCHAR(512),
  email_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  status ENUM('Active', 'Suspended', 'Pending') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (email),
  INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 9. Clients (Tenant Accounts)
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(32) NOT NULL,
  status ENUM('Active', 'Suspended', 'Pending') DEFAULT 'Active',
  billing_address TEXT,
  gst_tax_id VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_client_email (email)
) ENGINE=InnoDB;

-- 10. Client Invitations
CREATE TABLE IF NOT EXISTS client_invitations (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  token VARCHAR(128) NOT NULL UNIQUE,
  status ENUM('Pending', 'Accepted', 'Expired') DEFAULT 'Pending',
  project_id VARCHAR(64),
  invited_by VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  INDEX idx_invite_token (token)
) ENGINE=InnoDB;

-- 11. Projects (Client Portal Workspaces)
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  client_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  service_type VARCHAR(128) NOT NULL,
  status ENUM('Inquiry', 'Planning', 'In_Progress', 'Review', 'Completed', 'On_Hold') DEFAULT 'Planning',
  progress_percentage INT DEFAULT 0,
  start_date DATE,
  target_delivery_date DATE,
  budget DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'INR',
  description LONGTEXT,
  assigned_lead VARCHAR(128) DEFAULT 'Er. Gagandeep Singh',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_project_client (client_id),
  INDEX idx_project_status (status),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Project Tasks
CREATE TABLE IF NOT EXISTS project_tasks (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) NOT NULL,
  milestone_id VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Todo', 'In_Progress', 'Done') DEFAULT 'Todo',
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  assignee VARCHAR(128),
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_task_project (project_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Deliverables & Client Approvals
CREATE TABLE IF NOT EXISTS deliverables (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) NOT NULL,
  milestone_id VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  file_url VARCHAR(512),
  version VARCHAR(32) DEFAULT 'v1.0',
  status ENUM('Pending_Approval', 'Approved', 'Revision_Requested') DEFAULT 'Pending_Approval',
  client_feedback TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  INDEX idx_deliverable_proj (project_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. Files & Versions
CREATE TABLE IF NOT EXISTS project_files (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) NOT NULL,
  client_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  file_url VARCHAR(512) NOT NULL,
  size_bytes BIGINT DEFAULT 0,
  file_type VARCHAR(64),
  folder VARCHAR(64) DEFAULT 'General',
  version VARCHAR(32) DEFAULT 'v1.0',
  uploaded_by_name VARCHAR(128) NOT NULL,
  uploaded_by_role ENUM('super_admin', 'admin', 'client') NOT NULL,
  client_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_file_proj (project_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 15. Messages & Project Chat
CREATE TABLE IF NOT EXISTS project_messages (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) NOT NULL,
  sender_id VARCHAR(64) NOT NULL,
  sender_name VARCHAR(128) NOT NULL,
  sender_role ENUM('super_admin', 'admin', 'client') NOT NULL,
  message TEXT NOT NULL,
  attachment_url VARCHAR(512),
  attachment_name VARCHAR(255),
  read_by_client BOOLEAN DEFAULT FALSE,
  read_by_admin BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_msg_proj (project_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 16. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id VARCHAR(64) PRIMARY KEY,
  client_id VARCHAR(64) NOT NULL,
  project_id VARCHAR(64),
  subject VARCHAR(255) NOT NULL,
  category ENUM('Bug', 'Change_Request', 'Billing', 'Technical', 'General') DEFAULT 'Technical',
  priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  status ENUM('Open', 'In_Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  assigned_to VARCHAR(128) DEFAULT 'Engineering Desk',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ticket_client (client_id),
  INDEX idx_ticket_status (status),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 17. Support Ticket Messages
CREATE TABLE IF NOT EXISTS support_messages (
  id VARCHAR(64) PRIMARY KEY,
  ticket_id VARCHAR(64) NOT NULL,
  sender_id VARCHAR(64) NOT NULL,
  sender_name VARCHAR(128) NOT NULL,
  sender_role ENUM('super_admin', 'admin', 'client') NOT NULL,
  message TEXT NOT NULL,
  attachment_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_support_msg_ticket (ticket_id),
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 18. Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(64) PRIMARY KEY,
  invoice_number VARCHAR(64) NOT NULL UNIQUE,
  client_id VARCHAR(64) NOT NULL,
  project_id VARCHAR(64),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Sent',
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_rate_percent DECIMAL(5, 2) DEFAULT 18.00,
  tax_amount DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'INR',
  notes TEXT,
  paid_at TIMESTAMP NULL,
  payment_method VARCHAR(64),
  receipt_number VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_invoice_client (client_id),
  INDEX idx_invoice_status (status),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 19. Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id VARCHAR(64) PRIMARY KEY,
  invoice_id VARCHAR(64) NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  INDEX idx_item_invoice (invoice_id),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 20. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('project', 'invoice', 'deliverable', 'ticket', 'message', 'system') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user (user_id)
) ENGINE=InnoDB;

-- 21. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  user_name VARCHAR(128) NOT NULL,
  user_role ENUM('super_admin', 'admin', 'client') NOT NULL,
  action VARCHAR(128) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

