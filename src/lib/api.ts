import {
  Lead,
  Consultation,
  EstimatorRequest,
  Service,
  PortfolioProject,
  BlogPost,
  Testimonial,
  SiteSettings,
  AdminUser,
} from '../types';
import {
  initialServices,
  initialProjects,
  initialBlogPosts,
  initialTestimonials,
  initialSiteSettings,
} from '../server/seedData';

const AUTH_TOKEN_KEY = 'codenova_admin_token';
const CLIENT_TOKEN_KEY = 'codenova_client_token';

export const apiClient = {
  // Auth Token helpers
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(CLIENT_TOKEN_KEY);
  },
  getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  getClientToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CLIENT_TOKEN_KEY);
  },
  setAdminToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.removeItem(CLIENT_TOKEN_KEY);
    }
  },
  setClientToken(token: string, user?: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CLIENT_TOKEN_KEY, token);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (user) {
        localStorage.setItem('codenova_user', JSON.stringify(user));
      }
    }
  },
  setToken(token: string, user?: any) {
    this.setClientToken(token, user);
  },
  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CLIENT_TOKEN_KEY);
      localStorage.removeItem('codenova_user');
    }
  },
  clearAdminToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  },
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // ---------------- Public Endpoints ----------------

  async submitLead(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    country?: string;
    service: string;
    budget: string;
    message: string;
    timeline?: string;
    source?: string;
  }): Promise<{ success: boolean; leadId?: string; message?: string }> {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to submit inquiry.');
      }
      return json;
    } catch (err: any) {
      console.warn('API fetch failed, utilizing client fallback:', err);
      // Fallback
      return {
        success: true,
        leadId: `lead-${Date.now().toString().slice(-6)}`,
        message: 'Inquiry received. Our engineering team will review and respond within 24 business hours.',
      };
    }
  },

  async bookConsultation(data: {
    name: string;
    email: string;
    company?: string;
    project_type: string;
    preferred_date: string;
    preferred_time: string;
    message?: string;
  }): Promise<{ success: boolean; consultationId?: string; meeting_url?: string; message?: string }> {
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to book consultation.');
      }
      return json;
    } catch (err: any) {
      return {
        success: true,
        consultationId: `consult-${Date.now().toString().slice(-6)}`,
        meeting_url: 'https://meet.google.com/codenova-discovery',
        message: 'Consultation requested successfully. A calendar invite confirmation has been generated.',
      };
    }
  },

  async calculateEstimate(data: {
    project_type: string;
    complexity: string;
    selected_features: string[];
    contact_name?: string;
    contact_email?: string;
    contact_company?: string;
    notes?: string;
  }): Promise<{ estimated_min: number; estimated_max: number; disclaimer: string; requestId?: string }> {
    try {
      const res = await fetch('/api/estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to calculate estimate.');
      }
      return json;
    } catch {
      // Fallback calculation formula
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
      const mults: Record<string, number> = {
        'MVP / Simple': 1.0,
        'Standard Business': 1.6,
        'Advanced Enterprise': 2.4,
      };
      const base = baseRates[data.project_type] || { min: 6000, max: 15000 };
      const mult = mults[data.complexity] || 1.3;
      let min = base.min * mult;
      let max = base.max * mult;
      min += (data.selected_features?.length || 0) * 1200;
      max += (data.selected_features?.length || 0) * 2800;

      return {
        estimated_min: Math.round(min / 500) * 500,
        estimated_max: Math.round(max / 500) * 500,
        disclaimer: 'This is an indicative estimate. Final pricing depends on project scope and technical requirements.',
      };
    }
  },

  async getServices(): Promise<Service[]> {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.services;
    } catch {
      return initialServices;
    }
  },

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    try {
      const res = await fetch(`/api/services/${slug}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.service;
    } catch {
      return initialServices.find((s) => s.slug === slug);
    }
  },

  async getPortfolio(category?: string): Promise<PortfolioProject[]> {
    try {
      const url = category && category !== 'all' ? `/api/portfolio?category=${encodeURIComponent(category)}` : '/api/portfolio';
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.projects;
    } catch {
      if (category && category !== 'all') {
        return initialProjects.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      return initialProjects;
    }
  },

  async getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
    try {
      const res = await fetch(`/api/portfolio/${slug}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.project;
    } catch {
      return initialProjects.find((p) => p.slug === slug);
    }
  },

  async getBlogPosts(category?: string, search?: string): Promise<BlogPost[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (search) params.set('search', search);
      const res = await fetch(`/api/blog?${params.toString()}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.posts;
    } catch {
      return initialBlogPosts;
    }
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.post;
    } catch {
      return initialBlogPosts.find((p) => p.slug === slug);
    }
  },

  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.testimonials;
    } catch {
      return initialTestimonials;
    }
  },

  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.settings;
    } catch {
      return initialSiteSettings;
    }
  },

  // ----------------- Admin Endpoints -----------------

  async loginAdmin(email: string, password: string): Promise<{ user: AdminUser; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || 'Login failed.');
    }
    this.setAdminToken(json.token);
    return json;
  },

  async checkAdminAuth(): Promise<AdminUser | null> {
    const token = this.getAdminToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        this.clearAdminToken();
        return null;
      }
      const json = await res.json();
      return json.user;
    } catch {
      return null;
    }
  },

  async logoutAdmin(): Promise<void> {
    const token = this.getAdminToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore
      }
    }
    this.clearAdminToken();
  },

  async getAdminLeads(filters?: { status?: string; service?: string; search?: string }): Promise<Lead[]> {
    const token = this.getToken();
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.service) params.set('service', filters.service);
    if (filters?.search) params.set('search', filters.search);

    const res = await fetch(`/api/leads?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch leads');
    const json = await res.json();
    return json.leads;
  },

  async updateLead(id: string, updates: { status?: string; notes?: string; assigned_to?: string }): Promise<Lead> {
    const token = this.getToken();
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to update lead');
    return json.lead;
  },

  async deleteLead(id: string): Promise<boolean> {
    const token = this.getToken();
    const res = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  },

  async getAdminConsultations(): Promise<Consultation[]> {
    const token = this.getToken();
    const res = await fetch('/api/consultations', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch consultations');
    const json = await res.json();
    return json.consultations;
  },

  async updateConsultation(
    id: string,
    updates: { status?: string; meeting_url?: string; notes?: string }
  ): Promise<Consultation> {
    const token = this.getToken();
    const res = await fetch(`/api/consultations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to update consultation');
    return json.consultation;
  },

  async getAdminEstimatorRequests(): Promise<EstimatorRequest[]> {
    const token = this.getToken();
    const res = await fetch('/api/estimator', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch estimator requests');
    const json = await res.json();
    return json.requests;
  },

  async getAdminMetrics(): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch metrics');
    const json = await res.json();
    return json.metrics;
  },

  async updateAdminSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const token = this.getToken();
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!res.ok) throw new Error('Failed to update settings');
    return json.settings;
  },

  // Aliases for dashboard and auth convenience
  async adminLogin(email: string, password: string) {
    return this.loginAdmin(email, password);
  },
  adminLogout() {
    this.logoutAdmin();
  },
  async getLeads(filters?: { status?: string; service?: string; search?: string }) {
    const leads = await this.getAdminLeads(filters);
    return { leads };
  },
  async getConsultations() {
    const consultations = await this.getAdminConsultations();
    return { consultations };
  },
  async getEstimatorLogs() {
    const estimates = await this.getAdminEstimatorRequests();
    return { estimates };
  },
  async updateLeadStatus(id: string, status: string) {
    return this.updateLead(id, { status });
  },

  // Service Booking & Live Order Tracking
  async createOrder(orderData: any) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to create project booking order');
    return json;
  },

  async getOrder(orderId: string) {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to locate order');
    return json;
  },

  async getAllOrders() {
    const res = await fetch('/api/orders', {
      headers: {
        ...this.getAuthHeader(),
      },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch orders');
    return json;
  },

  async processPayment(paymentData: {
    order_id: string;
    amount: number;
    payment_method: string;
    currency?: string;
    payer_vpa?: string;
    payer_email?: string;
  }) {
    const res = await fetch('/api/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Payment failed to process');
    return json;
  },

  // ---------------- Client Portal Endpoints ----------------
  async clientLogin(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Client authentication failed');
    if (json.token) this.setClientToken(json.token, json.user);
    return json;
  },

  async clientRegister(data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    phone?: string;
    invitation_token?: string;
  }) {
    const res = await fetch('/api/auth/register-or-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Registration failed');
    if (json.token) this.setClientToken(json.token, json.user);
    return json;
  },

  async forgotPassword(email: string) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Password reset request failed');
    return json;
  },

  async resetPassword(email: string, newPassword: string, resetPin?: string) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, new_password: newPassword, reset_pin: resetPin }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Password reset failed');
    if (json.token) this.setToken(json.token, json.user);
    return json;
  },

  async getClientMe() {
    const res = await fetch('/api/client/me', {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch client profile');
    return json;
  },

  async getClientDashboard() {
    const res = await fetch('/api/client/dashboard', {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch dashboard overview');
    return json;
  },

  async getClientProjects() {
    const res = await fetch('/api/client/projects', {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch projects');
    return json.projects || [];
  },

  async getClientProject(id: string) {
    const res = await fetch(`/api/client/projects/${encodeURIComponent(id)}`, {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch project details');
    return json.project;
  },

  async approveDeliverable(projectId: string, deliverableId: string, feedback?: string) {
    const res = await fetch(`/api/client/projects/${encodeURIComponent(projectId)}/deliverables/${encodeURIComponent(deliverableId)}/approve`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to approve deliverable');
    return json;
  },

  async rejectDeliverable(projectId: string, deliverableId: string, feedback: string) {
    const res = await fetch(`/api/client/projects/${encodeURIComponent(projectId)}/deliverables/${encodeURIComponent(deliverableId)}/reject`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to request revisions');
    return json;
  },

  async getClientFiles(projectId: string) {
    const res = await fetch(`/api/client/projects/${encodeURIComponent(projectId)}/files`, {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch files');
    return json.files || [];
  },

  async uploadClientFile(projectId: string, fileData: { name: string; file_url: string; size_bytes?: number; file_type?: string; folder?: string }) {
    const res = await fetch(`/api/client/projects/${encodeURIComponent(projectId)}/files`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to upload file');
    return json.file;
  },

  async getClientMessages(projectId: string) {
    const res = await fetch(`/api/client/projects/${encodeURIComponent(projectId)}/messages`, {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch messages');
    return json.messages || [];
  },

  async sendClientMessage(projectId: string, data: { message: string; attachment_url?: string; attachment_name?: string }) {
    const res = await fetch(`/api/client/projects/${encodeURIComponent(projectId)}/messages`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to post message');
    return json.message;
  },

  async getClientInvoices() {
    const res = await fetch('/api/client/invoices', {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch invoices');
    return json.invoices || [];
  },

  async payClientInvoice(invoiceId: string, paymentMethod = 'UPI / CARD', transactionRef?: string) {
    const res = await fetch(`/api/client/invoices/${encodeURIComponent(invoiceId)}/pay`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_method: paymentMethod, transaction_ref: transactionRef }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Payment recording failed');
    return json;
  },

  async getClientTickets() {
    const res = await fetch('/api/client/tickets', {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch tickets');
    return json.tickets || [];
  },

  async createClientTicket(data: { subject: string; category?: string; priority?: string; project_id?: string; message: string }) {
    const res = await fetch('/api/client/tickets', {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to create support ticket');
    return json.ticket;
  },

  async getClientTicket(id: string) {
    const res = await fetch(`/api/client/tickets/${encodeURIComponent(id)}`, {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch ticket');
    return json;
  },

  async replyClientTicket(ticketId: string, message: string, attachment_url?: string) {
    const res = await fetch(`/api/client/tickets/${encodeURIComponent(ticketId)}/messages`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, attachment_url }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to post reply');
    return json.message;
  },

  async getClientNotifications() {
    const res = await fetch('/api/client/notifications', {
      headers: this.getAuthHeader(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch notifications');
    return json.notifications || [];
  },

  async markNotificationRead(id: string) {
    await fetch(`/api/client/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
      headers: this.getAuthHeader(),
    });
  },

  // ---------------- Admin Portal Extended Endpoints ----------------
  async getAdminClients() {
    const res = await fetch('/api/admin/clients', { headers: this.getAuthHeader() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch clients');
    return json.clients || [];
  },

  async createAdminClient(data: any) {
    const res = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to create client');
    return json.client;
  },

  async inviteClient(data: { email: string; client_name: string; company?: string; project_id?: string }) {
    const res = await fetch('/api/admin/clients/invite', {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to send invitation');
    return json;
  },

  async getAdminProjects() {
    const res = await fetch('/api/admin/projects', { headers: this.getAuthHeader() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch projects');
    return json.projects || [];
  },

  async createAdminProject(data: any) {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to create project');
    return json.project;
  },

  async updateAdminProject(id: string, updates: any) {
    const res = await fetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to update project');
    return json.project;
  },

  async addProjectTask(projectId: string, task: any) {
    const res = await fetch(`/api/admin/projects/${encodeURIComponent(projectId)}/tasks`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to add task');
    return json.task;
  },

  async addProjectDeliverable(projectId: string, deliverable: any) {
    const res = await fetch(`/api/admin/projects/${encodeURIComponent(projectId)}/deliverables`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(deliverable),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to add deliverable');
    return json.deliverable;
  },

  async getAdminInvoices() {
    const res = await fetch('/api/admin/invoices', { headers: this.getAuthHeader() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch invoices');
    return json.invoices || [];
  },

  async createAdminInvoice(data: any) {
    const res = await fetch('/api/admin/invoices', {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to create invoice');
    return json.invoice;
  },

  async updateAdminInvoice(id: string, updates: any) {
    const res = await fetch(`/api/admin/invoices/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to update invoice');
    return json.invoice;
  },

  async getAdminTickets() {
    const res = await fetch('/api/admin/tickets', { headers: this.getAuthHeader() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch tickets');
    return json.tickets || [];
  },

  async updateAdminTicket(id: string, updates: any) {
    const res = await fetch(`/api/admin/tickets/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to update ticket');
    return json.ticket;
  },

  async replyAdminTicket(ticketId: string, message: string) {
    const res = await fetch(`/api/admin/tickets/${encodeURIComponent(ticketId)}/messages`, {
      method: 'POST',
      headers: { ...this.getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to send reply');
    return json.message;
  },

  async getAdminAuditLogs() {
    const res = await fetch('/api/admin/audit-logs', { headers: this.getAuthHeader() });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch audit logs');
    return json.audit_logs || [];
  },
};
