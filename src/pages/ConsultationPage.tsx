import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Shield,
  ArrowRight,
  User,
  Mail,
  Building,
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { trackEvent } from '../lib/analytics';

interface ConsultationPageProps {
  onNavigate: (path: string) => void;
}

export const ConsultationPage: React.FC<ConsultationPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('Desktop Application Development');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('14:00 EST');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const timeSlots = [
    '10:00 AM EST',
    '11:30 AM EST',
    '02:00 PM EST',
    '03:30 PM EST',
    '05:00 PM EST',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    trackEvent('consultation_request', { service: projectType });

    try {
      const res = await apiClient.bookConsultation({
        name,
        email,
        company,
        project_type: projectType,
        preferred_date: preferredDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        preferred_time: preferredTime,
        message,
      });

      if (res.success) {
        setIsSuccess(true);
        setMeetingUrl(res.meeting_url || 'https://meet.google.com/codenova-discovery');
      } else {
        setErrorMsg('Unable to book consultation. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while booking. Please try again.');
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
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Complimentary Technical Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Book a 30-Minute Architecture Discovery Call
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Speak directly with our senior software engineers. We will review your technical requirements, suggest suitable architectures, and outline a realistic milestone roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* Main Booking Form / Confirmation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: What to Expect */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">What Happens On This Call</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Review your business model, operational rules, and users.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Evaluate tech stack choices (Desktop vs. Web vs. Mobile).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Discuss offline continuity, data security, and hardware needs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Receive a written ballpark estimate and milestone plan.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Non-Disclosure & Privacy</span>
              </div>
              <p>
                All shared business specifications, diagrams, and ideas are treated as strictly confidential under CodeNova's standard mutual NDA.
              </p>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="p-8 sm:p-10 rounded-2xl border border-emerald-200 bg-emerald-50/30 text-center space-y-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Consultation Confirmed!
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    A calendar invitation has been generated for <strong>{name}</strong> on <strong>{preferredDate}</strong> at <strong>{preferredTime}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 text-left space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>Google Meet Video Link:</span>
                  </div>
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-mono text-blue-600 underline break-all block"
                  >
                    {meetingUrl}
                  </a>

                  {/* Google Calendar Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <a
                      href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                        'CodeNova Technical Architecture Consultation'
                      )}&dates=${preferredDate.replace(/-/g, '')}T110000Z/${preferredDate.replace(
                        /-/g,
                        ''
                      )}T114500Z&details=${encodeURIComponent(
                        `CodeNova 30-45 Minute Architecture Consultation\nGoogle Meet: ${meetingUrl}\nLead Office: Harike Kalan, Sri Muktsar Sahib, Punjab 152025\nPhone: +91 6280538868\nEmail: codenovaworks@gmail.com`
                      )}&location=${encodeURIComponent(meetingUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                    >
                      <Calendar className="w-4 h-4" /> Add to Google Calendar
                    </a>

                    <a
                      href={`/api/calendar/ics?date=${preferredDate}&time=${encodeURIComponent(preferredTime)}`}
                      download="codenova-consultation.ics"
                      className="flex-1 py-2.5 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                    >
                      Download .ics Invite
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">CodeNova Engineering Office:</p>
                  <p>Harike Kalan, Sri Muktsar Sahib, 152025, Punjab, India</p>
                  <p>Phone: +91 6280538868 | Email: codenovaworks@gmail.com</p>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('/client')}
                  >
                    Client Portal Workspace
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('/')}
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white space-y-5 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  Select Date & Project Details
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Work Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Global"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Service *
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="Desktop Application Development">
                        Desktop Application Development (Windows/macOS)
                      </option>
                      <option value="Web Application Development">Web Application / SaaS</option>
                      <option value="AI Agent Development">Autonomous AI Agent</option>
                      <option value="AI Automation Systems">AI Automation & Data Extraction</option>
                      <option value="Mobile App Development">Mobile App (iOS/Android)</option>
                      <option value="Custom Software Development">Custom Enterprise System</option>
                      <option value="E-Commerce Development">E-Commerce Storefront</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>
                          {ts}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Project Overview or Core Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us briefly about what you want to build or what problem you're trying to solve..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Confirm Discovery Call Booking
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
