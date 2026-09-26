import React, { useState, useMemo } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { useCurrency, CurrencySwitcher } from '../context/CurrencyContext';
import {
  pricingConfig,
  PricingPackage,
  PricingCategory,
  AddOnItem,
} from '../data/pricingData';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Server,
  Globe,
  CreditCard,
  Clock,
  Code2,
  Cpu,
  Bot,
  Smartphone,
  Layout,
  ShoppingCart,
  Workflow,
  Wrench,
  Sparkles,
  PhoneCall,
  FileCode,
  Info,
  ChevronRight,
  Check,
  Users,
  Lock,
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { currency, formatPrice } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Category navigation tabs
  const categoryTabs = [
    { id: 'all', name: 'All Services', icon: Layout },
    { id: 'custom-software-saas', name: 'Custom Software & SaaS', icon: Code2, isFlagship: true },
    { id: 'ai-agents-automation', name: 'AI & Automation', icon: Bot },
    { id: 'web-application-development', name: 'Web Applications', icon: Server },
    { id: 'mobile-app-development', name: 'Mobile Apps', icon: Smartphone },
    { id: 'website-development', name: 'Websites', icon: Globe },
    { id: 'ecommerce-development', name: 'E-Commerce', icon: ShoppingCart },
    { id: 'api-business-integrations', name: 'API Integrations', icon: Workflow },
    { id: 'retainers', name: 'Retainers & Pods', icon: Users },
    { id: 'addons', name: 'Add-Ons', icon: Sparkles },
  ];

  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return pricingConfig.categories;
    }
    return pricingConfig.categories.filter((cat) => cat.id === selectedCategory);
  }, [selectedCategory]);

  const showRetainers = selectedCategory === 'all' || selectedCategory === 'retainers';
  const showAddOns = selectedCategory === 'all' || selectedCategory === 'addons';

  const formatPriceDisplay = (priceINR: number, priceUSD: number) => {
    if (currency === 'INR') {
      return `₹${priceINR.toLocaleString('en-IN')}+`;
    }
    return `$${priceUSD.toLocaleString('en-US')}+`;
  };

  const formatRetainerPrice = (priceINR: number, priceUSD: number) => {
    if (currency === 'INR') {
      return `₹${priceINR.toLocaleString('en-IN')}`;
    }
    return `$${priceUSD.toLocaleString('en-US')}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24 selection:bg-blue-600 selection:text-white">
      {/* ================================================================= */}
      {/* 10. HERO & PREMIUM POSITIONING */}
      {/* ================================================================= */}
      <section className="relative pt-14 pb-20 bg-[#0A0F1D] text-white border-b border-slate-800 overflow-hidden">
        {/* Subtle background glow & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/40 to-transparent pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0A0F1D 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            {/* Left Header Narrative */}
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Enterprise-Ready Software Agency</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {pricingConfig.meta.tagline}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal">
                {pricingConfig.meta.subtagline}
              </p>

              {/* Trust Pillar Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  100% Source Code & IP Transfer
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Deterministic Milestone Escrow
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Senior Engineering Pods
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Production SLA Warranty
                </span>
              </div>
            </div>

            {/* Right: Currency Switcher Box */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex flex-col gap-3 shadow-xl shrink-0 lg:max-w-md w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  Select Billing Currency
                </span>
                <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                  {currency === 'INR' ? 'INR (₹)' : 'USD ($)'}
                </span>
              </div>

              <CurrencySwitcher variant="hero" size="md" className="w-full justify-between" />

              <p className="text-[11px] text-slate-400 leading-tight">
                {currency === 'INR'
                  ? 'Showing domestic Indian pricing suitable for established businesses and funded Indian startups.'
                  : 'Showing international pricing positioned for global startups, international companies, and enterprises.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 14. CATEGORY NAVIGATION BAR (HORIZONTALLY SCROLLABLE ON MOBILE) */}
      {/* ================================================================= */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none scroll-smooth">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 hidden lg:inline-block">
              Filter:
            </span>

            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.name}</span>
                  {tab.isFlagship && (
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-blue-700 text-blue-100' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      Flagship
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ================================================================= */}
      {/* MAIN CONTENT CONTAINER */}
      {/* ================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-20">
        {/* Dynamic Category Sections */}
        {filteredCategories.map((category) => {
          const isCustomSoftware = category.id === 'custom-software-saas';
          const isAI = category.id === 'ai-agents-automation';

          return (
            <section
              key={category.id}
              id={category.id}
              className={`rounded-3xl p-6 sm:p-8 md:p-10 transition-all ${
                isCustomSoftware
                  ? 'bg-gradient-to-b from-slate-900 to-[#0B132B] text-white border border-slate-800 shadow-2xl'
                  : 'bg-white border border-slate-200/90 shadow-sm'
              }`}
            >
              {/* Category Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200/60 dark:border-slate-800">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isCustomSoftware
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {category.badge}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isCustomSoftware ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {category.packages.length} Engineering Tiers
                    </span>
                  </div>

                  <h2
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                      isCustomSoftware ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {category.name}
                  </h2>

                  <p
                    className={`mt-2 text-sm sm:text-base leading-relaxed ${
                      isCustomSoftware ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {category.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Button
                    variant={isCustomSoftware ? 'outline' : 'outline'}
                    size="sm"
                    className={
                      isCustomSoftware
                        ? 'border-slate-700 text-slate-200 hover:bg-slate-800 text-xs'
                        : 'text-slate-700 border-slate-300 hover:bg-slate-50 text-xs'
                    }
                    onClick={() => onNavigate('/book-consultation')}
                  >
                    Speak with Lead Architect
                  </Button>
                </div>
              </div>

              {/* Special AI Disclaimer Notice if Category is AI */}
              {category.notice && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="font-semibold">Notice on Cloud & AI Model Usage: </strong>
                    {category.notice}
                  </div>
                </div>
              )}

              {/* 11. PRICING CARD DESIGN (3-4 desktop, 2 tablet, 1 mobile) */}
              <div
                className={`grid gap-6 mt-8 ${
                  category.packages.length === 3
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : category.packages.length === 4
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {category.packages.map((pkg) => {
                  const isPopular = pkg.popular;
                  const isHighTicket =
                    pkg.priceINR >= 195000 ||
                    pkg.ctaType === 'engineer' ||
                    category.id === 'custom-software-saas';

                  return (
                    <div
                      key={pkg.id}
                      className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                        isCustomSoftware
                          ? isPopular
                            ? 'bg-slate-800/90 border-2 border-blue-500 shadow-xl ring-2 ring-blue-500/20 relative'
                            : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:shadow-lg'
                          : isPopular
                          ? 'bg-white border-2 border-blue-600 shadow-xl ring-2 ring-blue-600/10 relative'
                          : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      {/* Top Badges & Meta */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              isPopular
                                ? 'bg-blue-600 text-white shadow-xs'
                                : isCustomSoftware
                                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {pkg.badge || category.shortName}
                          </span>

                          {pkg.timeline && (
                            <span
                              className={`text-[11px] font-mono font-semibold flex items-center gap-1 ${
                                isCustomSoftware ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              <Clock className="w-3 h-3 text-blue-500" />
                              {pkg.timeline}
                            </span>
                          )}
                        </div>

                        {/* Package Name & Service Category Tag */}
                        <div className="mb-2">
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-wider block ${
                              isCustomSoftware ? 'text-blue-400' : 'text-blue-600'
                            }`}
                          >
                            {pkg.category}
                          </span>
                          <h3
                            className={`text-xl sm:text-2xl font-bold tracking-tight mt-0.5 ${
                              isCustomSoftware ? 'text-white' : 'text-slate-950'
                            }`}
                          >
                            {pkg.name}
                          </h3>
                        </div>

                        <p
                          className={`text-xs leading-relaxed mt-2 min-h-[42px] ${
                            isCustomSoftware ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {pkg.description}
                        </p>

                        {/* Price Box */}
                        <div
                          className={`my-5 pt-4 border-t ${
                            isCustomSoftware ? 'border-slate-800' : 'border-slate-100'
                          }`}
                        >
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-wider block ${
                              isCustomSoftware ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {pricingConfig.meta.startingFromLabel}
                          </span>

                          <div className="flex items-baseline gap-2 mt-1">
                            <span
                              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight ${
                                isCustomSoftware ? 'text-white' : 'text-slate-950'
                              }`}
                            >
                              {formatPriceDisplay(pkg.priceINR, pkg.priceUSD)}
                            </span>
                            <span
                              className={`text-xs font-semibold ${
                                isCustomSoftware ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              {pkg.period}
                            </span>
                          </div>

                          {/* Mandatory Final Pricing Notice */}
                          <p
                            className={`text-[10px] mt-2 leading-normal italic ${
                              isCustomSoftware ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {pricingConfig.meta.footnote}
                          </p>
                        </div>

                        {/* Ideal For Tags (if available) */}
                        {pkg.idealFor && pkg.idealFor.length > 0 && (
                          <div
                            className={`mb-4 pb-4 border-b ${
                              isCustomSoftware ? 'border-slate-800' : 'border-slate-100'
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${
                                isCustomSoftware ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              Best Suited For:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {pkg.idealFor.map((item, idx) => (
                                <span
                                  key={idx}
                                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                    isCustomSoftware
                                      ? 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                                  }`}
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Deliverables / Features List */}
                        <div className="space-y-2.5 pt-1">
                          <p
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              isCustomSoftware ? 'text-slate-300' : 'text-slate-700'
                            }`}
                          >
                            Engineering Inclusions:
                          </p>
                          <div className="space-y-2">
                            {pkg.features.map((feature, fIdx) => (
                              <div
                                key={fIdx}
                                className={`flex items-start gap-2.5 text-xs ${
                                  isCustomSoftware ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    isPopular
                                      ? 'text-blue-500'
                                      : isCustomSoftware
                                      ? 'text-emerald-400'
                                      : 'text-emerald-600'
                                  }`}
                                />
                                <span className="leading-snug">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div
                        className={`mt-7 pt-5 border-t space-y-2 ${
                          isCustomSoftware ? 'border-slate-800' : 'border-slate-100'
                        }`}
                      >
                        {/* Primary CTA */}
                        <Button
                          variant={
                            isPopular
                              ? 'primary'
                              : isCustomSoftware
                              ? 'darkOutline'
                              : 'secondary'
                          }
                          size="md"
                          className="w-full text-xs font-bold"
                          onClick={() =>
                            onNavigate(
                              pkg.ctaAction ||
                                (isHighTicket ? '/book-consultation' : '/book-service')
                            )
                          }
                        >
                          {isHighTicket ? (
                            <>
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Talk to an Engineer</span>
                            </>
                          ) : (
                            <>
                              <span>Get Started</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </Button>

                        {/* Secondary CTA */}
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full text-xs font-semibold ${
                            isCustomSoftware
                              ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                          onClick={() =>
                            onNavigate(pkg.secondaryCtaAction || '/project-intake')
                          }
                        >
                          {pkg.secondaryCtaText || 'Request Custom Quote'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* ================================================================= */}
        {/* 8. MAINTENANCE & ENGINEERING RETAINERS (PODS) */}
        {/* ================================================================= */}
        {showRetainers && (
          <section
            id="retainers"
            className="rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-100">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Continuous Engineering & Retainers
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2 tracking-tight">
                  Dedicated Monthly Retainers & SLA Engineering
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Avoid recruitment overhead, contractor churn, and technical debt. Secure dedicated senior full-stack engineering capacity committed exclusively to your roadmap and uptime.
                </p>
              </div>

              <div className="shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-300 text-slate-700"
                  onClick={() => onNavigate('/contact')}
                >
                  Request Retainer Availability
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {pricingConfig.retainers.map((ret) => {
                const isPod = ret.id === 'dedicated-engineer-pod';
                return (
                  <div
                    key={ret.id}
                    className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                      isPod
                        ? 'border-2 border-blue-600 bg-gradient-to-b from-blue-50/40 to-white shadow-lg relative'
                        : 'border border-slate-200 bg-white shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            isPod ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ret.badge || 'Retainer'}
                        </span>
                        {isPod && (
                          <span className="text-xs font-mono font-bold text-blue-700">
                            160 Hrs / Mo
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-950">{ret.name}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[36px]">
                        {ret.description}
                      </p>

                      <div className="my-5 pt-4 border-t border-slate-100">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                          Retainer Investment
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
                            {formatRetainerPrice(ret.priceINR, ret.priceUSD)}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {ret.period}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 italic">
                          Billed monthly on escrow milestone agreement.
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                          Capacity & SLA Details:
                        </p>
                        {ret.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7 pt-5 border-t border-slate-100 space-y-2">
                      <Button
                        variant={isPod ? 'primary' : 'secondary'}
                        size="md"
                        className="w-full text-xs font-bold"
                        onClick={() =>
                          onNavigate(isPod ? '/book-consultation' : '/contact')
                        }
                      >
                        {isPod ? 'Talk to Lead Architect' : 'Inquire for Retainer Slot'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-slate-200 text-slate-700"
                        onClick={() => onNavigate('/project-intake')}
                      >
                        Request Retainer Scope
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 9. PREMIUM ADD-ONS SECTION */}
        {/* ================================================================= */}
        {showAddOns && (
          <section
            id="addons"
            className="rounded-3xl p-6 sm:p-8 md:p-10 bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-100">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Modular Upgrades
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-2 tracking-tight">
                  Premium Engineering Add-Ons
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                  Enhance your core project with specialized architectural modules, security audits, and automated intelligence integrations.
                </p>
              </div>

              <div className="shrink-0 text-xs text-slate-500 font-medium">
                Seamlessly integrated into any CodeNova contract
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {pricingConfig.addOns.map((addon) => (
                <div
                  key={addon.id}
                  className="rounded-2xl p-5 border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-base font-bold text-slate-950">{addon.title}</h4>
                      <span className="text-sm font-extrabold font-mono text-blue-600 shrink-0">
                        {formatPriceDisplay(addon.priceINR, addon.priceUSD)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {addon.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium truncate max-w-[200px]">
                      {addon.deliverables}
                    </span>
                    <button
                      onClick={() => onNavigate('/project-intake')}
                      className="text-blue-600 hover:text-blue-800 font-bold shrink-0 inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Add</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 12. CUSTOM PROJECT CTA */}
        {/* ================================================================= */}
        <section className="rounded-3xl p-8 sm:p-12 md:p-14 bg-gradient-to-br from-slate-950 via-[#0B132B] to-blue-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              Tailored System Architecture
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {pricingConfig.customProjectCta.title}
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {pricingConfig.customProjectCta.description}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 text-sm sm:text-base font-bold shadow-lg shadow-blue-600/30"
                onClick={() =>
                  onNavigate(pricingConfig.customProjectCta.primaryButton.path)
                }
              >
                <span>{pricingConfig.customProjectCta.primaryButton.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 text-sm sm:text-base border-slate-700 text-white hover:bg-slate-800/80 font-bold"
                onClick={() =>
                  onNavigate(pricingConfig.customProjectCta.secondaryButton.path)
                }
              >
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>{pricingConfig.customProjectCta.secondaryButton.label}</span>
              </Button>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              {pricingConfig.customProjectCta.disclaimer} Direct NDA & technical scoping included.
            </p>
          </div>
        </section>

        {/* ================================================================= */}
        {/* TRANSPARENT STANDARDS & ENTERPRISE ASSURANCE */}
        {/* ================================================================= */}
        <section className="rounded-3xl p-8 bg-white border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-700">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Global Escrow & Payment Methods</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                We accept major credit/debit cards, international Wire Transfers (SWIFT / IBAN), UPI, Net Banking, and Stripe/Razorpay invoices with milestone escrows.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Intellectual Property Handover</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                You retain complete, unencumbered ownership of all source code, database architectures, Figma designs, and deployment configurations from day one.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Engineering Lead Access</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Direct access to senior engineering leadership. Phone:{' '}
                <a href="tel:+916280538868" className="text-blue-600 font-semibold hover:underline">
                  +91 6280538868
                </a>{' '}
                · Email:{' '}
                <a href="mailto:codenovaworks@gmail.com" className="text-blue-600 font-semibold hover:underline">
                  codenovaworks@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
