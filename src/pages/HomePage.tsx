import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  Monitor,
  Cpu,
  Bot,
  Layers,
  Smartphone,
  Globe,
  ShoppingBag,
  Code2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Zap,
  Lock,
  Workflow,
  Server,
  Award,
  Check,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { HowCodeNovaWorks } from '../components/home/HowCodeNovaWorks';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCta = (path: string, label: string) => {
    trackEvent('primary_cta_click', { label });
    onNavigate(path);
  };

  const services = [
    {
      title: 'Desktop Application Development',
      slug: 'desktop-application-development',
      icon: Monitor,
      desc: 'Offline-capable, high-speed desktop software for Windows, macOS and Linux. Ideal for POS terminals, billing, warehouse barcode scanning, and institutional ERPs with hardware peripheral integration.',
      tag: 'Offline-First & Hardware Integration',
      featured: true,
    },
    {
      title: 'AI Agent & LLM Development',
      slug: 'ai-agents',
      icon: Bot,
      desc: 'Autonomous AI agents grounded strictly in your verified company data with deterministic guardrails and function calling. Automate support, operations, and document analysis.',
      tag: 'Grounded RAG Workflows',
    },
    {
      title: 'AI Business Automation',
      slug: 'ai-automation',
      icon: Cpu,
      desc: 'Eliminate repetitive back-office overhead. Automated invoice extraction, intelligent lead triage, CRM synchronization, and multi-system data reconciliation.',
      tag: 'Zero-Manual Overhead',
    },
    {
      title: 'Web Application Development',
      slug: 'web-applications',
      icon: Layers,
      desc: 'Scalable SaaS platforms, customer portals, and internal enterprise dashboards engineered for high concurrency, security, and responsive performance.',
      tag: 'Scalable Multi-Tenant SaaS',
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      icon: Smartphone,
      desc: 'Native iOS and Android mobile applications engineered for smooth gestures, offline caching, push notifications, and App Store submission management.',
      tag: 'iOS & Android Native Experience',
    },
    {
      title: 'Custom Software & ERP Systems',
      slug: 'custom-software',
      icon: Code2,
      desc: 'Purpose-built software systems designed around your unique organizational workflows, operational rules, and proprietary competitive advantages.',
      tag: 'Bespoke Business Logic',
    },
  ];

  const faqs = [
    {
      q: 'Why should a business choose a Desktop Application over a Web App?',
      a: 'Desktop applications are the gold standard for high-throughput operations requiring offline continuity (e.g. retail checkout counters, warehouse workstations, and clinical billing), direct connection to hardware peripherals (ESC/POS thermal printers, barcode scanners, weighing scales), and zero-latency local database storage. They run uninterrupted even during major internet outages.',
    },
    {
      q: 'How does CodeNova prevent AI hallucination in custom business agents?',
      a: 'We strictly employ Retrieval-Augmented Generation (RAG) coupled with deterministic validation layers. The AI agent retrieves facts exclusively from your indexed organizational handbooks and authenticated databases. Sensitive actions (such as issuing refunds or changing user roles) enforce explicit human-in-the-loop approvals.',
    },
    {
      q: 'Who owns the intellectual property and source code upon completion?',
      a: 'You do. Upon project completion and milestone payment, 100% of the custom source code, design assets, architecture documentation, and deployment configurations belong to your company.',
    },
    {
      q: 'What is your typical project timeline from kickoff to launch?',
      a: 'Focused MVPs and AI automation pipelines typically launch in 4 to 8 weeks. Comprehensive custom software systems, multi-platform applications, and desktop ERPs range from 2 to 4 months. We deliver weekly milestone builds and live staging previews.',
    },
    {
      q: 'Do you provide maintenance and infrastructure support after launch?',
      a: 'Yes. We offer SLA-backed ongoing support plans covering 24/7 uptime monitoring, critical security patching, automated daily backups, and continuous feature expansion.',
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* ----------------- Hero Section ----------------- */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24 bg-gradient-to-b from-slate-50 via-white to-white">
        {/* Subtle engineering background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Editorial Category Tag (Strictly not a pill) */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Modern Software & Autonomous AI Solutions</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#0B132B] leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              We Build Digital Products That Move Businesses Forward.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              CodeNova engineers high-performance web platforms, mission-critical desktop applications, native mobile apps, and autonomous AI agents designed to solve complex business problems and scale operations.
            </p>

            {/* Primary Hero Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => handleCta('/services', 'hero_services')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Explore Engineering Services
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleCta('/client', 'hero_client_portal')}
                className="w-full sm:w-auto"
              >
                Client Portal & Dashboard
              </Button>
            </div>

            {/* Quick Proof Points */}
            <div className="mt-10 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>100% IP & Source Code Ownership</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Offline-First Desktop & Mobile Architectures</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Grounded AI With Zero Hallucination</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Transparent Milestone Sprints</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CodeNova Engineering Standards ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 text-white shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="pt-4 sm:pt-0 sm:px-6 first:px-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono tracking-tight">
                100% IP
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-300 mt-2 font-semibold">
                Source Code Ownership
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Full Git repos, Dockerfiles, and database schemas transferred upon milestone sign-off.
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                0ms Latency
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-300 mt-2 font-semibold">
                Offline-First Capability
              </p>
              <p className="text-xs text-slate-400 mt-1">
                High-speed local SQLite persistence for uninterrupted POS, billing, and desktop systems.
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">
                2 – 8 Weeks
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-300 mt-2 font-semibold">
                Predictable Sprints
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Structured milestones with weekly staging deployments and automated regression tests.
              </p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                Direct Lead
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-300 mt-2 font-semibold">
                Senior Engineer Access
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Direct collaboration with Er. Gagandeep Singh — no opaque junior outsourcing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Core Services ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="01. Core Capabilities"
          title="Full-Stack Engineering & AI Systems Built for Business Impact"
          description="We do not build toy prototypes. Every service is engineered for enterprise reliability, high performance, and long-term operational resilience."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.slug}
                onClick={() => onNavigate(`/services/${srv.slug}`)}
                className={`group relative p-8 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  srv.featured
                    ? 'border-blue-300 bg-gradient-to-b from-blue-50/40 via-white to-white shadow-md hover:shadow-lg'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3 rounded-xl ${
                        srv.featured
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-800 group-hover:bg-blue-50 group-hover:text-blue-600'
                      } transition-colors`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Architecture & Details</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('/services')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View All 10 Engineering Services & Platform Matrix
          </Button>
        </div>
      </section>

      {/* ----------------- Desktop Application Spotlight ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <Monitor className="w-4 h-4" />
                <span>Featured Specialty</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                Desktop Application Development for Mission-Critical Operations
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                When internet drops or browser tabs crash, your cashiers, inventory managers, and clinics cannot afford downtime. CodeNova builds native desktop software engineered for offline continuity, local SQLite databases, and direct hardware integration.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-500/20 text-blue-400 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Offline Immunity</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Operates smoothly without active internet. Queues and syncs safely on reconnect.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-500/20 text-blue-400 mt-0.5">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Hardware Peripherals</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Direct driver integration with thermal printers, barcode scanners, and scales.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-500/20 text-blue-400 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">OS-Level Security</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Cryptographically signed binaries (.exe, .dmg, .deb) and credential vaults.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-blue-500/20 text-blue-400 mt-0.5">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Automated Updates</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Background patch delivery across client workstations without technician visits.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('/services/desktop-application-development')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Desktop Services
                </Button>
                <Button
                  variant="darkOutline"
                  size="md"
                  className="border-slate-700 hover:bg-slate-800 text-white"
                  onClick={() => onNavigate('/contact')}
                >
                  Discuss Custom Workstation Tool
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-cyan-400">DESKTOP WORKSTATION SPEC</span>
                  <span className="text-xs text-emerald-400 font-mono">● 0ms LATENCY</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Operating Systems:</span>
                    <span className="text-slate-200">Win 10/11 · macOS · Linux</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Runtimes:</span>
                    <span className="text-slate-200">Tauri · Rust · Electron · .NET</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Local Database:</span>
                    <span className="text-slate-200">Embedded SQLite (Encrypted)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Peripheral Protocols:</span>
                    <span className="text-slate-200">ESC/POS · Serial · USB HID</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-900">
                    <span className="text-slate-400">Packaging:</span>
                    <span className="text-slate-200">Signed .msi / .dmg / .AppImage</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/60 text-xs text-blue-200">
                  Ideal for: Retail Billing, Offline Campus ERP, Inventory Controllers, and Laboratory Diagnostics.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- How CodeNova Works (Animated Walkthrough) ----------------- */}
      <HowCodeNovaWorks onNavigate={onNavigate} />

      {/* ----------------- Transparent Pricing & Engagement Spotlight ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>International & Domestic Engagement Tiers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-1 leading-tight">
              Predictable Fixed-Price Engineering. Zero Surprises.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
              Every project operates on deterministic milestones. We specify deliverables, database schemas, and acceptance criteria upfront so you always know what is being built, when it will be delivered, and the exact investment required.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="white"
                size="lg"
                className="font-bold text-slate-900 hover:bg-slate-100"
                onClick={() => onNavigate('/client')}
                rightIcon={<ArrowRight className="w-4 h-4 text-blue-600" />}
              >
                Client Portal & Pricing
              </Button>
              <Button
                variant="darkOutline"
                size="lg"
                className="border-slate-700 text-white hover:bg-slate-800"
                onClick={() => onNavigate('/project-estimator')}
              >
                Calculate Custom Estimate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 7-Phase Delivery Process ----------------- */}
      <section className="bg-slate-50 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="03. Transparent Methodology"
            title="How We Deliver: The 7-Phase Engineering Lifecycle"
            description="No ambiguity, no surprises. From initial architecture to post-launch SLA support, you have complete visibility."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01. Discovery',
                title: 'Business & Scope Analysis',
                desc: 'We audit your workflows, technical constraints, and data security requirements to define precise deliverables.',
              },
              {
                step: '02. Architecture',
                title: 'Systems & Schema Design',
                desc: 'Database schemas, API contracts, offline synchronization models, and infrastructure blueprints.',
              },
              {
                step: '03. Prototyping',
                title: 'UI/UX & Interactive Flows',
                desc: 'High-fidelity Figma wireframes and clickable prototypes to validate usability before code is written.',
              },
              {
                step: '04. Sprints',
                title: 'Agile Full-Stack Engineering',
                desc: 'Two-week development sprints with weekly staging previews and continuous CI/CD automated test builds.',
              },
              {
                step: '05. Hardening',
                title: 'Security, QA & Performance',
                desc: 'OWASP vulnerability scanning, load testing, peripheral driver validation, and cross-browser testing.',
              },
              {
                step: '06. Deployment',
                title: 'Production Launch & Handover',
                desc: 'Zero-downtime deployment, DNS provisioning, signed installer distribution, and 100% IP code transfer.',
              },
              {
                step: '07. Support',
                title: 'SLA Maintenance & Iteration',
                desc: '24/7 server monitoring, automated database backups, security patches, and ongoing feature expansion.',
              },
              {
                step: 'Ongoing',
                title: 'Dedicated Partnership',
                desc: 'Direct communication via Slack/Teams with your lead architects, not outsourced ticketing queues.',
              },
            ].map((phase) => (
              <div
                key={phase.step}
                className="bg-white p-6 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all shadow-sm"
              >
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
                  {phase.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  {phase.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/process')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review Full Delivery Runbook & Deliverables
            </Button>
          </div>
        </div>
      </section>

      {/* ----------------- Project Estimator Teaser ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Interactive Planning Tool
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-2 leading-tight">
              Get an Instant Estimate for Your Software or AI Project
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mt-4 leading-relaxed">
              Use our 5-step project estimator to calculate an indicative cost range and delivery timeline based on your project type, complexity, and feature requirements.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="white"
                size="lg"
                className="font-bold text-slate-900 hover:bg-slate-100"
                onClick={() => onNavigate('/project-estimator')}
                rightIcon={<ArrowRight className="w-4 h-4 text-blue-600" />}
              >
                Launch Project Estimator
              </Button>
              <Button
                variant="darkOutline"
                size="lg"
                className="border-blue-300/60 text-white hover:bg-blue-800/40"
                onClick={() => onNavigate('/client')}
              >
                Client Portal & Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CodeNova Engineering & Delivery Guarantees ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="04. Real Integrity"
          title="CodeNova Quality & Delivery Commitments"
          description="We do not publish fabricated statistics. Instead, we uphold strict engineering standards, transparent pricing, and contractual commitments."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              title: 'Direct Lead Engineer Collaboration',
              subtitle: 'Er. Gagandeep Singh · Lead Software Engineer',
              icon: Award,
              desc: 'You work directly with experienced software engineers who understand system architecture, databases, and peripheral drivers. No middle managers or opaque sub-contracting.',
              tag: 'Zero Bureaucracy',
            },
            {
              title: '100% IP & Full Source Code Handover',
              subtitle: 'Unrestricted Commercial Ownership',
              icon: ShieldCheck,
              desc: 'Every line of code, Dockerfile, database schema, and design artifact is transferred to your organization upon milestone completion. Zero vendor lock-in, forever.',
              tag: 'Full Ownership',
            },
            {
              title: 'Milestone-Based Escrow Deliverables',
              subtitle: 'Staging Verifications Before Payment',
              icon: CheckCircle2,
              desc: 'All projects operate on clear phases. You verify functional milestone builds on private staging environments before releasing milestone payments.',
              tag: 'Predictable & Secure',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-8 rounded-2xl border border-slate-200/90 bg-white flex flex-col justify-between shadow-sm hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>CodeNova Standard</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Guaranteed
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- Frequently Asked Questions ----------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="05. Common Questions"
          title="Everything You Need To Know Before Starting"
          description="Clear answers regarding technical ownership, architecture choices, and how we work."
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- Final High-Impact Consultation Banner ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Get Started Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Have a Project in Mind? Let’s Architect the Right Solution.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Access your dedicated workspace in our Client Portal to manage project milestones, review engineering deliverables, book consultations, or submit new technical requirements.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleCta('/client', 'final_client_portal')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-semibold"
              >
                Access Client Portal
              </Button>
              <Button
                variant="darkOutline"
                size="lg"
                className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 text-white"
                onClick={() => handleCta('/contact', 'final_contact')}
              >
                Contact Engineering Office
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
