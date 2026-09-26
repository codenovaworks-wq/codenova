import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/Button';
import { useCurrency } from '../../context/CurrencyContext';
import {
  UserCheck,
  LogIn,
  Layers,
  CheckCircle2,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  Code2,
  MessageSquare,
  ShieldCheck,
  Rocket,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  Upload,
  Send,
  ExternalLink,
  Check,
  Bot,
  Zap,
  Lock,
  ArrowRight,
  Globe,
  Smartphone,
  Server,
  ShoppingCart,
  Workflow,
  Sparkles,
  Search,
  Bell,
  CheckCheck,
} from 'lucide-react';

interface HowCodeNovaWorksProps {
  onNavigate: (path: string) => void;
}

interface StepData {
  id: number;
  label: string;
  shortTitle: string;
  badge: string;
  heading: string;
  description: string;
}

export const HowCodeNovaWorks: React.FC<HowCodeNovaWorksProps> = ({ onNavigate }) => {
  const { currency, formatPrice } = useCurrency();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  const totalSteps = 12;
  const stepDuration = 4500; // 4.5 seconds per step

  const stepsMeta: StepData[] = [
    {
      id: 1,
      label: 'Step 1',
      shortTitle: 'Register',
      badge: 'Account Setup',
      heading: 'Create Your CodeNova Account',
      description:
        'Instant registration into the client portal. Set up your company profile, business details, and secure credentials in seconds.',
    },
    {
      id: 2,
      label: 'Step 2',
      shortTitle: 'Login',
      badge: 'Authentication',
      heading: 'Login to Client Portal',
      description:
        'Access your centralized client dashboard to manage active projects, pending quotes, milestones, and billing.',
    },
    {
      id: 3,
      label: 'Step 3',
      shortTitle: 'Services',
      badge: 'Service Directory',
      heading: 'Explore Engineering Services',
      description:
        'Browse our full suite of premium development offerings from high-concurrency SaaS to autonomous AI workflows.',
    },
    {
      id: 4,
      label: 'Step 4',
      shortTitle: 'Packages',
      badge: 'Configuration',
      heading: 'Select a Service & Package',
      description:
        'Review transparent deliverables, architectural inclusions, and domestic/international pricing tiers.',
    },
    {
      id: 5,
      label: 'Step 5',
      shortTitle: 'Booking',
      badge: 'Project Intake',
      heading: 'Book Your Service',
      description:
        'Provide your project goals, attach architecture diagrams or PRD documents, and specify target launch dates.',
    },
    {
      id: 6,
      label: 'Step 6',
      shortTitle: 'Review',
      badge: 'Engineering Review',
      heading: 'CodeNova Reviews the Project',
      description:
        'Our lead architects audit your technical requirements, API dependencies, and prepare a deterministic milestone proposal.',
    },
    {
      id: 7,
      label: 'Step 7',
      shortTitle: 'Proposal',
      badge: 'Escrow & Milestone',
      heading: 'Proposal & Payment Agreement',
      description:
        'Review exact milestone breakdown and sign off. Payment schedule is structured transparently per your agreement.',
    },
    {
      id: 8,
      label: 'Step 8',
      shortTitle: 'Development',
      badge: 'Live Sprints',
      heading: 'Active Project Development',
      description:
        'Track live sprint progress, review completed components, inspect staging previews, and observe test coverage.',
    },
    {
      id: 9,
      label: 'Step 9',
      shortTitle: 'Communication',
      badge: 'Direct Access',
      heading: 'Direct Client Communication',
      description:
        'Message lead engineers directly in your portal. Receive continuous build demos, notifications, and file exchanges.',
    },
    {
      id: 10,
      label: 'Step 10',
      shortTitle: 'QA & Review',
      badge: 'Verification',
      heading: 'Testing & Client Approval',
      description:
        'End-to-end regression, security hardening, and performance audits verified before final sign-off.',
    },
    {
      id: 11,
      label: 'Step 11',
      shortTitle: 'Launch',
      badge: 'Production Cutover',
      heading: 'Zero-Downtime Deployment',
      description:
        'Production infrastructure provisioning, domain & SSL binding, database cutover, and full source code handover.',
    },
    {
      id: 12,
      label: 'Step 12',
      shortTitle: 'Support',
      badge: 'SLA Continuity',
      heading: 'Post-Launch Engineering Support',
      description:
        'Continuous uptime telemetry, monthly security patching, daily automated backups, and on-demand roadmap expansion.',
    },
  ];

  // Respect prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Viewport observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Timer progression
  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => (prev >= totalSteps ? 1 : prev + 1));
  }, [totalSteps]);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => (prev <= 1 ? totalSteps : prev - 1));
  }, [totalSteps]);

  const restartWalkthrough = useCallback(() => {
    setCurrentStep(1);
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (!isPlaying || !isInViewport || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      goToNextStep();
    }, stepDuration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isInViewport, prefersReducedMotion, goToNextStep]);

  const currentStepData = stepsMeta[currentStep - 1];

  return (
    <section
      ref={containerRef}
      id="how-codenova-works"
      className="py-16 md:py-24 bg-gradient-to-b from-slate-900 via-[#0B132B] to-[#0A0F1D] text-white relative overflow-hidden border-y border-slate-800"
    >
      {/* Subtle background ambient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0B132B 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* ============================================================= */}
        {/* SECTION HEADER */}
        {/* ============================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Client Portal Walkthrough</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            HOW CODENOVA WORKS
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            "From choosing a service to tracking your project — everything in one client portal."
          </p>

          {/* Quick Real Portal Links */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs"
              onClick={() => onNavigate('/client')}
            >
              <LogIn className="w-3.5 h-3.5 mr-1" />
              <span>Login to Client Portal</span>
            </Button>
            <Button
              variant="darkOutline"
              size="sm"
              className="border-blue-500/40 text-blue-400 hover:bg-blue-950/60 text-xs"
              onClick={() => onNavigate('/client')}
            >
              <UserCheck className="w-3.5 h-3.5 mr-1" />
              <span>Register as Client</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white text-xs"
              onClick={() => onNavigate('/services')}
            >
              <span>Browse Services</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* INTERACTIVE WORKFLOW STAGE (THE MOCK CLIENT PORTAL) */}
        {/* ============================================================= */}
        <div className="bg-slate-950/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Simulated Browser / OS App Top Window Bar */}
          <div className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="hidden sm:inline-block text-xs font-mono text-slate-400 ml-2">
                CodeNova Client Workspace
              </span>
            </div>

            {/* URL Pill */}
            <div className="flex-1 max-w-md mx-auto hidden md:flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>portal.codenova.work/client/{currentStepData.shortTitle.toLowerCase()}</span>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo
              </span>
            </div>
          </div>

          {/* Portal Body: Left Sidebar + Main Simulated Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
            {/* Left Nav Overview (Steps List / Breadcrumb) */}
            <div className="lg:col-span-4 bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-5 sm:p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {currentStepData.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {currentStepData.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-1.5 transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Pills Quick Navigation */}
              <div className="pt-6 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Workflow Phase:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
                  {stepsMeta.map((s) => {
                    const isSelected = currentStep === s.id;
                    const isPassed = currentStep > s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setCurrentStep(s.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : isPassed
                            ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="truncate">
                          {s.id}. {s.shortTitle}
                        </span>
                        {isPassed && <Check className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Screen: Animated Interactive Portal Canvas */}
            <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center bg-slate-950/60 relative">
              {/* Step 1: Create Account */}
              {currentStep === 1 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Create Your CodeNova Account</h4>
                      <p className="text-xs text-slate-400">Join the client workspace</p>
                    </div>
                    <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <UserCheck className="w-5 h-5" />
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        disabled
                        value="Vikram Sharma"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Business Name</label>
                        <input
                          type="text"
                          disabled
                          value="NovaFlow Health Corp"
                          className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Phone Number</label>
                        <input
                          type="text"
                          disabled
                          value="+91 98765 43210"
                          className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Work Email</label>
                      <input
                        type="text"
                        disabled
                        value="vikram@novaflow.in"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Password</label>
                      <input
                        type="password"
                        disabled
                        value="••••••••••••"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Create Account</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Account Created — Your CodeNova client account is ready.
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Already have an account?{' '}
                      <span className="text-blue-400 underline font-semibold">Login</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Login to Client Portal */}
              {currentStep === 2 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">CodeNova Client Portal</h4>
                      <p className="text-xs text-slate-400">Authenticate session</p>
                    </div>
                    <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <LogIn className="w-5 h-5" />
                    </span>
                  </div>

                  {/* Dashboard Preview Cards */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                          VS
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">Welcome back, Client!</p>
                          <p className="text-[11px] text-slate-400">NovaFlow Health Corp · Verified</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                        Active Session
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-lg font-bold text-blue-400 font-mono">01</span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                          Active Projects
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-lg font-bold text-amber-400 font-mono">00</span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                          Pending Requests
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-lg font-bold text-emerald-400 font-mono">01</span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                          Invoices
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <span className="text-lg font-bold text-purple-400 font-mono">02</span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                          Messages
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-3">
                    <span>Quick Actions: View Roadmap · Download SLA · Book Discovery</span>
                    <button
                      onClick={() => onNavigate('/client')}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Enter Portal &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Explore Services */}
              {currentStep === 3 && (
                <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">CodeNova Services Catalog</h4>
                      <p className="text-xs text-slate-400">Select domain to view architectures</p>
                    </div>
                    <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
                      8 Categories
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {[
                      { name: 'Website Development', icon: Globe },
                      { name: 'Web Applications', icon: Server },
                      { name: 'Mobile Apps', icon: Smartphone },
                      { name: 'AI Agents & Automation', icon: Bot, active: true },
                      { name: 'E-commerce', icon: ShoppingCart },
                      { name: 'Custom Software', icon: Code2 },
                      { name: 'SaaS Development', icon: Layers },
                      { name: 'API Integrations', icon: Workflow },
                    ].map((c) => {
                      const Icon = c.icon;
                      return (
                        <div
                          key={c.name}
                          className={`p-3 rounded-xl border flex flex-col justify-between gap-2 transition-all ${
                            c.active
                              ? 'bg-blue-600 text-white border-blue-500 shadow-lg ring-2 ring-blue-400/30'
                              : 'bg-slate-950 text-slate-300 border-slate-800 opacity-70'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${c.active ? 'text-white' : 'text-blue-400'}`} />
                          <span className="font-semibold text-[11px] leading-tight">{c.name}</span>
                          {c.active && (
                            <span className="text-[9px] uppercase tracking-wider bg-blue-700 px-1.5 py-0.5 rounded text-white self-start">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between text-xs">
                    <span className="text-blue-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      Client selected: <strong>AI Agents & Automation</strong>
                    </span>
                    <span className="text-emerald-400 font-semibold font-mono">
                      5 Packages Available &rarr;
                    </span>
                  </div>
                </div>
              )}

              {/* Step 4: Select a Service & Package */}
              {currentStep === 4 && (
                <div className="w-full max-w-lg bg-slate-900 border-2 border-blue-500 rounded-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200 shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        Selected Package
                      </span>
                      <h4 className="text-xl font-bold text-white mt-1">AI Business Agent</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Starting from
                      </span>
                      <span className="text-xl font-extrabold text-white font-mono">
                        {currency === 'INR' ? '₹1,00,000+' : '$1,999+'}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {currency === 'INR' ? 'International: $1,999+' : 'Domestic: ₹1,00,000+'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Standard Package Features:
                    </p>
                    {[
                      'AI Agent with reasoning engine & function calling',
                      'Business Workflow Automation & schedule triggers',
                      'Third-party CRM, database & email API integrations',
                      'Dedicated admin dashboard & execution logs',
                      'Cloud serverless deployment & production handover',
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      disabled
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                    >
                      <Check className="w-4 h-4" />
                      <span>[ Select Package ] — Package Confirmed ✓</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Book Your Service */}
              {currentStep === 5 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Book Your Project</h4>
                      <p className="text-xs text-slate-400">Submit project requirements</p>
                    </div>
                    <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <FileText className="w-5 h-5" />
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Selected Service</span>
                      <span className="font-semibold text-white">AI Business Agent</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Selected Package</span>
                      <span className="font-semibold text-white">Business AI Agent</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Project Timeline</span>
                      <span className="font-semibold text-white">Custom (Sprint-Based)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Budget Investment</span>
                      <span className="font-semibold text-white">Custom Quote</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-slate-400 block">Project Description</label>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 italic">
                      "I want an AI agent for my customer support with WhatsApp and CRM integration."
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 truncate">
                          <Upload className="w-3.5 h-3.5 text-blue-400" />
                          specs_v1.pdf
                        </span>
                        <span className="text-[10px] text-emerald-400">Uploaded</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          Immediate
                        </span>
                        <span className="text-[10px] text-slate-500">Kickoff</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>✓ Booking Submitted — "Your project request has been sent to CodeNova."</span>
                  </div>
                </div>
              )}

              {/* Step 6: Code Nova Reviews the Project */}
              {currentStep === 6 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Project Request Status</h4>
                      <p className="text-xs text-slate-400">CodeNova Engineering Dispatch</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold animate-pulse">
                      UNDER REVIEW
                    </span>
                  </div>

                  {/* Admin audit review process animation */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Requirements Reviewed
                      </span>
                      <span className="text-emerald-400">PASS ✓</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-400" />
                        API & Database Architecture
                      </span>
                      <span className="text-blue-400">Mapped ✓</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-blue-900/40 flex items-center justify-between">
                      <span className="text-slate-300 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
                        Proposal Being Prepared...
                      </span>
                      <span className="text-cyan-400 font-bold">Proposal Ready ✓</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 flex items-center justify-between">
                    <span>Lead Engineer assigned: Er. Gagandeep Singh</span>
                    <span className="text-emerald-400 font-mono">Verified SLA</span>
                  </div>
                </div>
              )}

              {/* Step 7: Proposal & Payment */}
              {currentStep === 7 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Project Proposal</h4>
                      <p className="text-xs text-slate-400">Service: AI Business Agent</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">
                        {currency === 'INR' ? '₹1,50,000+' : '$2,999+'}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">6 – 8 Weeks</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Agreed Deliverables:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        AI Agent Logic
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Custom Dashboard
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        API Integration
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Automated Testing
                      </span>
                      <span className="flex items-center gap-1.5 col-span-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Cloud Deployment & Source Code Handover
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      disabled
                      className="bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Proposal</span>
                    </button>
                    <button
                      disabled
                      className="bg-slate-800 text-slate-300 font-medium py-2 rounded-xl text-xs border border-slate-700"
                    >
                      <span>Request Changes</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Payment Status</span>
                      <span className="text-emerald-400 font-bold">✓ Payment Confirmed</span>
                    </div>
                    <span className="text-[11px] text-slate-400 italic text-right max-w-[210px] leading-tight">
                      Payment schedule depends on the project agreement.
                    </span>
                  </div>
                </div>
              )}

              {/* Step 8: Project Development */}
              {currentStep === 8 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Project: AI Business Agent</h4>
                      <p className="text-xs text-slate-400">Timeline: Week 4 of 7</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      IN DEVELOPMENT
                    </span>
                  </div>

                  {/* Progress Ring / Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Overall Completion</span>
                      <span className="text-blue-400 font-bold">68% Finished</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 w-[68%]" />
                    </div>
                  </div>

                  {/* Milestone checklist */}
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        UI/UX Design & Architecture
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">Completed ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Backend & Relational Database
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">Completed ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        AI Agent Function Calling Logic
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">Completed ✓</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-blue-900/60">
                      <span className="flex items-center gap-2 text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        Admin Dashboard & Analytics
                      </span>
                      <span className="text-blue-400 font-mono text-[11px]">70% in progress</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-900 text-slate-500">
                      <span>Testing & Hardening</span>
                      <span className="font-mono text-[11px]">Pending</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 9: Client Communication */}
              {currentStep === 9 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Project Messages & Files</h4>
                      <p className="text-xs text-slate-400">Direct engineering thread</p>
                    </div>
                    {/* Tabs / Chips */}
                    <div className="flex gap-1 text-[10px] font-semibold">
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded">Chat</span>
                      <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Files</span>
                      <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Docs</span>
                    </div>
                  </div>

                  {/* Chat Bubbles */}
                  <div className="space-y-3 text-xs">
                    {/* Client Bubble */}
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 mb-1">Client (You)</span>
                      <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow-sm">
                        "Can we add WhatsApp integration to the AI support pipeline?"
                      </div>
                    </div>

                    {/* CodeNova Bubble */}
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-slate-400 mb-1">
                        CodeNova Lead Architect · 2m ago
                      </span>
                      <div className="bg-slate-800 border border-slate-700 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm">
                        "Yes. We've added it to the project scope for review with webhook architecture."
                      </div>
                    </div>
                  </div>

                  {/* Input Mock */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      disabled
                      placeholder="Type your message to the engineering pod..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
                    />
                    <button
                      disabled
                      className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2.5">
                    <span>Updates · Notifications · Direct Staging Previews</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> Delivered
                    </span>
                  </div>
                </div>
              )}

              {/* Step 10: Testing & Approval */}
              {currentStep === 10 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Project Status</h4>
                      <p className="text-xs text-slate-400">Comprehensive verification</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                      QUALITY ASSURANCE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {[
                      'Functional Testing',
                      'Responsive Testing',
                      'API Regression Testing',
                      'Security & Vulnerability Checks',
                      'High-Load Performance Testing',
                    ].map((test, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-200 ${
                          idx === 4 ? 'sm:col-span-2' : ''
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Ready for Client Review</p>
                      <p className="text-[11px] text-slate-400">Staging sandbox URL active</p>
                    </div>
                    <button
                      disabled
                      className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>[ Review Project ]</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Client Approval ✓</span>
                  </div>
                </div>
              )}

              {/* Step 11: Launch */}
              {currentStep === 11 && (
                <div className="w-full max-w-lg bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">DEPLOYMENT</h4>
                      <p className="text-xs text-slate-400">Production Infrastructure Handover</p>
                    </div>
                    <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Rocket className="w-5 h-5 animate-bounce" />
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Frontend ✓
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Backend ✓
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Database ✓
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Custom Domain ✓
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5 col-span-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      SSL & Edge CDN ✓
                    </div>
                  </div>

                  {/* Live Launch Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border border-emerald-500/50 text-center space-y-1">
                    <p className="text-xl font-extrabold text-white tracking-wider flex items-center justify-center gap-2">
                      <span>🚀</span>
                      <span>PROJECT LIVE</span>
                    </p>
                    <p className="text-xs text-emerald-300">
                      Production application active at your corporate domain
                    </p>
                  </div>
                </div>
              )}

              {/* Step 12: Post-Launch Support */}
              {currentStep === 12 && (
                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Client Portal Post-Launch</h4>
                      <p className="text-xs text-slate-400">Continuous SLA & telemetry</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        COMPLETED ✓
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Support Agreement
                      </span>
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVE SLA
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      24/7 Monitoring
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <LifeBuoy className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <span className="font-semibold text-white text-[11px] block">Maintenance</span>
                      <span className="text-[10px] text-slate-400">Regular</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <Code2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <span className="font-semibold text-white text-[11px] block">Updates</span>
                      <span className="text-[10px] text-slate-400">Continuous</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <span className="font-semibold text-white text-[11px] block">Bug Fixes</span>
                      <span className="text-[10px] text-slate-400">Priority</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <Sparkles className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <span className="font-semibold text-white text-[11px] block">New Features</span>
                      <span className="text-[10px] text-slate-400">On-demand</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      disabled
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30"
                    >
                      <LifeBuoy className="w-4 h-4" />
                      <span>[ Request Support ] — Submit Engineering Ticket</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* ANIMATION CONTROLS (PREVIOUS, NEXT, REPLAY, PLAY/PAUSE, DOTS) */}
          {/* ============================================================= */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title={isPlaying ? 'Pause Animation' : 'Play Animation'}
                aria-label={isPlaying ? 'Pause Animation' : 'Play Animation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                type="button"
                onClick={restartWalkthrough}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                title="Replay from Step 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replay</span>
              </button>
            </div>

            {/* Step Indicators (12 Clickable Dots / Pills) */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0"
              role="tablist"
              aria-label="Walkthrough Steps"
            >
              {stepsMeta.map((s) => {
                const isActive = currentStep === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(s.id)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      isActive
                        ? 'w-7 bg-blue-500 shadow-xs'
                        : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Step ${s.id}: ${s.shortTitle}`}
                    aria-label={`Jump to Step ${s.id}: ${s.shortTitle}`}
                  />
                );
              })}
            </div>

            {/* Previous / Next Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs px-3"
                onClick={goToPrevStep}
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                <span>Previous</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="text-xs px-3 font-semibold"
                onClick={goToNextStep}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* ============================================================= */}
        {/* FINAL CTA AT BOTTOM */}
        {/* ============================================================= */}
        <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to Start Your Project?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Create your CodeNova account, choose a service and manage your project from one place.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto px-6 font-bold"
              onClick={() => onNavigate('/client')}
            >
              <UserCheck className="w-4 h-4 mr-1.5" />
              <span>Create Client Account</span>
            </Button>
            <Button
              variant="darkOutline"
              size="md"
              className="w-full sm:w-auto px-6 border-slate-700 text-white hover:bg-slate-800"
              onClick={() => onNavigate('/client')}
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              <span>Login</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
