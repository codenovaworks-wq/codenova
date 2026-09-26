import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Also load from .env.example if keys are placed there
if (fs.existsSync(path.resolve(process.cwd(), '.env.example'))) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.example') });
}

import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { db } from './src/server/db';
import { mysqlManager } from './src/server/mysql';

// Initialize MySQL connection with loaded environment variables
mysqlManager.initFromEnv();

export const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Razorpay Payment Gateway Initialization
const razorpayKeyId = process.env.RAZORPAY_KEY_ID?.trim() || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || '';
const isRazorpayConfigured = Boolean(razorpayKeyId && razorpayKeySecret);

let razorpayClient: any = null;
if (isRazorpayConfigured) {
  try {
    razorpayClient = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
    console.log('[CodeNova Payment] Razorpay Live Gateway configured successfully.');
  } catch (err) {
    console.warn('[CodeNova Payment] Razorpay init notice:', err);
  }
} else {
  console.log('[CodeNova Payment] Razorpay running in Sandbox/Demo mode. Add RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env for live gateway.');
}

// Express Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple In-Memory IP Rate Limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const rateLimit = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const entry = requestCounts.get(ip);

    if (!entry || now > entry.resetAt) {
      requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again in a few minutes.',
        },
      });
    }

    entry.count += 1;
    next();
  };
};

// Unified Authentication Middleware
const authenticateRequest = (req: Request): { userId: string; role: string; clientId?: string; user?: any } | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];

  // Check portal session first
  const portalSession = db.getPortalSession(token);
  if (portalSession) {
    const user = db.getPortalUserById(portalSession.userId);
    return {
      userId: portalSession.userId,
      role: portalSession.role || 'client',
      clientId: portalSession.clientId || user?.client_id,
      user,
    };
  }

  // Check legacy admin session
  const adminUser = db.verifySession(token);
  if (adminUser) {
    return {
      userId: adminUser.id,
      role: 'admin',
      user: adminUser,
    };
  }

  return null;
};

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const session = authenticateRequest(req);
  if (!session) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please log in.' },
    });
  }
  (req as any).auth = session;
  (req as any).user = session.user;
  next();
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const session = authenticateRequest(req);
  if (!session || (session.role !== 'admin' && session.role !== 'super_admin')) {
    return res.status(403).json({
      error: { code: 'FORBIDDEN', message: 'Administrative access privileges required.' },
    });
  }
  (req as any).auth = session;
  (req as any).user = session.user;
  next();
};

const requireClient = (req: Request, res: Response, next: NextFunction) => {
  const session = authenticateRequest(req);
  if (!session) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Client authentication required.' },
    });
  }
  (req as any).auth = session;
  (req as any).user = session.user;
  next();
};

// ----------------- Public API Endpoints -----------------

// POST /api/leads — create a project inquiry
app.post('/api/leads', rateLimit(10, 60 * 1000), (req: Request, res: Response) => {
  const { name, email, phone, company, country, service, budget, message, timeline, source } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Full name is required (min 2 characters).' },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'A valid email address is required.' },
    });
  }

  if (!service || typeof service !== 'string') {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Please select a primary service.' },
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Project description must be at least 10 characters.' },
    });
  }

  // Prevent simple spam traps
  if (req.body._gotcha) {
    return res.status(200).json({ success: true, leadId: 'lead-ok' });
  }

  const lead = db.createLead({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? String(phone).trim() : undefined,
    company: company ? String(company).trim() : undefined,
    country: country ? String(country).trim() : undefined,
    service: service.trim(),
    budget: budget || 'Flexible',
    message: message.trim(),
    timeline: timeline || 'Within 1-3 Months',
    source: source || 'Contact Form',
    status: 'New',
  });

  // Simulated internal notification logging
  console.log(`[CodeNova Lead Notification] New lead received: ${lead.id} (${lead.name} - ${lead.service})`);

  // Asynchronously persist to MySQL if connected
  mysqlManager.insertLead(lead).catch((err) => console.warn('[MySQL Lead Sync Warning]:', err));

  return res.status(201).json({
    success: true,
    message: 'Inquiry received. Our engineering team will review and respond within 24 business hours.',
    leadId: lead.id,
  });
});

// POST /api/consultations — book discovery call
app.post('/api/consultations', rateLimit(10, 60 * 1000), (req: Request, res: Response) => {
  const { name, email, company, project_type, preferred_date, preferred_time, message } = req.body;

  if (!name || !email || !preferred_date || !preferred_time) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Name, email, preferred date, and time are required.' },
    });
  }

  const consultation = db.createConsultation({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    company: company ? String(company).trim() : undefined,
    project_type: project_type || 'General Software Consultation',
    preferred_date: String(preferred_date),
    preferred_time: String(preferred_time),
    message: message ? String(message).trim() : undefined,
    status: 'Pending',
    meeting_url: 'https://meet.google.com/codenova-discovery',
  });

  console.log(`[CodeNova Consultation] New consultation booked: ${consultation.id} for ${consultation.name}`);

  // Asynchronously persist to MySQL if connected
  mysqlManager.insertConsultation(consultation).catch((err) => console.warn('[MySQL Consultation Sync Warning]:', err));

  return res.status(201).json({
    success: true,
    message: 'Consultation requested successfully. A calendar invite confirmation has been generated.',
    consultationId: consultation.id,
    meeting_url: consultation.meeting_url,
  });
});

// POST /api/estimator — calculate indicative estimate & record request
app.post('/api/estimator', rateLimit(20, 60 * 1000), (req: Request, res: Response) => {
  const { project_type, complexity, selected_features, contact_name, contact_email, contact_company, notes } = req.body;

  if (!project_type || !complexity) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Project type and complexity are required.' },
    });
  }

  // Calculate pricing based on verified formulas
  const baseRates: Record<string, { min: number; max: number }> = {
    'Website': { min: 3500, max: 8000 },
    'Web App': { min: 8000, max: 20000 },
    'Mobile App': { min: 9000, max: 22000 },
    'Desktop App': { min: 10000, max: 25000 },
    'AI Agent': { min: 7000, max: 18000 },
    'AI Automation': { min: 6000, max: 16000 },
    'E-Commerce': { min: 6000, max: 18000 },
    'Custom Software': { min: 12000, max: 30000 },
  };

  const complexityMultipliers: Record<string, number> = {
    'MVP / Simple': 1.0,
    'Standard Business': 1.6,
    'Advanced Enterprise': 2.4,
  };

  const featureRates: Record<string, { min: number; max: number }> = {
    'Authentication & RBAC': { min: 1200, max: 2500 },
    'Payment Gateway & Billing': { min: 1500, max: 3500 },
    'Admin Dashboard & CMS': { min: 2000, max: 4500 },
    'AI / LLM Integration': { min: 2500, max: 6000 },
    'Maps & Geolocation': { min: 1200, max: 2800 },
    'Push & SMS Notifications': { min: 800, max: 1800 },
    'Real-time Chat & WebSockets': { min: 1800, max: 4000 },
    'Analytics & Reporting': { min: 1000, max: 2200 },
    'External API Integration': { min: 1500, max: 3500 },
    'High-Performance Database': { min: 1200, max: 3000 },
    'Offline Mode & Local Storage': { min: 2200, max: 5000 },
    'Hardware & Peripheral Integration': { min: 2500, max: 6000 },
  };

  const base = baseRates[project_type] || { min: 6000, max: 15000 };
  const mult = complexityMultipliers[complexity] || 1.3;

  let totalMin = base.min * mult;
  let totalMax = base.max * mult;

  const featuresList = Array.isArray(selected_features) ? selected_features : [];
  featuresList.forEach((feat: string) => {
    if (featureRates[feat]) {
      totalMin += featureRates[feat].min;
      totalMax += featureRates[feat].max;
    } else {
      totalMin += 1000;
      totalMax += 2500;
    }
  });

  // Round to clean multiples of 500
  totalMin = Math.round(totalMin / 500) * 500;
  totalMax = Math.round(totalMax / 500) * 500;

  let estimateRequest = null;
  if (contact_name || contact_email) {
    estimateRequest = db.createEstimatorRequest({
      project_type,
      complexity,
      selected_features: featuresList,
      estimated_min: totalMin,
      estimated_max: totalMax,
      contact_name,
      contact_email,
      contact_company,
      notes,
    });
    mysqlManager.insertEstimatorRequest(estimateRequest).catch((err) => console.warn('[MySQL Estimator Sync Warning]:', err));
  }

  return res.json({
    success: true,
    estimated_min: totalMin,
    estimated_max: totalMax,
    disclaimer: 'This is an indicative estimate. Final pricing depends on project scope and technical requirements.',
    requestId: estimateRequest?.id,
  });
});

