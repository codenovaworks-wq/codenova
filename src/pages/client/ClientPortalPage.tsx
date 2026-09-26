import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  CreditCard,
  LifeBuoy,
  Bell,
  LogOut,
  Upload,
  Download,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  User,
  Plus,
  ArrowUpRight,
  Check,
  X,
  RefreshCw,
  Zap,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { launchRazorpayPayment } from '../../lib/razorpay';
import { useCurrency, CurrencySwitcher } from '../../context/CurrencyContext';
import {
  PortalProject,
  ProjectDeliverable,
  Invoice,
  SupportTicket,
  ProjectFile,
  ProjectMessage,
  PortalNotification,
} from '../../types';

interface ClientPortalPageProps {
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const ClientPortalPage: React.FC<ClientPortalPageProps> = ({
  onLogout,
  onNavigate,
}) => {
  const { currency, setCurrency, formatPrice, currencySymbol } = useCurrency();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'services_pricing' | 'consultation' | 'files' | 'chat' | 'invoices' | 'tickets'
  >('overview');

  const [isLoading, setIsLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);

  // Action states
  const [actionFeedback, setActionFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Deliverable review modal state
  const [reviewDeliverable, setReviewDeliverable] = useState<{
    projectId: string;
    deliverable: ProjectDeliverable;
  } | null>(null);
  const [deliverableComment, setDeliverableComment] = useState('');

  // Payment modal state
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [payerVpa, setPayerVpa] = useState('client@okaxis');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);

  // New ticket state
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Technical' | 'Billing' | 'Scope_Change' | 'General'>('Technical');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [ticketMessage, setTicketMessage] = useState('');

  // Service booking state inside portal
  const [selectedBookingTier, setSelectedBookingTier] = useState<'starter' | 'business' | 'enterprise' | 'retainer'>('business');
  const [bookingProjectTitle, setBookingProjectTitle] = useState('');
  const [bookingRequirements, setBookingRequirements] = useState('');
  const [bookingAddons, setBookingAddons] = useState<string[]>([]);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<any | null>(null);

  // Consultation booking state inside portal
  const [consultType, setConsultType] = useState('Technical Architecture & Stack Review');
  const [consultDate, setConsultDate] = useState('');
  const [consultTime, setConsultTime] = useState('14:00 - 15:00 IST');
  const [consultNotes, setConsultNotes] = useState('');
  const [isSubmittingConsult, setIsSubmittingConsult] = useState(false);
  const [consultSuccessModal, setConsultSuccessModal] = useState<any | null>(null);

  // Chat input
  const [chatMessageText, setChatMessageText] = useState('');

  // File upload form state
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [uploadFileFolder, setUploadFileFolder] = useState('Specifications');

  const loadPortalData = async () => {
    setIsLoading(true);
    try {
      const [meRes, dashRes] = await Promise.all([
        apiClient.getClientMe(),
        apiClient.getClientDashboard(),
      ]);

      setClientProfile(meRes);
      setDashboardData(dashRes);
      const prjs = dashRes.projects || [];
      setProjects(prjs);
      if (prjs.length > 0 && !selectedProjectId) {
        setSelectedProjectId(prjs[0].id);
      }
      setInvoices(dashRes.invoices || []);
      setTickets(dashRes.tickets || []);
      setNotifications(dashRes.notifications || []);
    } catch (err: any) {
      console.error('Failed to load portal data:', err);
      setActionFeedback('Failed to load client workspace data. Please re-login.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  // When selected project changes, load files and chat
  useEffect(() => {
    if (selectedProjectId) {
      apiClient.getClientFiles(selectedProjectId).then(setFiles).catch(console.error);
      apiClient.getClientMessages(selectedProjectId).then(setMessages).catch(console.error);
    }
  }, [selectedProjectId]);

  const handleApproveDeliverable = async (projectId: string, deliverableId: string, feedback?: string) => {
    setIsSubmitting(true);
    try {
      await apiClient.approveDeliverable(projectId, deliverableId, feedback);
      setActionSuccess('Deliverable approved! Team has been notified to proceed.');
      setReviewDeliverable(null);
      setDeliverableComment('');
      loadPortalData();
      if (selectedProjectId) {
        const updatedFiles = await apiClient.getClientFiles(selectedProjectId);
        setFiles(updatedFiles);
      }
    } catch (err: any) {
      setActionFeedback(err.message || 'Error approving deliverable');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectDeliverable = async (projectId: string, deliverableId: string, feedback: string) => {
    if (!feedback.trim()) {
      setActionFeedback('Please provide feedback or specific revision notes for our engineering team.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.rejectDeliverable(projectId, deliverableId, feedback);
      setActionSuccess('Revision request submitted. Our engineers will update the asset promptly.');
      setReviewDeliverable(null);
      setDeliverableComment('');
      loadPortalData();
    } catch (err: any) {
      setActionFeedback(err.message || 'Error requesting revision');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !selectedProjectId) return;

    try {
      const newMsg = await apiClient.sendClientMessage(selectedProjectId, {
        message: chatMessageText.trim(),
      });
      setMessages((prev) => [...prev, newMsg]);
      setChatMessageText('');
    } catch (err: any) {
      setActionFeedback(err.message || 'Failed to send message');
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName || !selectedProjectId) return;

    try {
      const added = await apiClient.uploadClientFile(selectedProjectId, {
        name: uploadFileName,
        file_url: uploadFileUrl || 'https://codenova.tech/assets/sample-client-doc.pdf',
        folder: uploadFileFolder,
        size_bytes: 204800,
      });
      setFiles((prev) => [added, ...prev]);
      setIsUploadingFile(false);
      setUploadFileName('');
      setUploadFileUrl('');
      setActionSuccess('File uploaded successfully to project repository.');
    } catch (err: any) {
      setActionFeedback(err.message || 'Failed to upload file');
    }
  };

  const handlePayInvoice = async () => {
    if (!paymentInvoice) return;
    setIsPaying(true);
    setActionFeedback('');

    // Launch official Razorpay standard checkout
    await launchRazorpayPayment({
      invoiceId: paymentInvoice.id,
      amount: paymentInvoice.total_amount,
      currency: 'INR',
      title: 'CodeNova Engineering Desk',
      description: `Settlement for Invoice #${paymentInvoice.invoice_number}`,
      prefill: {
        name: clientProfile?.name || 'Valued Client',
        email: clientProfile?.email || '',
        contact: clientProfile?.phone || '',
      },
      onSuccess: (data) => {
        setIsPaying(false);
        const settledInvoice = data.invoice || {
          ...paymentInvoice,
          status: 'Paid',
          receipt_number: data.receiptNumber,
          paid_at: new Date().toISOString(),
        };
        setPaymentSuccessReceipt(settledInvoice);
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === paymentInvoice.id ? settledInvoice : inv))
        );
        loadPortalData();
      },
      onError: (err) => {
        setIsPaying(false);
        setActionFeedback(err.description || 'Payment was not completed. Please try again.');
      },
      onDismiss: () => {
        setIsPaying(false);
      },
    });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    setIsSubmitting(true);
    try {
      const newTkt = await apiClient.createClientTicket({
        subject: ticketSubject,
        category: ticketCategory,
        priority: ticketPriority,
        project_id: selectedProjectId || undefined,
        message: ticketMessage,
      });
      setTickets((prev) => [newTkt, ...prev]);
      setIsCreatingTicket(false);
      setTicketSubject('');
      setTicketMessage('');
      setActionSuccess(`Support Ticket ${newTkt.id} submitted. Engineering desk alerted.`);
    } catch (err: any) {
      setActionFeedback(err.message || 'Failed to open ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookServicePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingProjectTitle.trim() || !bookingRequirements.trim()) {
      setActionFeedback('Please provide a project title and brief requirements.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const packageNames: Record<string, string> = {
        starter: 'Starter MVP / Fast Sprint',
        business: 'Standard Business Suite',
        enterprise: 'Enterprise Multi-Tenant / Custom Scale',
        retainer: 'Dedicated Monthly Engineering Retainer',
      };
      const packagePricesINR: Record<string, number> = {
        starter: 195000,
        business: 390000,
        enterprise: 690000,
        retainer: 240000,
      };
      const packagePricesUSD: Record<string, number> = {
        starter: 3999,
        business: 7999,
        enterprise: 14999,
        retainer: 4999,
      };

      const selectedName = packageNames[selectedBookingTier];
      const amountINR = packagePricesINR[selectedBookingTier];
      const amountUSD = packagePricesUSD[selectedBookingTier];

      const orderPayload = {
        customer_name: clientProfile?.user?.name || clientProfile?.client?.name || 'Client',
        customer_email: clientProfile?.user?.email || clientProfile?.client?.email || 'client@codenova.tech',
        customer_company: clientProfile?.client?.company || clientProfile?.user?.company || 'Direct',
        customer_phone: clientProfile?.client?.phone || '+91 6280538868',
        service_id: selectedBookingTier,
        service_name: selectedName,
        package_tier: selectedBookingTier,
        selected_addons: bookingAddons,
        total_amount: currency === 'INR' ? amountINR : amountUSD,
        deposit_amount: Math.round((currency === 'INR' ? amountINR : amountUSD) * 0.3),
        currency: currency,
        requirements_brief: `Project: ${bookingProjectTitle}. Specs: ${bookingRequirements}. Add-ons: ${bookingAddons.join(', ') || 'None'}`,
      };

      const res = await apiClient.createOrder(orderPayload);
      setBookingSuccessModal({
        order_id: res.order?.order_number || res.order?.id || `CN-${Math.floor(100000 + Math.random() * 900000)}`,
        package: selectedName,
        title: bookingProjectTitle,
        amount: currency === 'INR' ? `₹${amountINR.toLocaleString('en-IN')}` : `$${amountUSD.toLocaleString()}`,
        addons: bookingAddons,
      });
      setActionSuccess(`Service package "${selectedName}" booked successfully! Order confirmed.`);
      setBookingProjectTitle('');
      setBookingRequirements('');
      setBookingAddons([]);
      loadPortalData();
    } catch (err: any) {
      setActionFeedback(err.message || 'Failed to book service package. Please retry.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultDate) {
      setActionFeedback('Please select a preferred consultation date.');
      return;
    }

    setIsSubmittingConsult(true);
    try {
      const payload = {
        name: clientProfile?.user?.name || clientProfile?.client?.name || 'Valued Client',
        email: clientProfile?.user?.email || clientProfile?.client?.email || 'client@codenova.tech',
        company: clientProfile?.client?.company || clientProfile?.user?.company || 'Direct',
        project_type: consultType,
        preferred_date: consultDate,
        preferred_time: consultTime,
        message: consultNotes || 'General Project Architecture & Progress Review',
      };

      const res = await apiClient.bookConsultation(payload);
      setConsultSuccessModal({
        reference_id: res.consultationId || `CN-CONS-${Math.floor(1000 + Math.random() * 9000)}`,
        consultType,
        date: consultDate,
        time: consultTime,
      });
      setActionSuccess('Consultation booked! Lead Engineer Er. Gagandeep Singh will contact you at the scheduled time.');
      setConsultNotes('');
    } catch (err: any) {
      setActionFeedback(err.message || 'Failed to book consultation session.');
    } finally {
      setIsSubmittingConsult(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="text-lg font-black tracking-tight flex items-center gap-2 hover:opacity-90"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                CN
              </div>
              <span>CodeNova</span>
            </button>
            <span className="text-slate-500 font-light">|</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
              Client Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Switcher for India (INR) vs Global (USD) */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <CurrencySwitcher />
            </div>

            {/* User Profile Tag */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
              <Building className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white">
                {clientProfile?.client?.company || clientProfile?.user?.company || 'Enterprise Client'}
              </span>
              <span className="text-slate-500">•</span>
              <span>{clientProfile?.user?.name || 'Authorized Lead'}</span>
            </div>

            {/* Notification Badge */}
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>

            {/* Support Desk Quick Button */}
            <button
              type="button"
              onClick={() => setActiveTab('tickets')}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
              <span>Harike Desk Help</span>
            </button>

            {/* Sign Out */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-800/40 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Success / Alert Banner */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-6 bg-white p-2 rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Workspace Overview
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Projects & Deliverables
            {dashboardData?.stats?.pending_approvals > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
                {dashboardData.stats.pending_approvals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services_pricing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'services_pricing'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Book Service & Pricing
          </button>

          <button
            onClick={() => setActiveTab('consultation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'consultation'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            Book Consultation
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'files'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Files & Documents
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Team Chat
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'invoices'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Billing & Invoices
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'tickets'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            Support Desk
            {dashboardData?.stats?.open_tickets > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {dashboardData.stats.open_tickets}
              </span>
            )}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={loadPortalData}
              title="Refresh Workspace"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Active Software Projects</span>
                  <FolderKanban className="w-4 h-4 text-blue-600" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-slate-900">
                  {dashboardData?.stats?.active_projects || 0}
                </div>
                <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Sprint in progress
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Pending Deliverable Approvals</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-slate-900">
                  {dashboardData?.stats?.pending_approvals || 0}
                </div>
                <div className="mt-1 text-xs text-amber-600 font-semibold">
                  Awaiting your sign-off
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Invoices & Billing</span>
                  <CreditCard className="w-4 h-4 text-purple-600" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-slate-900">
                  ₹
                  {invoices
                    .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
                    .reduce((sum, i) => sum + i.total_amount, 0)
                    .toLocaleString('en-IN')}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {invoices.filter((i) => i.status === 'Paid').length} invoices settled
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Dedicated Tech Lead</span>
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="mt-2 text-sm font-bold text-slate-900 truncate">
                  Er. Gagandeep Singh
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Harike Kalan, Muktsar HQ (+91 6280538868)
                </div>
              </div>
            </div>

            {/* Pending Deliverables Alert Card */}
            {dashboardData?.pendingDeliverables?.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <h3 className="text-base font-bold text-slate-900">
                      Deliverables Awaiting Client Sign-Off ({dashboardData.pendingDeliverables.length})
                    </h3>
                  </div>
                  <span className="text-xs text-amber-800 font-medium">
                    Review and approve to trigger next engineering sprint
                  </span>
                </div>

                <div className="space-y-3">
                  {dashboardData.pendingDeliverables.map((deliv: any) => (
                    <div
                      key={deliv.id}
                      className="bg-white p-4 rounded-xl border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{deliv.title}</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded">
                            {deliv.version}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{deliv.description}</p>
                        <div className="text-xs text-slate-400 mt-1">
                          Project: {deliv.project_title} • Submitted:{' '}
                          {new Date(deliv.submitted_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {deliv.file_url && (
                          <a
                            href={deliv.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Asset
                          </a>
                        )}
                        <Button
                          size="sm"
                          onClick={() => {
                            setReviewDeliverable({
                              projectId: deliv.project_id,
                              deliverable: deliv,
                            });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3"
                        >
                          Review & Sign Off
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Projects Quick View */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Your Engineering Projects</h3>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  View Details & Tasks
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                          {project.service_type}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{project.title}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-600 font-medium mb-1.5">
                        <span>Milestone Progress</span>
                        <span className="font-bold text-blue-600">{project.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress_percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Delivery Target: {project.target_delivery_date}</span>
                      <span>Budget: ₹{project.budget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PROJECTS & DELIVERABLES */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Project Selector Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Active Project Selector
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="text-base font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProject && (
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div>
                    <span className="block text-slate-400">Assigned Tech Lead:</span>
                    <span className="font-semibold text-slate-800">{selectedProject.assigned_lead}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="block text-slate-400">Target Delivery:</span>
                    <span className="font-semibold text-slate-800">{selectedProject.target_delivery_date}</span>
                  </div>
                </div>
              )}
            </div>

            {selectedProject && (
              <>
                {/* Milestone Progression Timeline */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Milestone Roadmap & Sprints</h3>
                  <div className="space-y-4">
                    {(selectedProject.milestones || []).map((m, idx) => (
                      <div
                        key={m.id}
                        className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              m.status === 'Completed'
                                ? 'bg-emerald-600 text-white'
                                : m.status === 'In_Progress'
                                ? 'bg-blue-600 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {m.status === 'Completed' ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">{m.description}</p>
                            {m.completed_at && (
                              <span className="text-[11px] text-emerald-700 font-medium">
                                Completed: {new Date(m.completed_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold self-start sm:self-auto ${
                            m.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'In_Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables for Approval */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Project Deliverables & Handover Assets</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Executable binaries, database blueprints, APK packages, and staging credentials.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(selectedProject.deliverables || []).length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-500">
                        No deliverables uploaded yet for this sprint.
                      </div>
                    ) : (
                      selectedProject.deliverables.map((deliv) => (
                        <div
                          key={deliv.id}
                          className="p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{deliv.title}</span>
                              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                                {deliv.version}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                  deliv.status === 'Approved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : deliv.status === 'Pending_Approval'
                                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {deliv.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{deliv.description}</p>
                            {deliv.client_feedback && (
                              <div className="mt-2 text-xs p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700">
                                <span className="font-semibold text-slate-800">Your Feedback:</span>{' '}
                                {deliv.client_feedback}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {deliv.file_url && (
                              <a
                                href={deliv.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download
                              </a>
                            )}
                            {deliv.status === 'Pending_Approval' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setReviewDeliverable({
                                    projectId: selectedProject.id,
                                    deliverable: deliv,
                                  });
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3"
                              >
                                Review Sign-Off
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Engineering Tasks Live Board */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Live Engineering Sprint Tasks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Todo */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                        Queue / Backlog
                      </div>
                      <div className="space-y-2">
                        {(selectedProject.tasks || [])
                          .filter((t) => t.status === 'Todo')
                          .map((task) => (
                            <div key={task.id} className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                              <span className="font-semibold text-slate-900 block">{task.title}</span>
                              <span className="text-[11px] text-slate-500 mt-1 block">{task.description}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* In Progress */}
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                      <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">
                        In Progress
                      </div>
                      <div className="space-y-2">
                        {(selectedProject.tasks || [])
                          .filter((t) => t.status === 'In_Progress')
                          .map((task) => (
                            <div key={task.id} className="p-3 bg-white rounded-lg border border-blue-200 text-xs">
                              <span className="font-semibold text-slate-900 block">{task.title}</span>
                              <span className="text-[11px] text-slate-500 mt-1 block">{task.description}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Done */}
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                      <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                        Completed
                      </div>
                      <div className="space-y-2">
                        {(selectedProject.tasks || [])
                          .filter((t) => t.status === 'Done')
                          .map((task) => (
                            <div key={task.id} className="p-3 bg-white rounded-lg border border-emerald-200 text-xs">
                              <span className="font-semibold text-slate-900 block">{task.title}</span>
                              <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                                <Check className="w-3 h-3" /> QA Verified
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: SERVICES & PRICING (BOOK SERVICE IN CLIENT PORTAL) */}
        {/* ========================================================================= */}
        {activeTab === 'services_pricing' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fixed-Price Engineering Services & Milestone Packages</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Book Development Packages Online
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
                    Deterministic pricing, verifiable staging milestones, and 100% intellectual property transfer. Current rates rendered in{' '}
                    <span className="font-bold text-amber-300">
                      {currency === 'INR' ? '🇮🇳 Indian Rupee (₹) Domestic Pricing' : '🌐 International USD ($) Global Rates'}
                    </span>.
                  </p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shrink-0 text-right">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Country Currency:</div>
                  <div className="text-sm font-extrabold text-white">{currency === 'INR' ? 'India (INR ₹)' : 'Global / US (USD $)'}</div>
                </div>
              </div>
            </div>

            {/* Service Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Starter MVP */}
              <div
                onClick={() => setSelectedBookingTier('starter')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBookingTier === 'starter'
                    ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-blue-300 shadow-xs'
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    3 – 5 Weeks
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">Starter MVP Sprint</h3>
                  <div className="my-3 text-2xl font-black text-slate-900 font-mono">
                    {formatPrice(195000, 3999)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Fast validation for early-stage MVPs, internal automation tools, or focused single-platform systems.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Complete functional MVP</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Offline SQLite OR Web Cloud</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Automated CI/CD build</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>30-Day Critical SLA Warranty</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                      selectedBookingTier === 'starter'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedBookingTier === 'starter' ? 'Selected Package' : 'Select Package'}
                  </span>
                </div>
              </div>

              {/* Standard Business Suite */}
              <div
                onClick={() => setSelectedBookingTier('business')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                  selectedBookingTier === 'business'
                    ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-blue-300 shadow-xs'
                }`}
              >
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full shadow-xs">
                  Most Popular
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    6 – 10 Weeks
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">Standard Business Suite</h3>
                  <div className="my-3 text-2xl font-black text-slate-900 font-mono">
                    {formatPrice(390000, 7999)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Complete offline desktop station with hardware peripheral drivers or deterministic business web portals.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Offline SQLite + Cloud Sync</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>ESC/POS Printer & Barcode Drivers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Grounded Deterministic AI</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>60-Day SLA & Code Transfers</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                      selectedBookingTier === 'business'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedBookingTier === 'business' ? 'Selected Package' : 'Select Package'}
                  </span>
                </div>
              </div>

              {/* Enterprise Custom Scale */}
              <div
                onClick={() => setSelectedBookingTier('enterprise')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBookingTier === 'enterprise'
                    ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-blue-300 shadow-xs'
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    10 – 16 Weeks
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">Enterprise Multi-Tenant</h3>
                  <div className="my-3 text-2xl font-black text-slate-900 font-mono">
                    {formatPrice(690000, 14999)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    High-throughput platforms, distributed SaaS, multi-entity ERPs, or mission-critical institutional software.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dedicated Senior Engineering Pod</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Redis Distributed Concurrency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>OWASP Security Hardening</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>90-Day SLA & 24/7 Hotline</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                      selectedBookingTier === 'enterprise'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedBookingTier === 'enterprise' ? 'Selected Package' : 'Select Package'}
                  </span>
                </div>
              </div>

              {/* Monthly Retainer */}
              <div
                onClick={() => setSelectedBookingTier('retainer')}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBookingTier === 'retainer'
                    ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-blue-300 shadow-xs'
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Monthly Rolling
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">Dedicated Retainer Pod</h3>
                  <div className="my-3 text-2xl font-black text-slate-900 font-mono">
                    {formatPrice(240000, 4999)} <span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Full-stack senior engineer allocated exclusively to your product roadmap, sprints, and integrations.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>160 hours / month capacity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Direct daily standups & Slack</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Continuous CI/CD deployments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>4-Hour SLA Emergency Response</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                      selectedBookingTier === 'retainer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedBookingTier === 'retainer' ? 'Selected Package' : 'Select Package'}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Booking Form Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Configure & Book This Service Package</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Selected Package:{' '}
                  <span className="text-blue-600">
                    {selectedBookingTier === 'starter' && 'Starter MVP Sprint'}
                    {selectedBookingTier === 'business' && 'Standard Business Suite'}
                    {selectedBookingTier === 'enterprise' && 'Enterprise Multi-Tenant'}
                    {selectedBookingTier === 'retainer' && 'Dedicated Monthly Retainer'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Submit your project requirements below. Our lead engineering desk will review the specifications, setup the private staging repo, and prepare milestone contract phase 1.
                </p>

                <form onSubmit={handleBookServicePackage} className="mt-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Project or System Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingProjectTitle}
                      onChange={(e) => setBookingProjectTitle(e.target.value)}
                      placeholder="e.g. Grain Mandi Automated Weighbridge POS & Inventory System"
                      className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Scope, Technical Goals & Specific Modules *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={bookingRequirements}
                      onChange={(e) => setBookingRequirements(e.target.value)}
                      placeholder="Describe target user workflows, offline requirements, database entities, APIs to integrate, or any special hardware peripherals..."
                      className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Optional Technical Add-ons */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Optional Engineering Modules:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {[
                        'ESC/POS Thermal Printer & Barcode Scanner Integration',
                        'Redis High-Throughput Concurrency Lock Engine',
                        'Offline-First SQLite Automatic Cloud Sync Engine',
                        '24/7 Production SLA & Critical Incident Hotline',
                      ].map((addon) => {
                        const isChecked = bookingAddons.includes(addon);
                        return (
                          <label
                            key={addon}
                            onClick={() => {
                              if (isChecked) {
                                setBookingAddons(bookingAddons.filter((a) => a !== addon));
                              } else {
                                setBookingAddons([...bookingAddons, addon]);
                              }
                            }}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                              isChecked
                                ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-semibold'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span>{addon}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary & Submit */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-slate-600">
                      <span>Total Estimated Investment: </span>
                      <span className="text-lg font-extrabold text-slate-900 font-mono">
                        {selectedBookingTier === 'starter' && formatPrice(195000, 3999)}
                        {selectedBookingTier === 'business' && formatPrice(390000, 7999)}
                        {selectedBookingTier === 'enterprise' && formatPrice(690000, 14999)}
                        {selectedBookingTier === 'retainer' && `${formatPrice(240000, 4999)} / mo`}
                      </span>
                      <span className="text-slate-400 block text-[11px]">
                        Payable across escrow milestones upon staging verification.
                      </span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {isSubmittingBooking ? 'Submitting Order...' : 'Confirm & Book Service Online'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: BOOK CONSULTATION (IN CLIENT PORTAL) */}
        {/* ========================================================================= */}
        {activeTab === 'consultation' && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Strategic Engineering Consultation</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Schedule Discovery & Architecture Session
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  1-on-1 video / voice session with Er. Gagandeep Singh (Lead Software Architect). Review your architecture blueprints, system bottleneck resolution, or milestone roadmaps.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm max-w-3xl">
              <form onSubmit={handleBookConsultation} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Consultation Subject / Type *
                  </label>
                  <select
                    value={consultType}
                    onChange={(e) => setConsultType(e.target.value)}
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Technical Architecture & Stack Review">
                      Technical Architecture & Tech Stack Scoping
                    </option>
                    <option value="Project Progress & Milestone Review">
                      Active Project Progress & Milestone Deliverable Review
                    </option>
                    <option value="Offline POS & Hardware Drivers">
                      Offline Desktop Stations & Hardware Driver Integration
                    </option>
                    <option value="High-Throughput Redis & Database Scaling">
                      High-Throughput Redis Locking & Multi-Tenant Database Scaling
                    </option>
                    <option value="General Discovery & Custom Software Proposal">
                      General Discovery & Custom Software Proposal
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={consultDate}
                      onChange={(e) => setConsultDate(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Preferred Time Slot (IST) *
                    </label>
                    <select
                      value={consultTime}
                      onChange={(e) => setConsultTime(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="10:00 - 11:00 AM IST">10:00 - 11:00 AM IST (Morning Slot)</option>
                      <option value="02:00 - 03:00 PM IST">02:00 - 03:00 PM IST (Afternoon Slot)</option>
                      <option value="05:00 - 06:00 PM IST">05:00 - 06:00 PM IST (Evening Slot)</option>
                      <option value="08:00 - 09:00 PM IST">08:00 - 09:00 PM IST (Late Slot / US Overlap)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Discussion Agenda & Context Notes
                  </label>
                  <textarea
                    rows={4}
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    placeholder="Provide details on your system requirements, active bottlenecks, or specific questions for Er. Gagandeep Singh..."
                    className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  <div className="font-semibold text-blue-950 mb-0.5">Engineering Office Guarantee:</div>
                  Our lead engineering desk confirms all consultation slots within 2 hours. Video conference link (Google Meet) and dial-in details will be emailed directly.
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingConsult}
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSubmittingConsult ? 'Booking Session...' : 'Confirm & Schedule Consultation'}
                  <Calendar className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FILES & DOCUMENTS */}
        {/* ========================================================================= */}
        {activeTab === 'files' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Project Document Repository</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure storage for architecture blueprints, contracts, logos, and build artifacts.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsUploadingFile(!isUploadingFile)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New Document
              </Button>
            </div>

            {/* Upload File Form */}
            {isUploadingFile && (
              <form
                onSubmit={handleUploadFile}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Upload Asset to Project Repository
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Document Title *</label>
                    <input
                      type="text"
                      required
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      placeholder="e.g. Warehouse SQLite Schema.sql"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Target Folder</label>
                    <select
                      value={uploadFileFolder}
                      onChange={(e) => setUploadFileFolder(e.target.value)}
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Specifications">Specifications</option>
                      <option value="Deliverables">Deliverables</option>
                      <option value="Assets">Assets & Branding</option>
                      <option value="Contracts">Contracts & Compliance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">File URL or Artifact Link</label>
                    <input
                      type="text"
                      value={uploadFileUrl}
                      onChange={(e) => setUploadFileUrl(e.target.value)}
                      placeholder="https://... (or leave empty for secure vault)"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUploadingFile(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                    Confirm Upload
                  </Button>
                </div>
              </form>
            )}

            {/* Files List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">File Name</th>
                    <th className="py-3 px-4">Folder</th>
                    <th className="py-3 px-4">Uploaded By</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {files.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No files uploaded yet for this project.
                      </td>
                    </tr>
                  ) : (
                    files.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{file.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                            {file.folder}
                          </span>
                        </td>
                        <td className="py-3 px-4">{file.uploaded_by_name}</td>
                        <td className="py-3 px-4">{new Date(file.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
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
        {/* TAB 4: TEAM CHAT */}
        {/* ========================================================================= */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Direct Engineering Channel: {selectedProject?.title || 'Active Project'}
                </h3>
                <p className="text-xs text-slate-500">
                  Connected to: Er. Gagandeep Singh (CodeNova Harike Kalan Office)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Channel
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400">
                  No messages yet. Send a note below to start communicating with the engineering team.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_role === 'client';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[11px] text-slate-400 mb-1 px-1">
                        {msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                        }`}
                      >
                        {msg.message}
                        {msg.attachment_url && (
                          <div className="mt-2 pt-2 border-t border-white/20">
                            <a
                              href={msg.attachment_url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              {msg.attachment_name || 'Attached File'}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                placeholder="Type your message to the engineering team..."
                className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: INVOICES & BILLING */}
        {/* ========================================================================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Invoices & Financial Accounts</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    GST-compliant tax invoices, payment receipts, and immediate online settlement.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-800 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Project</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No invoices generated yet.
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-4 font-bold text-slate-900">{inv.invoice_number}</td>
                          <td className="py-3 px-4">{inv.project_title || 'Software Development'}</td>
                          <td className="py-3 px-4">{inv.issue_date}</td>
                          <td className="py-3 px-4">{inv.due_date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            ₹{inv.total_amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                inv.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inv.status === 'Overdue'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {inv.status !== 'Paid' ? (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setPaymentInvoice(inv);
                                  setPaymentSuccessReceipt(null);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1 px-3 rounded-lg"
                              >
                                Pay Online
                              </Button>
                            ) : (
                              <span className="text-emerald-700 font-bold text-xs">
                                Paid ({inv.receipt_number || 'Confirmed'})
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: SUPPORT TICKETS */}
        {/* ========================================================================= */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Technical Support Desk</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct SLAs with CodeNova engineering team at Harike Kalan, Muktsar Sahib.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsCreatingTicket(!isCreatingTicket)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Open Support Ticket
                </Button>
              </div>

              {/* Create Ticket Modal / Inline Form */}
              {isCreatingTicket && (
                <form
                  onSubmit={handleCreateTicket}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mb-6"
                >
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Submit Technical Assistance Ticket
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Subject *</label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="e.g. Issue connecting SQLite driver on Windows POS client"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value as any)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Low">Low (General Inquiry)</option>
                        <option value="Medium">Medium (Standard)</option>
                        <option value="High">High (Blocking Feature)</option>
                        <option value="Critical">Critical (Production Outage)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Please explain the error, steps to reproduce, or requested configuration..."
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreatingTicket(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      {isSubmitting ? 'Submitting...' : 'Dispatch Ticket'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Tickets List */}
              <div className="space-y-3">
                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No active support tickets found. Your systems are operating nominally.
                  </div>
                ) : (
                  tickets.map((tkt) => (
                    <div
                      key={tkt.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-blue-600">{tkt.id}</span>
                          <span className="font-bold text-sm text-slate-900">{tkt.subject}</span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              tkt.priority === 'Urgent'
                                ? 'bg-rose-100 text-rose-800'
                                : tkt.priority === 'High'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {tkt.priority}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Category: {tkt.category} • Assigned Desk: {tkt.assigned_to} • Opened:{' '}
                          {new Date(tkt.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold self-start sm:self-auto ${
                          tkt.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tkt.status === 'In_Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tkt.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* REVIEW & SIGN OFF DELIVERABLE MODAL */}
      {/* ========================================================================= */}
      {reviewDeliverable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Deliverable Approval Sign-Off
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {reviewDeliverable.deliverable.title}
                </h3>
              </div>
              <button
                onClick={() => setReviewDeliverable(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {reviewDeliverable.deliverable.description}
            </p>

            {reviewDeliverable.deliverable.file_url && (
              <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Attached Release Artifact:</span>
                <a
                  href={reviewDeliverable.deliverable.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Inspect Artifact
                </a>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Feedback / Notes (Optional for approval, required for revisions)
              </label>
              <textarea
                rows={3}
                value={deliverableComment}
                onChange={(e) => setDeliverableComment(e.target.value)}
                placeholder="e.g. Looks great, verified POS scanning on test machine; or requested font adjustment..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() =>
                  handleRejectDeliverable(
                    reviewDeliverable.projectId,
                    reviewDeliverable.deliverable.id,
                    deliverableComment
                  )
                }
                className="flex-1 text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                Request Revision
              </Button>

              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  handleApproveDeliverable(
                    reviewDeliverable.projectId,
                    reviewDeliverable.deliverable.id,
                    deliverableComment
                  )
                }
                className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {isSubmitting ? 'Recording...' : 'Approve & Sign Off'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ONLINE PAYMENT GATEWAY MODAL */}
      {/* ========================================================================= */}
      {paymentInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Real Online Payment Gateway
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Invoice {paymentInvoice.invoice_number}
                </h3>
              </div>
              <button
                onClick={() => {
                  setPaymentInvoice(null);
                  setPaymentSuccessReceipt(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentSuccessReceipt ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-3" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Payment Processed Successfully!</h4>
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-200">
                  <div>
                    <span className="font-semibold">Receipt Number:</span>{' '}
                    <span className="font-mono text-slate-900 font-bold">
                      {paymentSuccessReceipt.receipt_number}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Total Paid:</span> ₹
                    {paymentSuccessReceipt.total_amount.toLocaleString('en-IN')}
                  </div>
                  <div>
                    <span className="font-semibold">Settled On:</span>{' '}
                    {new Date(paymentSuccessReceipt.paid_at).toLocaleString()}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setPaymentInvoice(null);
                    setPaymentSuccessReceipt(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold mt-2"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-xl border border-blue-800 shadow-inner flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-blue-200 uppercase tracking-wider block font-semibold">Total Payable Amount</span>
                    <span className="text-xl font-black font-mono">
                      ₹{paymentInvoice.total_amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-300 block mt-0.5">Includes standard GST &amp; milestone escrow guarantee</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold rounded">
                      Invoice #{paymentInvoice.invoice_number}
                    </span>
                  </div>
                </div>

                {/* Razorpay Banner & Supported Methods */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Razorpay Secure Checkout</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Instant Settlement
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Pay securely using any UPI app (Google Pay, PhonePe, Paytm), Credit/Debit Card, EMI, or NetBanking.
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-slate-600 font-medium">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">GPay / PhonePe</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Paytm / UPI</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">Visa / Mastercard</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">RuPay</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded">NetBanking</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayInvoice}
                  disabled={isPaying}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
                >
                  {isPaying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Opening Secure Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Pay ₹{paymentInvoice.total_amount.toLocaleString('en-IN')} via Razorpay</span>
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-slate-400" />
                    256-Bit SSL Encrypted · PCI-DSS Compliant Gateway
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOOKING SUCCESS RECEIPT MODAL */}
      {/* ========================================================================= */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Booking Confirmed
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {bookingSuccessModal.package}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Order Reference: <span className="font-mono font-bold text-slate-800">{bookingSuccessModal.order_id}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-2 border border-slate-200 text-left">
              <div>
                <span className="font-semibold text-slate-500">Project Title:</span>{' '}
                <span className="font-bold text-slate-900">{bookingSuccessModal.title}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Total Investment:</span>{' '}
                <span className="font-mono font-extrabold text-slate-900">{bookingSuccessModal.amount}</span>
              </div>
              {bookingSuccessModal.addons?.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-500">Included Add-ons:</span>
                  <ul className="list-disc pl-4 mt-1 text-slate-800 space-y-0.5">
                    {bookingSuccessModal.addons.map((a: string) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-900 text-left">
              <span className="font-bold">Next Steps:</span> Lead Software Architect Er. Gagandeep Singh has received your technical specifications. A private Git staging environment and milestone contract will be deployed to your dashboard.
            </div>

            <Button
              onClick={() => {
                setBookingSuccessModal(null);
                setActiveTab('projects');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Go to Workspace Projects
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONSULTATION SUCCESS MODAL */}
      {/* ========================================================================= */}
      {consultSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Discovery Session Confirmed
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Consultation Scheduled
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Booking Reference: <span className="font-mono font-bold text-slate-800">{consultSuccessModal.reference_id}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-2 border border-slate-200 text-left">
              <div>
                <span className="font-semibold text-slate-500">Session Focus:</span>{' '}
                <span className="font-bold text-slate-900">{consultSuccessModal.consultType}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Confirmed Date:</span>{' '}
                <span className="font-bold text-slate-900">{consultSuccessModal.date}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Confirmed Time:</span>{' '}
                <span className="font-bold text-slate-900">{consultSuccessModal.time}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Lead Architect:</span>{' '}
                <span className="font-bold text-slate-900">Er. Gagandeep Singh (CodeNova Office)</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl text-[11px] text-emerald-900 text-left">
              <span className="font-bold">Google Meet Invitation:</span> Calendar invitation and video conference link have been queued. If you need to reschedule, submit a support ticket via Harike Desk Help.
            </div>

            <Button
              variant="secondary"
              onClick={() => setConsultSuccessModal(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Return to Workspace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
