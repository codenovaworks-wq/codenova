import React, { useState } from 'react';
import { initialProjects } from '../server/seedData';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface PortfolioPageProps {
  onNavigate: (path: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: 'Healthcare & Logistics', value: 'healthcare' },
    { label: 'Ticketing & Concurrency', value: 'entertainment' },
    { label: 'Education & AI Assistant', value: 'education' },
    { label: 'B2B Wholesale & Commerce', value: 'commerce' },
  ];

  const filteredProjects = initialProjects.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const handleProjectClick = (slug: string) => {
    trackEvent('case_study_view', { service: slug });
    onNavigate(`/portfolio/${slug}`);
  };

  return (
    <div className="space-y-20 md:space-y-28 pb-24">
      {/* Hero Header */}
      <section className="pt-12 md:pt-16 pb-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">
              Production Case Studies
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Systems Engineered for Scale and Reliability
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Explore our real-world software implementations. Each case study documents the business problem, architectural decisions, and verified results.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => handleProjectClick(p.slug)}
              className="group border border-slate-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] w-full bg-slate-900 overflow-hidden relative">
                  <img
                    src={p.cover_image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-[#0F172A]/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700/60">
                    {p.category}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold font-mono text-blue-600">
                        {p.metrics[0]?.value}
                      </span>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {p.metrics[0]?.label}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    {p.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {p.results.slice(0, 2).map((res, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 ml-4">
                  Full Case Study <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Have a Project Requiring High Reliability?</h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Book a consultation with our architects to see how our proven technical patterns can be adapted to your business goals.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/book-consultation')}
            >
              Book Discovery Session
            </Button>
            <Button
              variant="darkOutline"
              size="md"
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
