import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Calendar,
  Calculator,
  Download,
  Trash2,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  Building,
  CreditCard,
  LifeBuoy,
  Shield,
  Plus,
  Send,
  Check,
  X,
  FileText,
  Video,
  Eye,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import {
  Lead,
  Consultation,
  EstimatorRequest,
  LeadStatus,
  Order,
  ClientRecord,
  PortalProject,
  Invoice,
  SupportTicket,
  AuditLog,
} from '../../types';

interface AdminDashboardPageProps {
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'leads' | 'consultations' | 'estimates' | 'orders' | 'clients' | 'projects' | 'invoices' | 'tickets' | 'audit'
  >('leads');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [estimates, setEstimates] = useState<EstimatorRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedEstimate, setSelectedEstimate] = useState<EstimatorRequest | null>(null);

  // Invite modal state
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteCompany, setInviteCompany] = useState('');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);

  // Ticket reply state
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  // Create Invoice modal state
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invClientId, setInvClientId] = useState('');
  const [invItemDesc, setInvItemDesc] = useState('');
  const [invItemAmount, setInvItemAmount] = useState('50000');

  // Create Project modal state
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [prjClientId, setPrjClientId] = useState('');
  const [prjTitle, setPrjTitle] = useState('');
  const [prjServiceType, setPrjServiceType] = useState('Web Application Development');
  const [prjBudget, setPrjBudget] = useState('390000');
  const [prjDeliveryDate, setPrjDeliveryDate] = useState('');
  const [prjDesc, setPrjDesc] = useState('');
  const [prjLead, setPrjLead] = useState('Er. Gagandeep Singh (CodeNova Harike Kalan)');

  const [dashboardNotice, setDashboardNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, consultsRes, estRes, ordersRes, clientsRes, prjsRes, invsRes, tktsRes, auditRes] =
        await Promise.all([
          apiClient.getLeads(),
          apiClient.getConsultations(),
          apiClient.getEstimatorLogs(),
          apiClient.getAllOrders().catch(() => ({ orders: [] })),
          apiClient.getAdminClients().catch(() => []),
          apiClient.getAdminProjects().catch(() => []),
          apiClient.getAdminInvoices().catch(() => []),
          apiClient.getAdminTickets().catch(() => []),
          apiClient.getAdminAuditLogs().catch(() => []),
        ]);

      if (leadsRes?.leads) setLeads(leadsRes.leads);
      if (consultsRes?.consultations) setConsultations(consultsRes.consultations);
      if (estRes?.estimates) setEstimates(estRes.estimates);
      if (ordersRes?.orders) setOrders(ordersRes.orders);
      setClients(clientsRes || []);
      setProjects(prjsRes || []);
      setInvoices(invsRes || []);
      setTickets(tktsRes || []);
      setAuditLogs(auditRes || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await apiClient.updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as LeadStatus } : l))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus as LeadStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await apiClient.deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      if (selectedLead?.id === leadId) setSelectedLead(null);
      setDashboardNotice({ type: 'success', message: 'Lead record deleted successfully' });
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err?.message || 'Failed to delete lead' });
    }
  };

  const handleInviteClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.inviteClient({
        email: inviteEmail,
        client_name: inviteName,
        company: inviteCompany,
      });
      setGeneratedInviteLink(res.invitation_link);
      setInviteEmail('');
      setInviteName('');
      setInviteCompany('');
      setDashboardNotice({ type: 'success', message: 'Client invite generated successfully' });
      loadData();
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to send invite' });
    }
  };

  const handleSendTicketReply = async (ticketId: string) => {
    if (!replyMessage.trim()) return;
    try {
      await apiClient.replyAdminTicket(ticketId, replyMessage);
      await apiClient.updateAdminTicket(ticketId, { status: 'In_Progress' });
      setReplyMessage('');
      setReplyTicketId(null);
      setDashboardNotice({ type: 'success', message: 'Ticket reply sent successfully' });
      loadData();
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to reply to ticket' });
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClientId) return;
    try {
      await apiClient.createAdminInvoice({
        client_id: invClientId,
        items: [{ description: invItemDesc || 'Engineering Services Sprint', quantity: 1, unit_price: Number(invItemAmount) }],
        tax_rate_percent: 18,
      });
      setIsCreatingInvoice(false);
      setInvItemDesc('');
      setDashboardNotice({ type: 'success', message: 'Invoice created successfully' });
      loadData();
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to create invoice' });
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prjClientId || !prjTitle.trim()) return;
    try {
      await apiClient.createAdminProject({
        client_id: prjClientId,
        title: prjTitle.trim(),
        service_type: prjServiceType,
        budget: Number(prjBudget) || 390000,
        target_delivery_date: prjDeliveryDate || new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString().split('T')[0],
        description: prjDesc.trim(),
        assigned_lead: prjLead,
        status: 'Planning',
        progress_percentage: 10,
      });
      setIsCreatingProject(false);
      setPrjTitle('');
      setPrjDesc('');
      setDashboardNotice({ type: 'success', message: 'New enterprise project initialized successfully' });
      loadData();
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to create project' });
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, newStatus: any) => {
    try {
      await apiClient.updateAdminProject(projectId, { status: newStatus });
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)));
      setDashboardNotice({ type: 'success', message: `Project ${projectId} updated to ${newStatus}` });
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to update project' });
    }
  };

  const handleUpdateProjectProgress = async (projectId: string, progress: number) => {
    try {
      const clamped = Math.max(0, Math.min(100, progress));
      await apiClient.updateAdminProject(projectId, { progress_percentage: clamped });
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, progress_percentage: clamped } : p)));
      setDashboardNotice({ type: 'success', message: `Project ${projectId} progress set to ${clamped}%` });
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to update progress' });
    }
  };

  const handleUpdateConsultationStatus = async (consultId: string, newStatus: string) => {
    try {
      await apiClient.updateConsultation(consultId, { status: newStatus });
      setConsultations((prev) => prev.map((c) => (c.id === consultId ? { ...c, status: newStatus as any } : c)));
      if (selectedConsultation?.id === consultId) {
        setSelectedConsultation((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
      setDashboardNotice({ type: 'success', message: `Consultation status changed to ${newStatus}` });
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to update consultation' });
    }
  };

  const handleMarkInvoicePaid = async (invId: string) => {
    try {
      await apiClient.updateAdminInvoice(invId, { status: 'Paid', payment_method: 'Manual / Bank Wire Reconciled' });
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invId
            ? { ...inv, status: 'Paid', receipt_number: `REC-ADMIN-${Date.now().toString().slice(-4)}` }
            : inv
        )
      );
      setDashboardNotice({ type: 'success', message: `Invoice ${invId} marked as Paid successfully` });
    } catch (err: any) {
      setDashboardNotice({ type: 'error', message: err.message || 'Failed to reconcile invoice' });
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Timeline', 'Status', 'Date'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      l.email,
      l.phone || '',
      `"${l.company || ''}"`,
      `"${l.service}"`,
      l.budget,
      l.timeline || '',
      l.status,
      l.created_at,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `codenova-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 font-sans">
      {/* Top Admin Nav */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-lg tracking-tight">CodeNova Command Center</span>
            <span className="text-[10px] uppercase font-mono bg-blue-600 px-2 py-0.5 rounded text-white font-semibold">
              Admin & Enterprise
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
            >
              Public Site <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/client')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Client Portal View <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <Button
              variant="darkOutline"
              size="sm"
              className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs"
              onClick={onLogout}
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Log Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Notice Banner */}
        {dashboardNotice && (
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in duration-200 ${
              dashboardNotice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span>{dashboardNotice.message}</span>
            <button
              onClick={() => setDashboardNotice(null)}
              className="font-bold opacity-60 hover:opacity-100 ml-3 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <p className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Leads Pipeline</p>
            <p className="text-2xl font-black text-slate-900 font-mono mt-1">{leads.length}</p>
            <p className="text-[11px] text-emerald-600 mt-1">{leads.filter((l) => l.status === 'New').length} new</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <p className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Client Accounts</p>
            <p className="text-2xl font-black text-slate-900 font-mono mt-1">{clients.length}</p>
            <p className="text-[11px] text-blue-600 mt-1">{projects.length} active projects</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <p className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Orders & Bookings</p>
            <p className="text-2xl font-black text-slate-900 font-mono mt-1">{orders.length}</p>
            <p className="text-[11px] text-purple-600 mt-1">₹{orders.reduce((sum, o) => sum + (o.deposit_amount || 0), 0).toLocaleString('en-IN')} paid</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <p className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider">Support Desk</p>
            <p className="text-2xl font-black text-slate-900 font-mono mt-1">{tickets.length}</p>
            <p className="text-[11px] text-amber-600 mt-1">{tickets.filter((t) => t.status === 'Open').length} open tickets</p>
          </div>
        </div>

        {/* Tab Switcher Controls */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'leads', label: `Leads (${leads.length})`, icon: Users },
              { id: 'consultations', label: `Calendar (${consultations.length})`, icon: Calendar },
              { id: 'estimates', label: `Estimator (${estimates.length})`, icon: Calculator },
              { id: 'orders', label: `Orders (${orders.length})`, icon: Briefcase },
              { id: 'clients', label: `Clients (${clients.length})`, icon: Building },
              { id: 'projects', label: `Projects (${projects.length})`, icon: CheckCircle2 },
              { id: 'invoices', label: `Invoices (${invoices.length})`, icon: CreditCard },
              { id: 'tickets', label: `Tickets (${tickets.length})`, icon: LifeBuoy },
              { id: 'audit', label: `Audit Logs`, icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh All"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            {activeTab === 'leads' && (
              <Button size="sm" variant="outline" onClick={handleExportCSV} className="text-xs py-1 px-2.5">
                <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB: LEADS */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads
                    .filter((l) => statusFilter === 'ALL' || l.status === statusFilter)
                    .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.email.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{lead.name}</span>
                          <span className="text-[11px] text-slate-500">{lead.email}</span>
                          {lead.phone && <span className="text-[11px] text-slate-400 block">{lead.phone}</span>}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{lead.service}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">{lead.budget}</td>
                        <td className="py-3 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="text-[11px] font-semibold rounded px-2 py-0.5 border border-slate-200 bg-white"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <Button size="sm" variant="outline" onClick={() => setSelectedLead(lead)} className="text-[11px] py-1 px-2">
                            Inspect
                          </Button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: CONSULTATIONS (CALENDAR) */}
        {/* ========================================================================= */}
        {activeTab === 'consultations' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Architecture Discovery & Strategy Consultations</h3>
                <p className="text-xs text-slate-500">Scheduled video calls, technical scoping sessions, and calendar appointments.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                  {consultations.filter((c) => c.status === 'Confirmed' || c.status === 'Pending').length} Upcoming
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  {consultations.filter((c) => c.status === 'Completed').length} Completed
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Client Contact</th>
                    <th className="py-3 px-4">Project Scope</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Meeting Room</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consultations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No discovery consultations scheduled yet.
                      </td>
                    </tr>
                  ) : (
                    consultations.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[11px] text-slate-500">{c.email}</span>
                          {c.company && <span className="text-[11px] text-slate-400 block">{c.company}</span>}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{c.project_type}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{c.preferred_date}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {c.preferred_time}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={c.meeting_url || 'https://meet.google.com/codenova-discovery'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-[11px] font-semibold transition"
                          >
                            <Video className="w-3.5 h-3.5 text-blue-600" />
                            Join Video Call
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={c.status}
                            onChange={(e) => handleUpdateConsultationStatus(c.id, e.target.value)}
                            className="text-[11px] font-semibold rounded px-2 py-0.5 border border-slate-200 bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedConsultation(c)}
                            className="text-[11px] py-1 px-2"
                          >
                            <Eye className="w-3 h-3 mr-1" /> Brief
                          </Button>
                          <a
                            href={`/api/calendar/ics?name=${encodeURIComponent(c.name)}&service=${encodeURIComponent(c.project_type)}&date=${c.preferred_date}&time=${encodeURIComponent(c.preferred_time)}`}
                            download
                            className="inline-flex items-center text-[11px] py-1 px-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-100 transition"
                            title="Download .ICS Calendar Event"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ESTIMATES */}
        {/* ========================================================================= */}
        {activeTab === 'estimates' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Project Scoping & Interactive Calculator Submissions</h3>
                <p className="text-xs text-slate-500">Live estimates calculated by prospective enterprise clients on CodeNova.</p>
              </div>
              <div className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                {estimates.length} Estimator Requests Logged
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Project Type & Tier</th>
                    <th className="py-3 px-4">Estimated Range</th>
                    <th className="py-3 px-4">Selected Modules</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estimates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No estimator submissions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    estimates.map((est) => (
                      <tr key={est.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{est.contact_name || 'Anonymous Visitor'}</span>
                          <span className="text-[11px] text-slate-500">{est.contact_email || 'No email provided'}</span>
                          {est.contact_company && <span className="text-[11px] text-slate-400 block">{est.contact_company}</span>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{est.project_type}</span>
                          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                            {est.complexity}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          ₹{est.estimated_min ? est.estimated_min.toLocaleString('en-IN') : '0'} – ₹{est.estimated_max ? est.estimated_max.toLocaleString('en-IN') : '0'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {est.selected_features && est.selected_features.length > 0 ? (
                              est.selected_features.slice(0, 3).map((feat, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                  {feat}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-[11px]">Core Features</span>
                            )}
                            {est.selected_features && est.selected_features.length > 3 && (
                              <span className="text-slate-400 text-[10px]">+{est.selected_features.length - 3} more</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-500">
                          {new Date(est.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEstimate(est)}
                            className="text-[11px] py-1 px-2"
                          >
                            <Eye className="w-3 h-3 mr-1" /> Inspect
                          </Button>
                          {est.contact_email && (
                            <a
                              href={`mailto:${est.contact_email}?subject=CodeNova: Regarding your ${est.project_type} estimate`}
                              className="inline-flex items-center text-[11px] py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition"
                            >
                              Contact
                            </a>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: CLIENTS */}
        {/* ========================================================================= */}
        {activeTab === 'clients' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registered Client Organizations</h3>
                <p className="text-xs text-slate-500">Manage client accounts, security access, and invitation tokens.</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsInviting(!isInviting)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite New Client
              </Button>
            </div>

            {/* Invite Client Box */}
            {isInviting && (
              <form onSubmit={handleInviteClient} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Generate Portal Invitation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Jaswinder Singh"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. client@domain.com"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Company / Org</label>
                    <input
                      type="text"
                      value={inviteCompany}
                      onChange={(e) => setInviteCompany(e.target.value)}
                      placeholder="e.g. Malwa Cold Storage Logistics"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsInviting(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 text-white text-xs">
                    Generate Invitation Token
                  </Button>
                </div>
              </form>
            )}

            {generatedInviteLink && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-900 block">Invitation Link Generated:</span>
                <input
                  type="text"
                  readOnly
                  value={generatedInviteLink}
                  className="w-full bg-white p-2 border border-blue-300 rounded text-xs font-mono text-blue-800"
                  onClick={(e) => (e.target as any).select()}
                />
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Active Projects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{c.company}</td>
                      <td className="py-3 px-4">
                        <span>{c.email}</span>
                        <span className="block text-[11px] text-slate-400">{c.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600">{c.active_projects_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: PROJECTS */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Active Client Projects & Engineering Delivery Sprints</h3>
                <p className="text-xs text-slate-500">Manage client milestones, delivery progress, and deliverables.</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsCreatingProject(!isCreatingProject)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Initialize New Project
              </Button>
            </div>

            {/* Create Project Modal / Inline Form */}
            {isCreatingProject && (
              <form onSubmit={handleCreateProject} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Setup New Client Engineering Project</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Target Client Organization *</label>
                    <select
                      required
                      value={prjClientId}
                      onChange={(e) => setPrjClientId(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">Select Organization...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company} ({c.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={prjTitle}
                      onChange={(e) => setPrjTitle(e.target.value)}
                      placeholder="e.g. Cold Storage Fleet Telemetry ERP"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Service Category</label>
                    <select
                      value={prjServiceType}
                      onChange={(e) => setPrjServiceType(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Web Application Development">Web Application Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                      <option value="AI Agents & Automation">AI Agents & Automation</option>
                      <option value="E-Commerce Architecture">E-Commerce Architecture</option>
                      <option value="Dedicated Engineering Team">Dedicated Engineering Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Contract Budget (INR) *</label>
                    <input
                      type="number"
                      required
                      value={prjBudget}
                      onChange={(e) => setPrjBudget(e.target.value)}
                      placeholder="390000"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Target Handover Date</label>
                    <input
                      type="date"
                      value={prjDeliveryDate}
                      onChange={(e) => setPrjDeliveryDate(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Assigned Engineering Lead</label>
                    <input
                      type="text"
                      value={prjLead}
                      onChange={(e) => setPrjLead(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Scope Description & Specifications</label>
                  <textarea
                    rows={2}
                    value={prjDesc}
                    onChange={(e) => setPrjDesc(e.target.value)}
                    placeholder="Brief architectural scope, sprint deliverable expectations..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsCreatingProject(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 text-white text-xs">
                    Initialize Project
                  </Button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Project / Code</th>
                    <th className="py-3 px-4">Client Organization</th>
                    <th className="py-3 px-4">Service & Lead</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Budget & Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No projects created yet. Use "Initialize New Project" above.
                      </td>
                    </tr>
                  ) : (
                    projects.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{p.title}</span>
                          <span className="text-[11px] font-mono text-blue-600 font-bold">{p.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{p.client_company}</span>
                          <span className="text-[11px] text-slate-500">{p.client_name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 font-medium block">{p.service_type}</span>
                          <span className="text-[10px] text-slate-400 block">{p.assigned_lead}</span>
                        </td>
                        <td className="py-3 px-4 min-w-[140px]">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                            <span>{p.progress_percentage}%</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleUpdateProjectProgress(p.id, Math.max(0, p.progress_percentage - 10))}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-600 font-bold"
                                title="-10%"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleUpdateProjectProgress(p.id, Math.min(100, p.progress_percentage + 10))}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-600 font-bold"
                                title="+10%"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${p.progress_percentage}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={p.status}
                            onChange={(e) => handleUpdateProjectStatus(p.id, e.target.value)}
                            className="text-[11px] font-semibold rounded px-2 py-0.5 border border-slate-200 bg-white"
                          >
                            <option value="Planning">Planning</option>
                            <option value="Inquiry">Inquiry</option>
                            <option value="In_Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Completed">Completed</option>
                            <option value="On_Hold">On Hold</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block font-mono">
                            ₹{p.budget ? p.budget.toLocaleString('en-IN') : '0'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{p.target_delivery_date}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ORDERS & PAYMENT TRACKING */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Service Bookings & Order Payment Registry</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Deposit Paid</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold font-mono text-blue-600">{o.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{o.customer_name}</span>
                        <span className="text-[11px] text-slate-500">{o.customer_email}</span>
                      </td>
                      <td className="py-3 px-4">{o.service_name}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{o.total_amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600">₹{o.deposit_amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-semibold text-amber-600">₹{o.remaining_balance.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                          {o.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: INVOICES */}
        {/* ========================================================================= */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enterprise Invoices & Accounts</h3>
                <p className="text-xs text-slate-500">Create GST invoices, track receipts, and manage receivables.</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsCreatingInvoice(!isCreatingInvoice)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Invoice
              </Button>
            </div>

            {isCreatingInvoice && (
              <form onSubmit={handleCreateInvoice} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Generate Client Invoice</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Target Client *</label>
                    <select
                      required
                      value={invClientId}
                      onChange={(e) => setInvClientId(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">Select Client...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.company})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Deliverable / Item Description</label>
                    <input
                      type="text"
                      value={invItemDesc}
                      onChange={(e) => setInvItemDesc(e.target.value)}
                      placeholder="e.g. Sprint 2 SQLite Driver Handover"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Subtotal Amount (INR)</label>
                    <input
                      type="number"
                      value={invItemAmount}
                      onChange={(e) => setInvItemAmount(e.target.value)}
                      placeholder="50000"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsCreatingInvoice(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 text-white text-xs">
                    Issue Invoice
                  </Button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Receipt</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{inv.invoice_number}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{inv.client_company || inv.client_name}</td>
                      <td className="py-3 px-4">{inv.due_date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{inv.total_amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{inv.receipt_number || 'Pending'}</td>
                      <td className="py-3 px-4 text-right">
                        {inv.status !== 'Paid' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkInvoicePaid(inv.id)}
                            className="text-[11px] py-1 px-2.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          >
                            <Check className="w-3 h-3 mr-1" /> Reconcile Paid
                          </Button>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: TICKETS */}
        {/* ========================================================================= */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Engineering Helpdesk & SLAs</h3>
            <div className="space-y-3">
              {tickets.map((tkt) => (
                <div key={tkt.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs font-mono text-blue-600">{tkt.id}</span>
                      <span className="font-bold text-sm text-slate-900">{tkt.subject}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                        {tkt.priority}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        tkt.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tkt.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    Client: {tkt.client_name} ({tkt.client_email}) • Desk: {tkt.assigned_to}
                  </div>

                  {replyTicketId === tkt.id ? (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                      <textarea
                        rows={2}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type response to client..."
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setReplyTicketId(null)} className="text-xs">
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendTicketReply(tkt.id)}
                          className="bg-blue-600 text-white text-xs font-semibold"
                        >
                          Send Response
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyTicketId(tkt.id)}
                        className="text-xs py-1 px-3"
                      >
                        Reply as Engineer
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: AUDIT LOGS */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Security & Administrative Audit Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800 font-sans">{log.user_name}</td>
                      <td className="py-2.5 px-4">{log.user_role}</td>
                      <td className="py-2.5 px-4 font-bold text-blue-600">{log.action}</td>
                      <td className="py-2.5 px-4 font-sans text-slate-700">{log.details}</td>
                      <td className="py-2.5 px-4 text-slate-400">{log.ip_address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-500">{selectedLead.email}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Service:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.service}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Budget:</span>
                  <span className="font-semibold text-slate-800 font-mono">{selectedLead.budget}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Company:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.company || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone:</span>
                  <span className="font-semibold text-slate-800">{selectedLead.phone || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1">Message / Requirements:</span>
                <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
                  {selectedLead.message}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" onClick={() => setSelectedLead(null)}>
                  Close
                </Button>
                <a
                  href={`mailto:${selectedLead.email}?subject=CodeNova: Follow-up regarding ${selectedLead.service}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Consultation Details Modal */}
        {selectedConsultation && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedConsultation.name}</h3>
                  <p className="text-xs text-slate-500">{selectedConsultation.email}</p>
                </div>
                <button onClick={() => setSelectedConsultation(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Service / Project:</span>
                  <span className="font-semibold text-slate-800">{selectedConsultation.project_type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status:</span>
                  <span className="font-semibold text-blue-600">{selectedConsultation.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Scheduled Date:</span>
                  <span className="font-semibold text-slate-800">{selectedConsultation.preferred_date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Time Slot:</span>
                  <span className="font-semibold text-slate-800">{selectedConsultation.preferred_time}</span>
                </div>
              </div>

              {selectedConsultation.message && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Client Consultation Agenda:</span>
                  <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
                    {selectedConsultation.message}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <a
                  href={selectedConsultation.meeting_url || 'https://meet.google.com/codenova-discovery'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold"
                >
                  <Video className="w-4 h-4 text-blue-600" /> Open Meet Link
                </a>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedConsultation(null)}>
                    Close
                  </Button>
                  <a
                    href={`mailto:${selectedConsultation.email}?subject=CodeNova: Regarding your upcoming consultation on ${selectedConsultation.preferred_date}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estimator Details Modal */}
        {selectedEstimate && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedEstimate.project_type} Estimate</h3>
                  <p className="text-xs text-slate-500">Tier: {selectedEstimate.complexity}</p>
                </div>
                <button onClick={() => setSelectedEstimate(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Prospect Name:</span>
                  <span className="font-semibold text-slate-800">{selectedEstimate.contact_name || 'Anonymous'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Prospect Email:</span>
                  <span className="font-semibold text-slate-800">{selectedEstimate.contact_email || 'N/A'}</span>
                </div>
                <div className="col-span-2 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-purple-800 text-[11px] font-semibold block uppercase tracking-wider">Estimated Budget Band</span>
                  <span className="font-mono font-black text-xl text-purple-950">
                    ₹{selectedEstimate.estimated_min?.toLocaleString('en-IN')} – ₹{selectedEstimate.estimated_max?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-1.5">Selected Modules / Features:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEstimate.selected_features && selectedEstimate.selected_features.length > 0 ? (
                    selectedEstimate.selected_features.map((feat, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                        {feat}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Core architecture modules</span>
                  )}
                </div>
              </div>

              {selectedEstimate.notes && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Additional Project Specifications:</span>
                  <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
                    {selectedEstimate.notes}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" onClick={() => setSelectedEstimate(null)}>
                  Close
                </Button>
                {selectedEstimate.contact_email && (
                  <a
                    href={`mailto:${selectedEstimate.contact_email}?subject=CodeNova: Proposal for your ${selectedEstimate.project_type}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    Send Proposal
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