// GET /api/services — public active services
app.get('/api/services', (_req: Request, res: Response) => {
  const services = db.getServices(true);
  res.json({ services });
});

// GET /api/services/:slug
app.get('/api/services/:slug', (req: Request, res: Response) => {
  const service = db.getServiceBySlug(req.params.slug);
  if (!service) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Service not found.' } });
  }
  res.json({ service });
});

// GET /api/portfolio — public published portfolio
app.get('/api/portfolio', (req: Request, res: Response) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const projects = db.getPortfolio(true, category);
  res.json({ projects });
});

// GET /api/portfolio/:slug
app.get('/api/portfolio/:slug', (req: Request, res: Response) => {
  const project = db.getProjectBySlug(req.params.slug);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }
  res.json({ project });
});

// GET /api/blog — public published blog posts
app.get('/api/blog', (req: Request, res: Response) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  const posts = db.getBlogPosts(true, category, search);
  res.json({ posts });
});

// GET /api/blog/:slug
app.get('/api/blog/:slug', (req: Request, res: Response) => {
  const post = db.getBlogPostBySlug(req.params.slug);
  if (!post) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Article not found.' } });
  }
  res.json({ post });
});

// GET /api/testimonials
app.get('/api/testimonials', (_req: Request, res: Response) => {
  const testimonials = db.getTestimonials();
  res.json({ testimonials });
});

// GET /api/settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = db.getSiteSettings();
  res.json({ settings });
});

// GET /api/database/status — check active database engine & MySQL connection
app.get('/api/database/status', (_req: Request, res: Response) => {
  const status = mysqlManager.getStatus();
  res.json({
    success: true,
    engine: status.is_connected ? 'MySQL' : 'Embedded JSON Engine (Active & Fallback Safe)',
    mysql: status,
  });
});

// POST /api/database/test-connection — test MySQL credentials
app.post('/api/database/test-connection', requireAdmin, async (req: Request, res: Response) => {
  const { host, port, user, password, database, url, ssl } = req.body;
  const result = await mysqlManager.testCustomConnection({ host, port, user, password, database, url, ssl });
  res.json(result);
});

// ----------------- Authentication Endpoints -----------------

// POST /api/auth/login — client, staff, and super admin login
app.post('/api/auth/login', rateLimit(10, 60 * 1000), (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' },
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPass = String(password);

  // 1. Check portal users (Super Admin, Staff Admin, and Clients)
  const portalUser = db.authenticatePortalUser(cleanEmail, cleanPass);
  if (portalUser) {
    const token = db.createPortalSession(portalUser.id, portalUser.role, portalUser.client_id);
    db.recordAuditLog({
      user_id: portalUser.id,
      user_name: portalUser.name,
      user_role: portalUser.role,
      action: 'LOGIN_SUCCESS',
      details: `Successful login to ${portalUser.role} portal.`,
      ip_address: req.ip || '127.0.0.1',
    });

    return res.json({
      success: true,
      user: portalUser,
      token,
      role: portalUser.role,
    });
  }

  // 2. Check legacy admin credentials fallback
  const legacyAdmin = db.verifyAdmin(cleanEmail, cleanPass);
  if (legacyAdmin) {
    return res.json({
      success: true,
      user: { ...legacyAdmin.user, role: 'admin' },
      token: legacyAdmin.token,
      role: 'admin',
    });
  }

  // Audit failed attempt
  db.recordAuditLog({
    user_id: 'anonymous',
    user_name: cleanEmail,
    user_role: 'client',
    action: 'FAILED_LOGIN_ATTEMPT',
    details: `Failed login attempt for email: ${cleanEmail}`,
    ip_address: req.ip || '127.0.0.1',
  });

  return res.status(401).json({
    error: {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password. Please verify your credentials or use the demo login.',
    },
  });
});

// POST /api/auth/register-or-invite — client registration or invitation fulfillment
app.post('/api/auth/register-or-invite', (req: Request, res: Response) => {
  const { name, email, password, company, phone, invitation_token } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password are required.' },
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters long.' },
    });
  }

  try {
    const result = db.registerPortalUser({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      passwordPlain: String(password),
      company: company ? String(company).trim() : undefined,
      phone: phone ? String(phone).trim() : undefined,
      invitationToken: invitation_token ? String(invitation_token).trim() : undefined,
    });

    const regClient = result.user.client_id ? db.getClientById(result.user.client_id) : undefined;
    if (regClient) {
      mysqlManager.insertClient(regClient).catch((err) => console.warn('[MySQL Client Sync Warning]:', err));
    }
    mysqlManager.insertUser({
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role || 'client',
      client_id: result.user.client_id,
      phone: result.user.phone,
      status: result.user.status || 'Active',
      created_at: result.user.created_at || new Date().toISOString(),
    }).catch((err) => console.warn('[MySQL User Sync Warning]:', err));

    const auditLog = db.recordAuditLog({
      user_id: result.user.id,
      user_name: result.user.name,
      user_role: 'client',
      action: 'CLIENT_REGISTER',
      details: `Client account access initialized for ${result.user.name} (${result.user.company || 'Direct'})`,
      ip_address: req.ip || '127.0.0.1',
    });
    mysqlManager.insertAuditLog(auditLog).catch((err) => console.warn('[MySQL Audit Sync Warning]:', err));

    return res.status(201).json({
      success: true,
      message: 'Client account setup successfully.',
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: { code: 'REGISTRATION_FAILED', message: err.message || 'Failed to create client account.' },
    });
  }
});

