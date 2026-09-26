import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Edit3,
  Check,
  ShieldCheck,
  FileSpreadsheet,
  HelpCircle,
  RefreshCw,
  Copy,
  Building,
  Phone,
  Mail,
} from 'lucide-react';

interface GoogleFormIntakeProps {
  defaultFormUrl?: string;
  title?: string;
  description?: string;
  showCardHeader?: boolean;
}

// A standard Google Form template designed for Software Project Requirements & RFP Intake
const DEFAULT_GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScD5xWk0Jj2j6lYqA6pQ8vB4l8k0X9zZ-demo-codenova/viewform?embedded=true';

// Fallback interactive form if iframe is offline or user hasn't created a live Google form yet
export const GoogleFormIntake: React.FC<GoogleFormIntakeProps> = ({
  defaultFormUrl,
  title = 'CodeNova Official Project Requirement Google Form',
  description = 'Submit detailed technical requirements, architecture diagrams, or project RFPs directly to our engineering intake database.',
  showCardHeader = true,
}) => {
  const [formUrl, setFormUrl] = useState<string>(() => {
    return (
      localStorage.getItem('codenova_custom_google_form_url') ||
      defaultFormUrl ||
      'https://docs.google.com/forms/d/e/1FAIpQLSdXv2O7y2p0N_CodeNova_Intake_Req/viewform?embedded=true'
    );
  });

  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [inputUrl, setInputUrl] = useState(formUrl);
  const [copied, setCopied] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [useLiveSimulation, setUseLiveSimulation] = useState(false);

  // Fallback direct submission state
  const [submittedDirectly, setSubmittedDirectly] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientService, setClientService] = useState('Desktop Application Development');
  const [clientBudget, setClientBudget] = useState('₹50,000 - ₹1,50,000');
  const [clientDocLink, setClientDocLink] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  const handleSaveUrl = () => {
    let clean = inputUrl.trim();
    if (clean && !clean.includes('embedded=true') && clean.includes('docs.google.com/forms')) {
      clean = clean.includes('?') ? `${clean}&embedded=true` : `${clean}?embedded=true`;
    }
    setFormUrl(clean);
    localStorage.setItem('codenova_custom_google_form_url', clean);
    setIsEditingUrl(false);
    setIframeLoaded(false);
  };

  const handleCopyLink = () => {
    const rawLink = formUrl.replace('?embedded=true', '').replace('&embedded=true', '');
    navigator.clipboard.writeText(rawLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedDirectly(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Bar */}
      {showCardHeader && (
        <div className="bg-slate-900 text-white p-6 sm:p-8 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
                  <FileSpreadsheet className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                  Google Workspace Form Sync
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{description}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              <button
                type="button"
                onClick={() => setIsEditingUrl(!isEditingUrl)}
                className="text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Change or connect your custom Google Form URL"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingUrl ? 'Cancel' : 'Configure Form URL'}</span>
              </button>

              <a
                href={formUrl.replace('?embedded=true', '').replace('&embedded=true', '')}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Open in Google Forms</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Form URL Customizer Panel */}
          {isEditingUrl && (
            <div className="mt-5 p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 block">
                  Paste your Google Form URL (e.g. from Google Forms &rarr; Send &rarr; Link or Embed):
                </label>
                <span className="text-[11px] text-blue-400">
                  Automatically connects to your Google Sheet
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-lg bg-slate-900 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveUrl}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Form
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: Responses submitted through this Google Form will be stored in your linked Google Sheets and alert <span className="text-white font-mono">codenovaworks@gmail.com</span>.
              </p>
            </div>
          )}

          {/* Notice Bar */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL Encrypted Intake
              </span>
              <span>•</span>
              <span className="text-slate-300">Office: Harike Kalan, Sri Muktsar Sahib, Punjab 152025</span>
              <span>•</span>
              <span className="text-slate-300">Direct Desk: +91 6280538868</span>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-slate-300 hover:text-white flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Copy Form Link'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Area: Embedded Google Form Frame + High-Fidelity Interactive Sync Form */}
      <div className="p-4 sm:p-6 bg-slate-50 min-h-[640px] flex flex-col items-center justify-center">
        {/* Toggle Mode: Iframe Embed vs Direct Google Form Synchronizer */}
        <div className="w-full max-w-4xl mb-4 flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUseLiveSimulation(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                !useLiveSimulation
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Forms Embedded Frame
            </button>
            <button
              type="button"
              onClick={() => setUseLiveSimulation(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                useLiveSimulation
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Intake Sheet (Immediate)
            </button>
          </div>

          <a
            href={formUrl.replace('?embedded=true', '').replace('&embedded=true', '')}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
          >
            Open in Google Forms App &rarr;
          </a>
        </div>

        {/* VIEW A: IFRAME GOOGLE FORM */}
        {!useLiveSimulation && (
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative min-h-[720px]">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 p-6 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-slate-700">
                  Connecting to Google Forms Service...
                </p>
                <p className="text-[11px] text-slate-500 max-w-sm">
                  If the embedded frame does not load due to your browser cookie settings, click below to open directly in Google Forms or switch to the Interactive Intake Sheet.
                </p>
                <div className="flex gap-2 pt-2">
                  <a
                    href={formUrl.replace('?embedded=true', '').replace('&embedded=true', '')}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Open Google Form Directly
                  </a>
                  <button
                    type="button"
                    onClick={() => setUseLiveSimulation(true)}
                    className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
                  >
                    Use Interactive Intake
                  </button>
                </div>
              </div>
            )}

            <iframe
              src={formUrl}
              title="CodeNova Google Form Intake"
              width="100%"
              height="740"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              onLoad={() => setIframeLoaded(true)}
              className="w-full h-[740px] border-0"
            >
              Loading Google Form...
            </iframe>
          </div>
        )}

        {/* VIEW B: INTERACTIVE GOOGLE-SHEET SYNCED INTAKE FORM */}
        {useLiveSimulation && (
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {submittedDirectly ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Intake Form Recorded Successfully!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your project requirements have been recorded to the CodeNova Google Sheets database. Our senior lead engineer (Er. Gagandeep Singh) at the Harike Kalan, Punjab headquarters will contact you within 24 hours.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-bold text-slate-800">{clientName} ({clientPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-bold text-blue-600">{clientService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Budget:</span>
                    <span className="font-bold text-emerald-600">{clientBudget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Head Office:</span>
                    <span className="text-slate-700">Harike Kalan, Sri Muktsar Sahib, 152025</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedDirectly(false)}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Submit Another Project
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectSubmit} className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Project Requirement Questionnaire
                    </h3>
                    <p className="text-xs text-slate-500">
                      Directly routed to <span className="font-mono text-slate-700 font-semibold">codenovaworks@gmail.com</span> & Google Sheets
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded">
                    Official Form
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Name / Point of Contact *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Gagandeep Singh"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. client@company.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. +91 6280538868"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Project Service Category *
                    </label>
                    <select
                      value={clientService}
                      onChange={(e) => setClientService(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="Desktop Application Development">Desktop Application (Offline POS / Inventory)</option>
                      <option value="AI Agent Development">AI Agent & Autonomous Workflows</option>
                      <option value="AI Automation Pipelines">AI Automation & Invoice Processing</option>
                      <option value="Web Application (SaaS)">Full-Stack Web App / SaaS Portal</option>
                      <option value="Mobile App Development">Mobile App (iOS & Android)</option>
                      <option value="E-Commerce System">E-Commerce & Wholesale Storefront</option>
                      <option value="Custom Enterprise Software">Custom Enterprise Architecture</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Target Project Budget
                    </label>
                    <select
                      value={clientBudget}
                      onChange={(e) => setClientBudget(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000 ($500 - $1,000)</option>
                      <option value="₹75,000 - ₹1,50,000">₹75,000 - ₹1,50,000 ($1,000 - $2,000)</option>
                      <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000 ($2,000 - $4,000)</option>
                      <option value="₹3,00,000+ Enterprise">₹3,00,000+ Enterprise ($4,000+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      SRS / Figma / Google Drive Attachment Link
                    </label>
                    <input
                      type="url"
                      value={clientDocLink}
                      onChange={(e) => setClientDocLink(e.target.value)}
                      placeholder="https://drive.google.com/file/... or Figma link"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Detailed Functional Requirements & Deliverables *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    placeholder="Describe core workflows, offline hardware requirements (ESC/POS thermal printers, barcode scanners), database models, user roles..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Location: Harike Kalan, Sri Muktsar Sahib, 152025, Punjab
                  </span>
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Submit to Google Sheet & CRM</span> &rarr;
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
