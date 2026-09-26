import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  MessageSquare,
  Shield,
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { trackEvent } from '../lib/analytics';
import { GoogleFormIntake } from '../components/forms/GoogleFormIntake';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'website-form' | 'google-form'>('website-form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('United States');
  const [service, setService] = useState('desktop-application-development');
  const [budget, setBudget] = useState('$15,000 - $30,000');
  const [timeline, setTimeline] = useState('1 - 2 Months');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected
    setErrorMessage('');
    setIsLoading(true);
    trackEvent('lead_submit', { service, source: 'contact_page' });

    try {
      const res = await apiClient.submitLead({
        name,
        email,
        phone,
        company,
        country,
        service,
        budget,
        timeline,
        message,
        source: 'Contact Form',
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.message || 'Unable to submit inquiry. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* Header */}
      <section className="pt-12 md:pt-16 pb-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              Direct Engineering Engagement
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Let's Discuss Your Project
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Send us your technical specifications, request a quote, or schedule an architecture workshop. We respond to all qualified inquiries within 24 business hours.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form and Direct Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Direct Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Direct Inquiries</h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Email Us</p>
                    <a
                      href="mailto:codenovaworks@gmail.com"
                      className="text-slate-900 font-semibold hover:text-blue-600 transition-colors"
                    >
                      codenovaworks@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Call Our Office</p>
                    <a
                      href="tel:+916280538868"
                      className="text-slate-900 font-semibold hover:text-blue-600 transition-colors"
                    >
                      +91 6280538868
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Working Hours</p>
                    <p className="text-slate-900 font-medium">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">Registered Location</p>
                    <p className="text-slate-900 font-medium">Harike Kalan, Sri Muktsar Sahib, 152025, Punjab, India</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Location Preview */}
              <div className="pt-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[16/9] w-full bg-slate-100 relative">
                  <iframe
                    title="CodeNova Punjab Location Map"
                    src="https://maps.google.com/maps?q=Harike+Kalan+Sri+Muktsar+Sahib+Punjab+152025&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                  <span>Harike Kalan, PIN: 152025</span>
                  <a
                    href="https://maps.google.com/?q=Harike+Kalan+Sri+Muktsar+Sahib+Punjab+152025"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Open in Google Maps &rarr;
                  </a>
                </p>
              </div>

              {/* WhatsApp Quick Action */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/916280538868?text=${encodeURIComponent(
                    'Hello CodeNova! I would like to discuss a project inquiry for my company.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { source: 'contact_page' })}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors no-underline cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  Chat on WhatsApp Now
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>NDA & Confidentiality Guarantee</span>
              </div>
              <p>
                We sign mutual non-disclosure agreements before reviewing proprietary business rules or proprietary data schemas.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Selector: Direct Form vs Google Form */}
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('website-form')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'website-form'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Direct Website Inquiry</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('google-form')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'google-form'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Official Google Form (Upload Docs / RFP)</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded uppercase">
                  Google Sheet
                </span>
              </button>
            </div>

            {activeTab === 'google-form' ? (
              <GoogleFormIntake
                title="CodeNova Client Requirement Google Form"
                description="Use this Google Form to submit SRS documentation, drive links, or RFP specifications directly to our engineering spreadsheet."
                showCardHeader={true}
              />
            ) : isSuccess ? (
              <div className="p-8 sm:p-12 rounded-2xl border border-emerald-200 bg-emerald-50/30 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Thank You! Your Inquiry Has Been Received.
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  A senior engineering lead has been notified and will review your project requirements. Expect a detailed response within 24 business hours.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setActiveTab('google-form')}
                  >
                    Open Google Form Instead
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setIsSuccess(false);
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-10 rounded-2xl border border-slate-200 bg-white space-y-6 shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">
                    Project Inquiry Form
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('google-form')}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Prefer Google Forms? Click here &rarr;
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Apex Logistics"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Service *
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="desktop-application-development">
                        Desktop Application (Windows/macOS)
                      </option>
                      <option value="web-applications">Web Application / SaaS</option>
                      <option value="ai-agents">AI Agent Development</option>
                      <option value="ai-automation">AI Business Automation</option>
                      <option value="mobile-app-development">Mobile App (iOS/Android)</option>
                      <option value="ecommerce-development">E-Commerce System</option>
                      <option value="custom-software">Custom Enterprise Software</option>
                      <option value="ui-ux-design">UI/UX Design & Prototyping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Target Budget Range
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="< $10,000">&lt; $10,000 (MVP / Small Scope)</option>
                      <option value="$10,000 - $25,000">$10,000 - $25,000 (Standard)</option>
                      <option value="$25,000 - $50,000">$25,000 - $50,000 (Robust)</option>
                      <option value="$50,000 - $100,000+">$50,000 - $100,000+ (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Target Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="Immediate (1-4 Weeks)">Immediate (1 - 4 Weeks)</option>
                      <option value="1 - 2 Months">1 - 2 Months</option>
                      <option value="2 - 4 Months">2 - 4 Months</option>
                      <option value="Flexible">Flexible Roadmap</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Project Description & Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your system requirements, target users, hardware integrations, or operational goals..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full sm:w-auto px-8"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Submit Project Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