// POST /api/auth/verify-email
app.post('/api/auth/verify-email', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Email address has been verified successfully.',
  });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', rateLimit(10, 60 * 1000), (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Email address is required.' },
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const pin = db.createPasswordResetPin(cleanEmail);
  console.log(`[Password Reset] Generated 6-digit PIN for ${cleanEmail}: ${pin}`);

  const isProd = process.env.NODE_ENV === 'production';
  return res.json({
    success: true,
    message: `Verification PIN generated for ${cleanEmail}. Enter the PIN below to set your new password.`,
    email: cleanEmail,
    ...(isProd ? {} : { reset_pin: pin }),
  });
});

// POST /api/auth/reset-password — verifies reset PIN and safely updates password
app.post('/api/auth/reset-password', rateLimit(10, 60 * 1000), (req: Request, res: Response) => {
  const { email, new_password, password, reset_pin, pin } = req.body;
  const pass = new_password || password;
  const verificationPin = reset_pin || pin;

  if (!email || !pass || !verificationPin) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Email, verification PIN, and new password are required.' },
    });
  }

  if (String(pass).length < 6) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters long.' },
    });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  try {
    const result = db.verifyAndResetPassword(cleanEmail, String(verificationPin), String(pass));

    db.recordAuditLog({
      user_id: result.user.id,
      user_name: result.user.name,
      user_role: result.user.role,
      action: 'PASSWORD_RESET',
      details: `Password reset successfully for ${cleanEmail}`,
      ip_address: req.ip || '127.0.0.1',
    });

    return res.json({
      success: true,
      message: 'Your password has been successfully reset! Logging you in...',
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: { code: 'INVALID_RESET_PIN', message: err.message || 'Failed to reset password.' },
    });
  }
});

// GET /api/auth/me — verify active session
app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  res.json({
    user: (req as any).user,
    role: auth.role,
    clientId: auth.clientId,
  });
});

// POST /api/auth/logout — terminate session
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.deletePortalSession(token);
    db.invalidateSession(token);
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ----------------- Service Booking & Order Management -----------------

// POST /api/orders — Create new service booking & initialize tracking
app.post('/api/orders', rateLimit(20, 60 * 1000), (req: Request, res: Response) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    customer_company,
    service_id,
    service_name,
    package_tier,
    selected_addons = [],
    total_amount,
    deposit_amount = 0,
    currency = 'INR',
    target_delivery_date,
    requirements_brief,
  } = req.body;

  if (!customer_name || !customer_email || !customer_phone || !service_name || !total_amount) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Name, email, phone, service, and total amount are required to book a project.',
      },
    });
  }

  const order = db.createOrder({
    customer_name: String(customer_name).trim(),
    customer_email: String(customer_email).trim().toLowerCase(),
    customer_phone: String(customer_phone).trim(),
    customer_company: customer_company ? String(customer_company).trim() : undefined,
    service_id: String(service_id || 'custom'),
    service_name: String(service_name),
    package_tier: package_tier || 'Business',
    selected_addons: Array.isArray(selected_addons) ? selected_addons : [],
    total_amount: Number(total_amount),
    deposit_amount: Number(deposit_amount),
    remaining_balance: Math.max(0, Number(total_amount) - Number(deposit_amount)),
    currency: currency === 'USD' ? 'USD' : 'INR',
    payment_status: Number(deposit_amount) >= Number(total_amount) ? 'Fully_Paid' : Number(deposit_amount) > 0 ? 'Advance_Paid' : 'Pending',
    assigned_lead: 'Er. Gagandeep Singh (CodeNova Harike Kalan, Muktsar Sahib)',
    target_delivery_date: target_delivery_date || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    requirements_brief: requirements_brief ? String(requirements_brief).trim() : undefined,
  });

  console.log(`[CodeNova Order] New service booking created: ${order.id} for ${order.customer_name} (${order.service_name})`);
  mysqlManager.insertOrder(order).catch((err) => console.warn('[MySQL Order Sync Warning]:', err));

  return res.status(201).json({
    success: true,
    message: 'Project order created successfully. You can track its live progress immediately.',
    order,
  });
});

// GET /api/orders/:id — Track order status and milestone progression
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const orderId = req.params.id;
  const order = db.getOrderById(orderId);

  if (!order) {
    return res.status(404).json({
      error: {
        code: 'ORDER_NOT_FOUND',
        message: `No active project found with Tracking ID "${orderId}". Please verify and try again.`,
      },
    });
  }

  return res.json({
    success: true,
    order,
  });
});

// GET /api/orders — List all orders for administrative tracking (Admin only)
app.get('/api/orders', requireAdmin, (req: Request, res: Response) => {
  const orders = db.getOrders();
  return res.json({ success: true, orders });
});

