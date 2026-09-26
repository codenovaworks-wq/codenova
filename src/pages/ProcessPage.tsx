import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  Search,
  Layers,
  Palette,
  Code2,
  ShieldCheck,
  Rocket,
  LifeBuoy,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { HowCodeNovaWorks } from '../components/home/HowCodeNovaWorks';

interface ProcessPageProps {
  onNavigate: (path: string) => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ onNavigate }) => {
  const phases = [
    {
      step: 'Phase 01',
      title: 'Discovery & Business Scoping',
      icon: Search,
      duration: 'Week 1',
      summary:
        'We analyze your operational workflows, user roles, security requirements, and technical constraints to establish a deterministic scope of work.',
      deliverables: [
        'Detailed Product Requirements Document (PRD)',
        'Technical Architecture Blueprint',
        'Defined milestones and deliverables contract',
      ],
    },
    {
      step: 'Phase 02',
      title: 'Architecture & Schema Design',
      icon: Layers,
      duration: 'Week 1 - 2',
      summary:
        'Before writing user interface code, we model relational databases, offline SQLite caches, API specifications, and cloud infrastructure.',
      deliverables: [
        'Normalized Entity-Relationship Diagrams (ERD)',
        'OpenAPI / REST endpoint specifications',
        'Offline synchronization protocols (if applicable)',
      ],
    },
    {
      step: 'Phase 03',
      title: 'UI/UX & Clickable Prototyping',
      icon: Palette,
      duration: 'Week 2 - 3',
      summary:
        'Our product designers craft high-fidelity wireframes and clickable Figma prototypes so your stakeholders experience the exact user journey.',
      deliverables: [
        'Interactive Figma prototype link',
        'Component token design system',
        'WCAG AA accessibility validation checklist',
      ],
    },
    {
      step: 'Phase 04',
      title: 'Agile Full-Stack Engineering',
      icon: Code2,
      duration: 'Sprint Cycles (2-Week Intervals)',
      summary:
        'We engineer frontend, backend, and native desktop or mobile layers in transparent 2-week sprints with weekly live staging demonstrations.',
      deliverables: [
        'Live staging preview environment',
        'Weekly video walkthrough demos',
        'Continuous automated build passes',
      ],
    },
    {
      step: 'Phase 05',
      title: 'QA, Hardening & Security Audits',
      icon: ShieldCheck,
      duration: 'Final 2 Weeks',
      summary:
        'Rigorous automated test suites, OWASP vulnerability scans, peripheral driver validation (thermal printers, barcode scanners), and load stress testing.',
      deliverables: [
        'Security & penetration test report',
        'End-to-end integration test passes',
        'Code signing validation (.exe, .dmg, .apk)',
      ],
    },
    {
      step: 'Phase 06',
      title: 'Production Deployment & Launch',
      icon: Rocket,
      duration: 'Launch Day',
      summary:
        'Zero-downtime cutover, production database migrations, DNS configuration, and automated client update channel initialization.',
      deliverables: [
        'Production release deployment',
        'Full IP and source code repository transfer',
        'Operator and administrator documentation',
      ],
    },
    {
      step: 'Phase 07',
      title: 'SLA Maintenance & Ongoing Support',
      icon: LifeBuoy,
      duration: 'Continuous',
      summary:
        'Proactive 24/7 uptime monitoring, critical security patching, automated daily backups, and continuous feature expansion.',
      deliverables: [
        'SLA-backed response time guarantees',
        'Monthly infrastructure health reports',
        'Dedicated senior developer access',
      ],
    },
  ];

  return (
    <div className="space-y-20 md:space-y-28 pb-24">
      {/* Header */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              Delivery Methodology
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              The CodeNova 7-Phase Engineering Lifecycle
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              We eliminate ambiguity through transparent, milestone-driven sprints. Here is how your concept transforms into a scalable production system.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Client Portal Walkthrough */}
      <HowCodeNovaWorks onNavigate={onNavigate} />

      {/* Process Flow */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.step}
                className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                      {phase.step} &bull; {phase.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {phase.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {phase.summary}
                  </p>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Key Deliverables:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.deliverables.map((del, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to Begin Phase 01?
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Book a 30-minute discovery call to kick off architectural planning with our principal engineers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('/book-consultation')}
            >
              Book Discovery Session
            </Button>
            <Button
              variant="darkOutline"
              size="lg"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => onNavigate('/project-estimator')}
            >
              Estimate Project Scope
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
