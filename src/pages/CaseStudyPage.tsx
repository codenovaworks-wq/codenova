import React from 'react';
import { initialProjects } from '../server/seedData';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  Building,
  Target,
  Wrench,
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface CaseStudyPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ slug, onNavigate }) => {
  const project = initialProjects.find((p) => p.slug === slug) || initialProjects[0];

  const handleCta = (path: string) => {
    trackEvent('primary_cta_click', { label: `case_study_${slug}` });
    onNavigate(path);
  };

  return (
    <div className="space-y-20 md:space-y-28 pb-24">
      {/* Hero Header */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <button
              onClick={() => onNavigate('/portfolio')}
              className="text-xs font-semibold text-blue-400 hover:underline uppercase tracking-wider mb-4 inline-block"
            >
              ← Back to All Case Studies
            </button>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                {project.category}
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-xs text-slate-400">Timeline: {project.timeline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {project.name}: {project.summary}
            </h1>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleCta('/book-consultation')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Schedule Similar Project Consultation
              </Button>
              <Button
                variant="darkOutline"
                size="lg"
                className="border-slate-700 text-white hover:bg-slate-800"
                onClick={() => handleCta('/project-estimator')}
              >
                Estimate This System
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 text-white grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          {project.metrics.map((m, i) => (
            <div key={i} className="pt-4 sm:pt-0 sm:px-6 first:px-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono tracking-tight">
                {m.value}
              </p>
              <p className="text-xs uppercase tracking-wider text-slate-400 mt-2 font-semibold">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Showcase Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 shadow-lg">
          <img
            src={project.cover_image}
            alt={project.name}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      </section>

      {/* Problem & Solution Detailed Analysis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* The Problem */}
          <div className="p-8 rounded-2xl border border-red-200 bg-red-50/20 space-y-4">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider">
              <Target className="w-5 h-5" />
              <span>The Operational Challenge</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              The Critical Bottleneck
            </h3>
            <p className="text-slate-700 leading-relaxed text-base">
              {project.problem}
            </p>
          </div>

          {/* The Solution */}
          <div className="p-8 rounded-2xl border border-blue-200 bg-blue-50/20 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
              <Wrench className="w-5 h-5" />
              <span>The Engineering Architecture</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              How CodeNova Solved It
            </h3>
            <p className="text-slate-700 leading-relaxed text-base">
              {project.solution}
            </p>
          </div>
        </div>
      </section>

      {/* Feature Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="System Capabilities"
          title="Engineered Features & Technical Implementation"
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.features.map((feat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-slate-800">{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Business Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Verified Business ROI & Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {project.results.map((res, i) => (
              <div key={i} className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">RESULT 0{i + 1}</span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {res}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Production Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Consultation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to Build a System Like {project.name}?
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Schedule a free 30-minute discovery call to discuss your project requirements, technology options, and estimated timeline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleCta('/book-consultation')}
            >
              Book Discovery Call
            </Button>
            <Button
              variant="darkOutline"
              size="lg"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={() => handleCta('/project-estimator')}
            >
              Calculate Estimated Cost
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