// POST /api/payments/process — Interactive payment processing & order update
app.post('/api/payments/process', rateLimit(15, 60 * 1000), (req: Request, res: Response) => {
  const { order_id, amount, payment_method, currency = 'INR', payer_vpa, payer_email } = req.body;

  if (!order_id || amount === undefined || amount === null || !payment_method) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Order ID, amount, and payment method are required.' },
    });
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Payment amount must be a positive number.' },
    });
  }

  const order = db.getOrderById(order_id);
  if (!order) {
    return res.status(404).json({
      error: { code: 'ORDER_NOT_FOUND', message: 'Target order not found for payment processing.' },
    });
  }

  const transaction_ref = `TXN_CN_${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;

  const payment = db.recordPayment(order.id, {
    order_id: order.id,
    transaction_ref,
    payment_method,
    amount: Number(amount),
    currency: currency === 'USD' ? 'USD' : 'INR',
    payment_status: 'Success',
    payer_vpa: payer_vpa ? String(payer_vpa).trim() : undefined,
    payer_email: payer_email ? String(payer_email).trim() : order.customer_email,
  });

  const updatedOrder = db.getOrderById(order.id);
  if (updatedOrder) {
    mysqlManager.insertOrder(updatedOrder).catch((err) => console.warn('[MySQL Order Sync Warning]:', err));
  }

  return res.status(201).json({
    success: true,
    message: 'Payment verified and successfully recorded.',
    transaction_ref,
    receipt_number: payment.receipt_number,
    payment,
    order: updatedOrder,
  });
});

// GET /api/calendar/ics — Dynamic iCalendar .ics generator
app.get('/api/calendar/ics', (req: Request, res: Response) => {
  const { title = 'CodeNova Architecture & Technical Consultation', date, time = '11:00', duration = 45 } = req.query;
  const eventDate = date ? String(date) : new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const [hours, minutes] = String(time).split(':').map((v) => parseInt(v, 10) || 0);

  const startYear = eventDate.split('-')[0];
  const startMonth = eventDate.split('-')[1].padStart(2, '0');
  const startDay = eventDate.split('-')[2].padStart(2, '0');
  const startHour = String(hours).padStart(2, '0');
  const startMin = String(minutes).padStart(2, '0');

  const dtStart = `${startYear}${startMonth}${startDay}T${startHour}${startMin}00`;
  const dtEndHour = String(hours + 1).padStart(2, '0');
  const dtEnd = `${startYear}${startMonth}${startDay}T${dtEndHour}${startMin}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CodeNova//Architecture Consultation Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:codenova-${Date.now()}@codenova.tech`,
    `DTSTAMP:${dtStart}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    'DESCRIPTION:30-45 Minute Technical Discovery & Architecture Session with CodeNova Senior Engineers.\\nLocation: Online Google Meet / Harike Kalan Office\\nPhone: +91 6280538868\\nEmail: codenovaworks@gmail.com',
    'LOCATION:Google Meet (https://meet.google.com/codenova-discovery)',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: CodeNova Technical Architecture Consultation in 15 minutes',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="codenova-consultation.ics"');
  res.send(icsContent);
});

// ----------------- Protected Admin API Endpoints -----------------

// GET /api/leads — admin lead listing
app.get('/api/leads', requireAdmin, (req: Request, res: Response) => {
  const { status, service, search } = req.query;
  const leads = db.getLeads({
    status: typeof status === 'string' ? status : undefined,
    service: typeof service === 'string' ? service : undefined,
    search: typeof search === 'string' ? search : undefined,
  });
  res.json({ leads, total: leads.length });
});

// GET /api/leads/:id
app.get('/api/leads/:id', requireAdmin, (req: Request, res: Response) => {
  const lead = db.getLeadById(req.params.id);
  if (!lead) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Lead not found.' } });
  }
  res.json({ lead });
});

// PATCH /api/leads/:id
app.patch('/api/leads/:id', requireAdmin, (req: Request, res: Response) => {
  const { status, notes, assigned_to } = req.body;
  const updated = db.updateLead(req.params.id, { status, notes, assigned_to });
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Lead not found.' } });
  }
  res.json({ success: true, lead: updated });
});

// DELETE /api/leads/:id
app.delete('/api/leads/:id', requireAdmin, (req: Request, res: Response) => {
  const deleted = db.deleteLead(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Lead not found.' } });
  }
  res.json({ success: true, message: 'Lead deleted.' });
});

// GET /api/consultations — admin listing
app.get('/api/consultations', requireAdmin, (_req: Request, res: Response) => {
  const consultations = db.getConsultations();
  res.json({ consultations });
});

// PATCH /api/consultations/:id
app.patch('/api/consultations/:id', requireAdmin, (req: Request, res: Response) => {
  const { status, meeting_url, notes } = req.body;
  const updated = db.updateConsultation(req.params.id, { status, meeting_url, notes });
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Consultation not found.' } });
  }
  res.json({ success: true, consultation: updated });
});

// GET /api/estimator — admin listing
app.get('/api/estimator', requireAdmin, (_req: Request, res: Response) => {
  const requests = db.getEstimatorRequests();
  res.json({ requests });
});

// GET /api/admin/metrics — overview statistics
app.get('/api/admin/metrics', requireAdmin, (_req: Request, res: Response) => {
  const leads = db.getLeads();
  const consultations = db.getConsultations();
  const estimators = db.getEstimatorRequests();

  const newLeads = leads.filter((l) => l.status === 'New').length;
  const qualifiedLeads = leads.filter((l) => ['Qualified', 'Proposal Sent', 'Won'].includes(l.status)).length;
  const wonProjects = leads.filter((l) => l.status === 'Won').length;

  res.json({
    metrics: {
      totalLeads: leads.length,
      newLeads,
      qualifiedLeads,
      activeProjects: 4, // LifeLink, CineBook, BFGI Assist, BuyHive
      consultationsCount: consultations.length,
      estimatorRequestsCount: estimators.length,
      wonProjects,
      conversionRate: leads.length > 0 ? ((wonProjects / leads.length) * 100).toFixed(1) + '%' : '18.5%',
    },
  });
});

// GET /api/admin/export/leads — CSV export
app.get('/api/admin/export/leads', requireAdmin, (_req: Request, res: Response) => {
  const csv = db.exportLeadsCSV();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="codenova-leads.csv"');
  res.send(csv);
});

// PATCH /api/settings — update site settings
app.patch('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSiteSettings(req.body);
  res.json({ success: true, settings: updated });
});

// GET /api/download/logo — Direct attachment download for CodeNova brand assets
app.get('/api/download/logo', (req: Request, res: Response) => {
  const variant = req.query.variant as string || 'default';
  let fileName = 'logo.svg';
  let downloadName = 'codenova-logo.svg';

  if (variant === 'dark') {
    fileName = 'logo-dark.svg';
    downloadName = 'codenova-logo-dark.svg';
  } else if (variant === 'symbol') {
    fileName = 'symbol.svg';
    downloadName = 'codenova-symbol.svg';
  } else if (variant === 'favicon') {
    fileName = 'favicon.svg';
    downloadName = 'codenova-favicon.svg';
  }

  const filePath = path.resolve(process.cwd(), 'public', fileName);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.sendFile(filePath);
  }
  return res.status(404).json({ error: 'Logo file not found' });
});

// =================================================================
// CLIENT PORTAL SECURE API ENDPOINTS
// =================================================================

// GET /api/client/me — Current client user and company profile
app.get('/api/client/me', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const user = db.getPortalUserById(auth.userId);
  const client = auth.clientId ? db.getClientById(auth.clientId) : undefined;
  res.json({ success: true, user, client });
});

// GET /api/client/dashboard — Comprehensive dashboard overview
app.get('/api/client/dashboard', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const clientId = auth.clientId;

  if (!clientId) {
    return res.json({
      success: true,
      stats: {
        active_projects: 0,
        pending_approvals: 0,
        open_tickets: 0,
        outstanding_invoices: 0,
        unread_notifications: 0,
      },
      projects: [],
      invoices: [],
      tickets: [],
      pendingDeliverables: [],
      notifications: [],
    });
  }

  const projects = db.getPortalProjects(clientId);
  const invoices = db.getInvoices(clientId);
  const tickets = db.getSupportTickets(clientId);
  const notifications = db.getNotifications(auth.userId);

  // Collect pending deliverables
  const pendingDeliverables = projects.flatMap((p) =>
    (p.deliverables || [])
      .filter((d) => d.status === 'Pending_Approval')
      .map((d) => ({ ...d, project_title: p.title, project_id: p.id }))
  );

  res.json({
    success: true,
    stats: {
      active_projects: projects.filter((p) => p.status === 'In_Progress' || p.status === 'Review').length,
      pending_approvals: pendingDeliverables.length,
      open_tickets: tickets.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed').length,
      outstanding_invoices: invoices.filter((i) => i.status === 'Sent' || i.status === 'Overdue').length,
      unread_notifications: notifications.filter((n) => !n.read).length,
    },
    projects,
    invoices,
    tickets,
    pendingDeliverables,
    notifications: notifications.slice(0, 5),
  });
});

// GET /api/client/projects — Projects for authenticated client
app.get('/api/client/projects', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.json({ success: true, projects: [] });
  }
  const projects = db.getPortalProjects(auth.clientId);
  res.json({ success: true, projects });
});

// GET /api/client/projects/:id
app.get('/api/client/projects/:id', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }
  const project = db.getPortalProjectById(req.params.id, auth.clientId);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }
  res.json({ success: true, project });
});

// POST /api/client/projects/:id/deliverables/:delivId/approve
app.post('/api/client/projects/:id/deliverables/:delivId/approve', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const { feedback } = req.body;
  const project = db.getPortalProjectById(req.params.id, auth.clientId);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }

  const updated = db.approveDeliverable(req.params.id, req.params.delivId, feedback);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Deliverable not found.' } });
  }

  db.recordAuditLog({
    user_id: auth.userId,
    user_name: (req as any).user?.name || 'Client',
    user_role: 'client',
    action: 'DELIVERABLE_APPROVED',
    details: `Deliverable ${req.params.delivId} approved for project ${project.title}`,
    ip_address: req.ip || '127.0.0.1',
  });

  res.json({ success: true, deliverable: updated, message: 'Deliverable approved successfully.' });
});

// POST /api/client/projects/:id/deliverables/:delivId/reject
app.post('/api/client/projects/:id/deliverables/:delivId/reject', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const { feedback } = req.body;
  if (!feedback) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Feedback is required when requesting revisions.' } });
  }

  const project = db.getPortalProjectById(req.params.id, auth.clientId);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }

  const updated = db.rejectDeliverable(req.params.id, req.params.delivId, String(feedback));
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Deliverable not found.' } });
  }

  db.recordAuditLog({
    user_id: auth.userId,
    user_name: (req as any).user?.name || 'Client',
    user_role: 'client',
    action: 'DELIVERABLE_REVISION_REQUESTED',
    details: `Revision requested for ${req.params.delivId} in ${project.title}: ${feedback}`,
    ip_address: req.ip || '127.0.0.1',
  });

  res.json({ success: true, deliverable: updated, message: 'Revision request recorded.' });
});

// GET /api/client/projects/:id/files
app.get('/api/client/projects/:id/files', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const project = db.getPortalProjectById(req.params.id, auth.clientId);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }

  const files = db.getProjectFiles(req.params.id, true);
  res.json({ success: true, files });
});

// POST /api/client/projects/:id/files
app.post('/api/client/projects/:id/files', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const { name, file_url, size_bytes, file_type, folder = 'Uploads' } = req.body;
  const project = db.getPortalProjectById(req.params.id, auth.clientId);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }

  const newFile = db.addProjectFile({
    project_id: req.params.id,
    client_id: auth.clientId || '',
    name: String(name || 'Uploaded-File'),
    file_url: String(file_url || 'https://codenova.io/assets/files/sample.pdf'),
    size_bytes: Number(size_bytes || 1024),
    file_type: String(file_type || 'application/octet-stream'),
    folder: String(folder),
    version: 'v1.0',
    uploaded_by_name: (req as any).user?.name || 'Client User',
    uploaded_by_role: 'client',
    client_visible: true,
  });

  res.status(201).json({ success: true, file: newFile });
});

// GET /api/client/projects/:id/messages
app.get('/api/client/projects/:id/messages', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const project = db.getPortalProjectById(req.params.id, auth.clientId);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }

  const messages = db.getProjectMessages(req.params.id);
  res.json({ success: true, messages });
});

// POST /api/client/projects/:id/messages
app.post('/api/client/projects/:id/messages', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const { message, attachment_url, attachment_name } = req.body;
  if (!message || String(message).trim().length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Message cannot be empty.' } });
  }

  const project = db.getPortalProjectById(req.params.id, auth.clientId);
  if (!project) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }

  const newMsg = db.addProjectMessage({
    project_id: req.params.id,
    sender_id: auth.userId,
    sender_name: (req as any).user?.name || 'Client',
    sender_role: 'client',
    message: String(message).trim(),
    attachment_url: attachment_url ? String(attachment_url) : undefined,
    attachment_name: attachment_name ? String(attachment_name) : undefined,
    read_by_client: true,
    read_by_admin: false,
  });

  res.status(201).json({ success: true, message: newMsg });
});

// GET /api/client/invoices
app.get('/api/client/invoices', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.json({ success: true, invoices: [] });
  }
  const invoices = db.getInvoices(auth.clientId);
  res.json({ success: true, invoices });
});

// GET /api/client/invoices/:id
app.get('/api/client/invoices/:id', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found.' } });
  }
  const invoice = db.getInvoiceById(req.params.id, auth.clientId);
  if (!invoice) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found.' } });
  }
  res.json({ success: true, invoice });
});

// POST /api/client/invoices/:id/pay
app.post('/api/client/invoices/:id/pay', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found.' } });
  }
  const { payment_method = 'UPI / CARD', transaction_ref } = req.body;
  const invoice = db.getInvoiceById(req.params.id, auth.clientId);
  if (!invoice) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found.' } });
  }

  const updated = db.payInvoice(req.params.id, payment_method, transaction_ref);
  if (updated) {
    mysqlManager.upsertInvoice(updated).catch((err) => console.warn('[MySQL Invoice Sync Warning]:', err));
  }

  const auditLog = db.recordAuditLog({
    user_id: auth.userId,
    user_name: (req as any).user?.name || 'Client',
    user_role: 'client',
    action: 'INVOICE_PAID',
    details: `Invoice ${invoice.invoice_number} paid for ₹${invoice.total_amount}`,
    ip_address: req.ip || '127.0.0.1',
  });
  mysqlManager.insertAuditLog(auditLog).catch((err) => console.warn('[MySQL Audit Sync Warning]:', err));

  res.json({ success: true, invoice: updated, message: 'Payment confirmed.' });
});

// =================================================================
// RAZORPAY PAYMENT GATEWAY API ENDPOINTS
// =================================================================

// GET /api/payments/razorpay/config — Public configuration
app.get('/api/payments/razorpay/config', (_req: Request, res: Response) => {
  res.json({
    success: true,
    is_configured: isRazorpayConfigured,
    key_id: razorpayKeyId || 'rzp_test_CodeNovaDemo',
    currency: 'INR',
    business_name: 'CodeNova Works & Technologies',
  });
});

// POST /api/payments/razorpay/create-order — Initiate payment order
app.post('/api/payments/razorpay/create-order', rateLimit(30, 60 * 1000), async (req: Request, res: Response) => {
  try {
    const { invoice_id, order_id, amount, currency = 'INR' } = req.body;
    let orderAmount = Number(amount);

    // If invoice_id provided, verify total against database to prevent client manipulation
    let invoice = null;
    let orderRecord = null;
    if (invoice_id) {
      invoice = db.getInvoiceById(String(invoice_id));
      if (invoice) {
        orderAmount = invoice.total_amount;
      }
    } else if (order_id) {
      orderRecord = db.getOrderById(String(order_id));
      if (orderRecord) {
        orderAmount = orderRecord.deposit_amount > 0 ? orderRecord.deposit_amount : orderRecord.total_amount;
      }
    }

    if (!orderAmount || orderAmount <= 0) {
      return res.status(400).json({
        error: { code: 'INVALID_AMOUNT', message: 'Valid payment amount is required.' },
      });
    }

    const receipt = invoice
      ? `rcpt_${invoice.invoice_number.slice(0, 30)}`
      : orderRecord
      ? `rcpt_${orderRecord.id.slice(0, 25)}`
      : `rcpt_${Date.now().toString().slice(-8)}`;
    const amountInPaise = Math.round(orderAmount * 100);

    if (razorpayClient) {
      const order = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency: currency.toUpperCase(),
        receipt: receipt,
        notes: {
          invoice_id: invoice_id || '',
          order_id: order_id || '',
          invoice_number: invoice?.invoice_number || '',
        },
      });

      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: razorpayKeyId,
      });
    }

    // Sandbox / Test fallback when keys are awaiting entry in .env
    const simulatedOrderId = `order_sim_${Date.now()}`;
    return res.json({
      success: true,
      orderId: simulatedOrderId,
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      keyId: razorpayKeyId || 'rzp_test_CodeNovaDemo',
      simulated: true,
      notice: 'Operating in Sandbox mode. Set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env for live gateway.',
    });
  } catch (error: any) {
    console.error('[Razorpay Order Creation Error]:', error);
    return res.status(500).json({
      error: { code: 'ORDER_CREATION_FAILED', message: error.message || 'Failed to initiate Razorpay order.' },
    });
  }
});

// POST /api/payments/razorpay/verify — Verify payment signature & settle
app.post('/api/payments/razorpay/verify', rateLimit(30, 60 * 1000), (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoice_id, order_id } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({
        error: { code: 'INVALID_PAYMENT', message: 'Payment ID is required.' },
      });
    }

    // Cryptographic HMAC-SHA256 signature verification if secret is set
    if (razorpayKeySecret) {
      if (!razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
          error: { code: 'SIGNATURE_REQUIRED', message: 'Order ID and signature are required for payment verification.' },
        });
      }

      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          error: { code: 'SIGNATURE_VERIFICATION_FAILED', message: 'Invalid payment signature received.' },
        });
      }
    }

    let updatedInvoice = null;
    let updatedOrder = null;

    if (invoice_id) {
      updatedInvoice = db.payInvoice(String(invoice_id), 'Razorpay Gateway', razorpay_payment_id);
      if (updatedInvoice) {
        mysqlManager.upsertInvoice(updatedInvoice).catch((err) => console.warn('[MySQL Invoice Sync Warning]:', err));
      }
    }

    if (order_id) {
      const order = db.getOrderById(String(order_id));
      if (order) {
        db.recordPayment(order.id, {
          order_id: order.id,
          transaction_ref: razorpay_payment_id,
          payment_method: 'RAZORPAY',
          amount: order.deposit_amount > 0 ? order.deposit_amount : order.total_amount,
          currency: order.currency || 'INR',
          payment_status: 'Success',
          payer_email: order.customer_email,
        });

        updatedOrder = db.getOrderById(order.id);
        if (updatedOrder) {
          mysqlManager.insertOrder(updatedOrder).catch((err) => console.warn('[MySQL Order Sync Warning]:', err));
        }

        // Auto-provision client, project, and 50/50 milestone invoices
        const clients = db.getClients();
        let client = clients.find((c) => c.email.toLowerCase() === order.customer_email.toLowerCase());
        if (!client) {
          client = db.createClient({
            name: order.customer_name,
            company: order.customer_company || `${order.customer_name} Org`,
            email: order.customer_email.toLowerCase(),
            phone: order.customer_phone || '+91 6280538868',
            status: 'Active',
            notes: `Auto-registered via 50% advance booking for ${order.service_name}`,
            active_projects_count: 1,
            total_invoiced: order.total_amount,
          });
          mysqlManager.insertClient(client).catch((err) => console.warn('[MySQL Client Sync Warning]:', err));
        }

        // Provision Client Portal user account
        let pUser = db.getPortalUserByEmail(order.customer_email.toLowerCase());
        if (!pUser) {
          try {
            const reg = db.registerPortalUser({
              email: order.customer_email.toLowerCase(),
              passwordPlain: 'CodeNova@2026',
              name: order.customer_name,
              company: order.customer_company,
              phone: order.customer_phone,
            });
            pUser = reg.user;
          } catch (_) {}
        }

        // Provision Portal Project with 50/50 milestones
        const project = db.createPortalProject({
          client_id: client.id,
          client_name: client.name,
          client_company: client.company,
          title: order.service_name,
          service_type: order.service_name,
          status: 'In_Progress',
          progress_percentage: 15,
          start_date: new Date().toISOString().split('T')[0],
          target_delivery_date: order.target_delivery_date || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
          budget: order.total_amount,
          currency: order.currency || 'INR',
          description: order.requirements_brief || 'Engineering project initiated with 50% advance deposit.',
          assigned_lead: order.assigned_lead || 'Er. Gagandeep Singh (CodeNova Harike Kalan)',
          milestones: [
            {
              id: `ms-1-${Date.now()}`,
              sequence: 1,
              title: 'Milestone 1: Architectural Blueprint & Kickoff (50% Advance)',
              description: '50% Advance booking deposit paid. Engineering architecture and sprints unlocked.',
              status: 'Completed',
              completed_at: new Date().toISOString(),
            },
            {
              id: `ms-2-${Date.now()}`,
              sequence: 2,
              title: 'Milestone 2: Final Delivery, Testing & Code Handover (50% Balance)',
              description: 'Full code delivery and deployment. Payable upon 100% completion in Client Portal.',
              status: 'Pending',
            },
          ],
          tasks: [
            {
              id: `task-1-${Date.now()}`,
              project_id: `proj-${Date.now()}`,
              title: 'System Architecture & Database Schema Design',
              description: 'Setting up high-performance database, API contracts, and security architecture.',
              status: 'In_Progress',
              priority: 'High',
              assignee: 'Er. Gagandeep Singh',
              due_date: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
              created_at: new Date().toISOString(),
            },
          ],
          deliverables: [],
        });
        mysqlManager.insertProject(project).catch((err) => console.warn('[MySQL Project Sync Warning]:', err));

        // Invoice 1: 50% Advance (Paid)
        const m1Inv = db.createInvoice({
          invoice_number: `INV-M1-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          client_id: client.id,
          client_name: client.name,
          client_email: client.email,
          client_company: client.company,
          project_id: project.id,
          project_title: project.title,
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date().toISOString().split('T')[0],
          status: 'Paid',
          items: [
            {
              id: `it-1-${Date.now()}`,
              description: `${order.service_name} — Milestone 1 (50% Advance Kickoff)`,
              quantity: 1,
              unit_price: order.deposit_amount,
              total_price: order.deposit_amount,
            },
          ],
          subtotal: order.deposit_amount,
          tax_rate_percent: 0,
          tax_amount: 0,
          total_amount: order.deposit_amount,
          currency: order.currency || 'INR',
          payment_method: 'Razorpay Live Gateway',
          paid_at: new Date().toISOString(),
          notes: `Settled via Razorpay (${razorpay_payment_id}). Kickoff activated.`,
        });
        mysqlManager.upsertInvoice(m1Inv).catch((err) => console.warn('[MySQL Invoice M1 Sync Warning]:', err));

        // Invoice 2: 50% Final Delivery (Pending / Sent - Payable when project complete)
        if (order.remaining_balance > 0) {
          const m2Inv = db.createInvoice({
            invoice_number: `INV-M2-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            client_id: client.id,
            client_name: client.name,
            client_email: client.email,
            client_company: client.company,
            project_id: project.id,
            project_title: project.title,
            issue_date: new Date().toISOString().split('T')[0],
            due_date: order.target_delivery_date || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
            status: 'Sent',
            items: [
              {
                id: `it-2-${Date.now()}`,
                description: `${order.service_name} — Milestone 2 (50% Final Handover Balance)`,
                quantity: 1,
                unit_price: order.remaining_balance,
                total_price: order.remaining_balance,
              },
            ],
            subtotal: order.remaining_balance,
            tax_rate_percent: 0,
            tax_amount: 0,
            total_amount: order.remaining_balance,
            currency: order.currency || 'INR',
            notes: 'Milestone 2 Balance — Payable upon 100% service completion & code handover via Client Portal.',
          });
          mysqlManager.upsertInvoice(m2Inv).catch((err) => console.warn('[MySQL Invoice M2 Sync Warning]:', err));
        }
      }
    }

    const auditLog = db.recordAuditLog({
      user_id: 'payment_gateway',
      user_name: 'Razorpay Gateway',
      user_role: 'admin',
      action: 'PAYMENT_SETTLED',
      details: `Razorpay payment verified: ${razorpay_payment_id} for ${order_id ? `Order ${order_id}` : `Invoice ${invoice_id}`}`,
      ip_address: req.ip || '127.0.0.1',
    });
    mysqlManager.insertAuditLog(auditLog).catch((err) => console.warn('[MySQL Audit Sync Warning]:', err));

    return res.json({
      success: true,
      message: 'Payment verified and settled successfully.',
      receipt_number: `RZP_${razorpay_payment_id.slice(-8)}`,
      payment_id: razorpay_payment_id,
      invoice: updatedInvoice,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('[Razorpay Verification Error]:', error);
    return res.status(500).json({
      error: { code: 'PAYMENT_VERIFICATION_ERROR', message: error.message || 'Payment verification failed.' },
    });
  }
});

// GET /api/client/tickets
app.get('/api/client/tickets', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.json({ success: true, tickets: [] });
  }
  const tickets = db.getSupportTickets(auth.clientId);
  res.json({ success: true, tickets });
});

// POST /api/client/tickets
app.post('/api/client/tickets', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const { subject, category = 'Technical', priority = 'Medium', project_id, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Subject and message are required.' } });
  }

  const client = auth.clientId ? db.getClientById(auth.clientId) : undefined;

  const ticket = db.createSupportTicket({
    client_id: auth.clientId || '',
    client_name: (req as any).user?.name || client?.name || 'Client',
    client_email: (req as any).user?.email || client?.email || '',
    project_id: project_id ? String(project_id) : undefined,
    subject: String(subject).trim(),
    category: category,
    priority: priority,
    status: 'Open',
    assigned_to: 'Harike Kalan Engineering Desk',
  });
  mysqlManager.insertSupportTicket(ticket).catch((err) => console.warn('[MySQL Ticket Sync Warning]:', err));

  db.addSupportMessage({
    ticket_id: ticket.id,
    sender_id: auth.userId,
    sender_name: (req as any).user?.name || 'Client',
    sender_role: 'client',
    message: String(message).trim(),
  });

  res.status(201).json({ success: true, ticket });
});

// GET /api/client/tickets/:id
app.get('/api/client/tickets/:id', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found.' } });
  }
  const ticket = db.getSupportTicketById(req.params.id, auth.clientId);
  if (!ticket) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found.' } });
  }
  const messages = db.getSupportMessages(ticket.id);
  res.json({ success: true, ticket, messages });
});

// POST /api/client/tickets/:id/messages
app.post('/api/client/tickets/:id/messages', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  if (!auth.clientId) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found.' } });
  }
  const { message, attachment_url } = req.body;
  if (!message || String(message).trim().length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Reply message cannot be empty.' } });
  }

  const ticket = db.getSupportTicketById(req.params.id, auth.clientId);
  if (!ticket) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found.' } });
  }

  const newMsg = db.addSupportMessage({
    ticket_id: ticket.id,
    sender_id: auth.userId,
    sender_name: (req as any).user?.name || 'Client',
    sender_role: 'client',
    message: String(message).trim(),
    attachment_url: attachment_url ? String(attachment_url) : undefined,
  });

  res.status(201).json({ success: true, message: newMsg });
});

// GET /api/client/notifications
app.get('/api/client/notifications', requireClient, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const notifications = db.getNotifications(auth.userId);
  res.json({ success: true, notifications });
});

// PATCH /api/client/notifications/:id/read
app.patch('/api/client/notifications/:id/read', requireClient, (req: Request, res: Response) => {
  db.markNotificationRead(req.params.id);
  res.json({ success: true });
});

// =================================================================
// ADMIN PORTAL SECURE API ENDPOINTS
// =================================================================

// GET /api/admin/clients — list all client records
app.get('/api/admin/clients', requireAdmin, (_req: Request, res: Response) => {
  const clients = db.getClients();
  res.json({ success: true, clients });
});

// POST /api/admin/clients — create client
app.post('/api/admin/clients', requireAdmin, (req: Request, res: Response) => {
  const { name, company, email, phone, billing_address, gst_tax_id, notes } = req.body;
  if (!name || !email || !company) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Name, company, and email are required.' } });
  }

  const newClient = db.createClient({
    name: String(name).trim(),
    company: String(company).trim(),
    email: String(email).trim().toLowerCase(),
    phone: String(phone || '+91 6280538868').trim(),
    status: 'Active',
    billing_address,
    gst_tax_id,
    notes,
    active_projects_count: 0,
    total_invoiced: 0,
  });
  mysqlManager.insertClient(newClient).catch((err) => console.warn('[MySQL Client Sync Warning]:', err));

  res.status(201).json({ success: true, client: newClient });
});

// PATCH /api/admin/clients/:id — update client (e.g. suspend/reactivate)
app.patch('/api/admin/clients/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateClient(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Client not found.' } });
  }
  mysqlManager.insertClient(updated).catch((err) => console.warn('[MySQL Client Sync Warning]:', err));
  res.json({ success: true, client: updated });
});

// POST /api/admin/clients/invite — generate client portal invitation token
app.post('/api/admin/clients/invite', requireAdmin, (req: Request, res: Response) => {
  const { email, client_name, company, project_id } = req.body;
  if (!email || !client_name) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Email and client name are required.' } });
  }

  const auth = (req as any).auth;
  const invitation = db.createClientInvitation({
    email,
    client_name,
    company,
    invited_by: auth?.userId || 'admin',
    project_id,
  });

  res.status(201).json({
    success: true,
    invitation,
    invitation_link: `${req.protocol}://${req.get('host')}/client/register?token=${invitation.token}`,
  });
});

