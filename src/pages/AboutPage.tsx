import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  CodeNovaLogo
} from '../components/brand/CodeNovaLogo';
import {
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Zap,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 md:space-y-28 pb-24">
      {/* Header */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              About CodeNova
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Engineering Digital Products That Move Businesses Forward
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              CodeNova was founded on a simple premise: modern software development should be transparent, uncompromising in code quality, and relentlessly focused on solving real operational bottlenecks.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values / Engineering Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Engineering Constitution"
          title="The Principles That Guide Every Line of Code"
          description="We avoid transient hype in favor of architectural durability and clear business outcomes."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="p-3 w-fit rounded-xl bg-blue-50 text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              1. Pragmatic Architecture Over Fads
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We select runtimes and databases based on your workload requirements, not whatever is trending this week. When an offline desktop database solves an in-store latency bottleneck, we build native desktop software. When a cloud microservice fits best, we engineer cloud-native backends.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="p-3 w-fit rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              2. Strict AI Grounding & Safety
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We do not deploy toy conversational wrappers. Enterprise AI must be grounded in verified corporate catalogs and protected by deterministic validation rules. If confidence thresholds fail, the workflow cleanly escalates to a human operator.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200 bg-white space-y-4">
            <div className="p-3 w-fit rounded-xl bg-indigo-50 text-indigo-600">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              3. 100% Client Ownership
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We believe in zero vendor lock-in. You retain 100% intellectual property, complete source code repositories, deployment scripts, and automated test suites upon milestone completion.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership & Engineering Culture */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">
                Team Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Senior Architects on Every Project
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                When you partner with CodeNova, you work directly with senior systems architects, full-stack engineers, and UI designers. We do not pass your requirements down through layers of non-technical account managers.
              </p>
              <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Direct communication via private Slack/Teams channels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Weekly live milestone demonstrations and staging URLs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Continuous integration with automated test validation</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <CodeNovaLogo variant="dark" symbolSize={36} />
                </div>
                <p className="text-sm text-slate-700 italic border-l-2 border-blue-600 pl-4">
                  "Our mission is to engineer software so reliable that our clients forget what downtime feels like."
                </p>
                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-1">
                  <span>Founder & Lead Engineer: Er. Gagandeep Singh</span>
                  <span>Harike Kalan, Sri Muktsar Sahib, Punjab</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Let’s Build Something Exceptional Together
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Schedule a free 30-minute discovery call to discuss your project requirements with our engineering leads.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('/client')}
            >
              Access Client Portal
            </Button>
            <Button
              variant="darkOutline"
              size="lg"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => onNavigate('/contact')}
            >
              Contact Engineering
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
