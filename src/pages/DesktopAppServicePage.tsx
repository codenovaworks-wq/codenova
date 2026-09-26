import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  Monitor,
  HardDrive,
  Printer,
  ShieldCheck,
  RefreshCw,
  Cpu,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Zap,
  Terminal,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface DesktopAppServicePageProps {
  onNavigate: (path: string) => void;
}

export const DesktopAppServicePage: React.FC<DesktopAppServicePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCta = (path: string) => {
    trackEvent('primary_cta_click', { label: 'desktop_page_cta' });
    onNavigate(path);
  };

  const useCases = [
    {
      title: 'High-Velocity Retail POS & Billing Engines',
      description:
        'Checkout terminals operating with zero latency even during network outages. Instant thermal receipt printing and automated cash drawer triggers.',
      icon: Printer,
    },
    {
      title: 'Warehouse & Inventory Controllers',
      description:
        'Workstations paired with high-speed handheld barcode and 2D QR scanners for real-time stock intake, pallet tagging, and dispatch verification.',
      icon: HardDrive,
    },
    {
      title: 'School & Institutional Campus ERPs',
      description:
        'Comprehensive on-premises administration covering admissions, student attendance, report card generation, and fee receipting.',
      icon: Layers,
    },
    {
      title: 'Healthcare & Clinic Management Suites',
      description:
        'HIPAA-compliant local patient records, offline appointment registries, and diagnostic hardware data ingestion with local encryption.',
      icon: ShieldCheck,
    },
    {
      title: 'Industrial Telemetry & Lab Utilities',
      description:
        'High-frequency serial port data acquisition, device calibration utilities, and real-time sensor visualization dashboards.',
      icon: Terminal,
    },
    {
      title: 'Document Processing & Media Converters',
      description:
        'Batch local PDF generation, audio/video transcoding, and cryptographic hashing utilizing full CPU/GPU multithreading.',
      icon: Cpu,
    },
  ];

  const techStacks = [
    {
      name: 'Tauri & Rust',
      badge: 'Lightweight & Ultra Fast',
      desc: 'Extremely tiny binary size (~5MB), minimal RAM consumption, and blazing-fast native Rust backend logic with web-based frontend interfaces.',
      ideal: 'Modern lightweight workstations & cross-platform utilities',
    },
    {
      name: 'Electron & Node.js',
      badge: 'Feature-Rich & Cross-Platform',
      desc: 'Mature ecosystem with rich library support, rapid multi-platform packaging (Windows, macOS, Linux), and direct native Node API access.',
      ideal: 'Complex enterprise suites & collaborative desktop tools',
    },
    {
      name: '.NET 8 / WPF / C#',
      badge: 'Native Windows Enterprise',
      desc: 'Deep integration into Windows OS services, Active Directory / LDAP authentication, and high-performance Direct3D graphics pipelines.',
      ideal: 'Dedicated Windows retail networks & industrial workstations',
    },
  ];

  const faqs = [
    {
      q: 'Will our desktop software work when the internet is completely disconnected?',
      a: 'Yes. Offline capability is our core architectural priority for desktop software. All transactions, billing entries, and operational records execute against an encrypted local SQLite or embedded database. When network connectivity resumes, the built-in synchronization engine reconciles data with your central cloud database.',
    },
    {
      q: 'How do you connect thermal receipt printers and barcode scanners?',
      a: 'We implement direct communication with peripheral hardware over USB, Serial (RS-232), Ethernet, and Bluetooth using raw ESC/POS commands, USB HID protocols, and virtual COM ports. We test extensively against industry-standard hardware brands including Epson, Zebra, Honeywell, Star Micronics, and Datalogic.',
    },
    {
      q: 'How are software updates rolled out across multiple client machines?',
      a: 'We integrate silent, background auto-update pipelines (such as Sparkle for macOS and Squirrel/Tauri updater for Windows). When you publish an update, client installations verify cryptographic signatures and apply patches seamlessly without requiring technician site visits.',
    },
    {
      q: 'Can the desktop software sync with our existing web or mobile app?',
      a: 'Yes. We architect unified API contracts and event-driven data sync protocols so that transactions entered on a desktop terminal reflect in real-time on your mobile and web executive dashboards.',
    },
    {
      q: 'Do you provide code signing certificates for Windows and macOS?',
      a: 'Yes. We configure complete code signing pipelines (EV Code Signing for Windows SmartScreen trust, and Apple Developer ID Notarization for macOS Gatekeeper) to ensure your users experience seamless installations without security warning popups.',
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* ----------------- Header Hero ----------------- */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-4">
              <Monitor className="w-4 h-4" />
              <span>Specialized Engineering Service</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Desktop Application Development
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
              We engineer mission-critical, offline-first desktop software for Windows, macOS, and Linux. Built for environments demanding zero-latency local execution, reliable hardware peripheral integration, and rock-solid operational continuity.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleCta('/contact')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Desktop Services
              </Button>
              <Button
                variant="darkOutline"
                size="lg"
                className="border-slate-700 text-white hover:bg-slate-800"
                onClick={() => handleCta('/project-estimator')}
              >
                Estimate Desktop Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Key Architectural Pillars ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="01. Architectural Pillars"
          title="Why Modern Enterprises Invest in Native Desktop Systems"
          description="Browser tabs are not enough when speed, offline continuity, and hardware communication dictate business success."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Zero Latency & Offline Autonomy
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Native executables interact directly with machine memory and local NVMe storage. When internet connections drop, checkout counters and warehouse staff continue operating with zero disruption.
            </p>
            <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Embedded encrypted SQLite engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automated outbox cloud synchronization</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Direct Peripheral Hardware Control
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Seamlessly communicate with ESC/POS thermal printers, USB and Bluetooth barcode scanners, cash drawers, biometric readers, and digital weighing scales without clumsy browser helper apps.
            </p>
            <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Low-level Serial / USB HID / COM ports</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Raw bytecode printing without OS dialogs</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              OS-Level Security & Cryptographic Signing
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every build is signed with enterprise code-signing certificates to eliminate Windows SmartScreen warnings and macOS Gatekeeper blocks, ensuring smooth organizational deployment.
            </p>
            <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Windows EV Code Signing (.exe, .msi)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Apple Notarization & Keychain integration</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------- Industry Use Cases ----------------- */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="02. Practical Applications"
            title="Desktop Software Use Cases Across Industries"
            description="Proven business contexts where desktop software outperforms web-only solutions."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.title}
                  className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-2.5 w-fit rounded-lg bg-blue-50 text-blue-600 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {uc.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {uc.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------- Technology Selection ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="03. Technology Stack"
          title="Optimal Runtime Architecture for Your Requirements"
          description="We select the right desktop framework tailored to your performance, platform, and deployment targets."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techStacks.map((stack) => (
            <div
              key={stack.name}
              className="p-8 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">
                  {stack.badge}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {stack.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-4">
                  {stack.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400">Best for:</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {stack.ideal}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- Desktop Deliverables Runbook ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            What You Receive With Every CodeNova Desktop Delivery
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cyan-400">
                1. Native Installers & Packages
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete, signed installation packages for your target OS (.exe / .msi for Windows, .dmg / .pkg for macOS, .deb / .AppImage for Linux).
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cyan-400">
                2. Automated Update Server Pipeline
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A configured silent update repository allowing you to push version releases and security patches straight to running client terminals.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cyan-400">
                3. Hardware Driver Integrations
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thoroughly verified peripheral integrations with receipt printers, barcode readers, and serial devices with failover error handling.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cyan-400">
                4. Local Database Schema & Migrations
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic embedded SQLite database with automatic schema version migrations and database compaction routines.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cyan-400">
                5. 100% Source Code & Build Scripts
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full intellectual property transfer, reproducible CI/CD build scripts, and development container setups.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-cyan-400">
                6. Operator & Admin Manuals
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clear documentation for installation, offline troubleshooting, and cloud synchronization conflict resolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Frequently Asked Questions ----------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="04. Technical Q&A"
          title="Frequently Asked Questions About Desktop Development"
          description="Detailed answers regarding offline synchronization, hardware compatibility, and deployment."
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white"
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

      {/* ----------------- Bottom Consultation CTA ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Need a High-Performance Desktop Application?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
            Speak directly with our desktop systems architects about offline database design, hardware integration, and deployment timelines.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              variant="white"
              size="lg"
              className="font-bold text-blue-950 hover:bg-blue-50"
              onClick={() => handleCta('/book-consultation')}
              rightIcon={<ArrowRight className="w-4 h-4 text-blue-600" />}
            >
              Book Free Discovery Call
            </Button>
            <Button
              variant="darkOutline"
              size="lg"
              className="border-blue-400 text-white hover:bg-blue-800/40"
              onClick={() => handleCta('/contact')}
            >
              Submit Specification File
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