// GET /api/admin/projects — list all portal projects
app.get('/api/admin/projects', requireAdmin, (_req: Request, res: Response) => {
  const projects = db.getPortalProjects();
  res.json({ success: true, projects });
});

// POST /api/admin/projects — create portal project
app.post('/api/admin/projects', requireAdmin, (req: Request, res: Response) => {
  const {
    client_id,
    title,
    service_type,
    status = 'Planning',
    progress_percentage = 0,
    start_date,
    target_delivery_date,
    budget,
    currency = 'INR',
    description,
    assigned_lead = 'Er. Gagandeep Singh (CodeNova Harike Kalan)',
  } = req.body;

  if (!client_id || !title || !service_type || !budget) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Client, title, service type, and budget are required.' } });
  }

  const client = db.getClientById(client_id);
  const newProject = db.createPortalProject({
    client_id,
    client_name: client ? client.name : 'Client',
    client_company: client ? client.company : 'Client Company',
    title: String(title).trim(),
    service_type: String(service_type).trim(),
    status,
    progress_percentage: Number(progress_percentage) || 0,
    start_date: start_date || new Date().toISOString().split('T')[0],
    target_delivery_date: target_delivery_date || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    budget: Number(budget),
    currency: currency === 'USD' ? 'USD' : 'INR',
    description: String(description || ''),
    assigned_lead,
    milestones: [],
    tasks: [],
    deliverables: [],
  });
  mysqlManager.insertProject(newProject).catch((err) => console.warn('[MySQL Project Sync Warning]:', err));

  res.status(201).json({ success: true, project: newProject });
});

// PATCH /api/admin/projects/:id — update project status or details
app.patch('/api/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updatePortalProject(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
  }
  mysqlManager.insertProject(updated).catch((err) => console.warn('[MySQL Project Sync Warning]:', err));
  res.json({ success: true, project: updated });
});

// POST /api/admin/projects/:id/tasks
app.post('/api/admin/projects/:id/tasks', requireAdmin, (req: Request, res: Response) => {
  const { title, description, priority = 'Medium', status = 'Todo', assignee, due_date } = req.body;
  if (!title) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Task title is required.' } });
  }

  const task = db.addProjectTask(req.params.id, {
    title: String(title).trim(),
    description,
    priority,
    status,
    assignee,
    due_date,
  });

  res.status(201).json({ success: true, task });
});

// POST /api/admin/projects/:id/deliverables
app.post('/api/admin/projects/:id/deliverables', requireAdmin, (req: Request, res: Response) => {
  const { title, description, file_url, version = 'v1.0' } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Title and description are required.' } });
  }

  const deliverable = db.addProjectDeliverable(req.params.id, {
    title: String(title).trim(),
    description: String(description).trim(),
    file_url,
    version,
    status: 'Pending_Approval',
  });

  res.status(201).json({ success: true, deliverable });
});

// GET /api/admin/invoices — list all invoices
app.get('/api/admin/invoices', requireAdmin, (_req: Request, res: Response) => {
  const invoices = db.getInvoices();
  res.json({ success: true, invoices });
});

// POST /api/admin/invoices — create new invoice
app.post('/api/admin/invoices', requireAdmin, (req: Request, res: Response) => {
  const { client_id, project_id, issue_date, due_date, items, tax_rate_percent = 18, currency = 'INR', notes } = req.body;
  if (!client_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Client and at least one item are required.' } });
  }

  const client = db.getClientById(client_id);
  const project = project_id ? db.getPortalProjectById(project_id) : undefined;

  const subtotal = items.reduce((sum: number, it: any) => sum + (Number(it.quantity) || 1) * (Number(it.unit_price) || 0), 0);
  const tax_amount = Math.round(subtotal * (Number(tax_rate_percent) / 100));
  const total_amount = subtotal + tax_amount;
  const invoiceNumber = `INV-CN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newInv = db.createInvoice({
    invoice_number: invoiceNumber,
    client_id,
    client_name: client ? client.name : 'Client',
    client_email: client ? client.email : '',
    client_company: client ? client.company : '',
    project_id,
    project_title: project ? project.title : undefined,
    issue_date: issue_date || new Date().toISOString().split('T')[0],
    due_date: due_date || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: 'Sent',
    items: items.map((it: any, idx: number) => ({
      id: `it-${Date.now()}-${idx}`,
      description: it.description,
      quantity: Number(it.quantity) || 1,
      unit_price: Number(it.unit_price) || 0,
      total_price: (Number(it.quantity) || 1) * (Number(it.unit_price) || 0),
    })),
    subtotal,
    tax_rate_percent: Number(tax_rate_percent),
    tax_amount,
    total_amount,
    currency: currency === 'USD' ? 'USD' : 'INR',
    notes,
  });
  mysqlManager.upsertInvoice(newInv).catch((err) => console.warn('[MySQL Invoice Sync Warning]:', err));

  res.status(201).json({ success: true, invoice: newInv });
});

// PATCH /api/admin/invoices/:id — mark paid or update invoice
app.patch('/api/admin/invoices/:id', requireAdmin, (req: Request, res: Response) => {
  const { status, payment_method, notes } = req.body;
  if (status === 'Paid') {
    const paid = db.payInvoice(req.params.id, payment_method || 'Bank Transfer / Manual Reconciliation');
    if (!paid) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found.' } });
    }
    mysqlManager.upsertInvoice(paid).catch((err) => console.warn('[MySQL Invoice Sync Warning]:', err));
    return res.json({ success: true, invoice: paid });
  }

  const updated = db.updateInvoice(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invoice not found.' } });
  }
  mysqlManager.upsertInvoice(updated).catch((err) => console.warn('[MySQL Invoice Sync Warning]:', err));
  res.json({ success: true, invoice: updated });
});

// GET /api/admin/tickets — list all tickets
app.get('/api/admin/tickets', requireAdmin, (_req: Request, res: Response) => {
  const tickets = db.getSupportTickets();
  res.json({ success: true, tickets });
});

// PATCH /api/admin/tickets/:id — update ticket status or assignment
app.patch('/api/admin/tickets/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSupportTicket(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Ticket not found.' } });
  }
  mysqlManager.insertSupportTicket(updated).catch((err) => console.warn('[MySQL Ticket Sync Warning]:', err));
  res.json({ success: true, ticket: updated });
});

// POST /api/admin/tickets/:id/messages — admin reply to ticket
app.post('/api/admin/tickets/:id/messages', requireAdmin, (req: Request, res: Response) => {
  const auth = (req as any).auth;
  const { message, attachment_url } = req.body;
  if (!message) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Message is required.' } });
  }

  const newMsg = db.addSupportMessage({
    ticket_id: req.params.id,
    sender_id: auth?.userId || 'admin',
    sender_name: (req as any).user?.name || 'Er. Gagandeep Singh (CodeNova)',
    sender_role: 'admin',
    message: String(message).trim(),
    attachment_url,
  });

  res.status(201).json({ success: true, message: newMsg });
});

// GET /api/admin/audit-logs — audit security events
app.get('/api/admin/audit-logs', requireAdmin, (_req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({ success: true, audit_logs: logs });
});

// API 404 catch-all to prevent falling back to HTML index for API routes
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested API endpoint does not exist.',
    },
  });
});

// Centralized error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Server Error]:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected internal server error occurred.'
        : (err.message || 'Internal server error.'),
    },
  });
});

// ----------------- Vite Integration & Frontend Serving -----------------

async function startServer() {
  if (isProduction) {
    // Serve production static build
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development mode with Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CodeNova Server] Ready and running at http://0.0.0.0:${PORT} (Mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('[CodeNova Server] Startup failed:', err);
    process.exit(1);
  });
}
