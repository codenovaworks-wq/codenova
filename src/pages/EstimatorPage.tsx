import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { useCurrency, CurrencySwitcher } from '../context/CurrencyContext';
import {
  Monitor,
  Smartphone,
  Globe,
  Layers,
  Bot,
  Cpu,
  ShoppingBag,
  Code2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calculator,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { trackEvent } from '../lib/analytics';

interface EstimatorPageProps {
  onNavigate: (path: string) => void;
}

export const EstimatorPage: React.FC<EstimatorPageProps> = ({ onNavigate }) => {
  const { currency, formatPrice } = useCurrency();
  const [step, setStep] = useState<number>(1);
  const [projectType, setProjectType] = useState<string>('Desktop App');
  const [complexity, setComplexity] = useState<string>('Standard Business');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Authentication & RBAC',
    'Admin Dashboard & CMS',
    'Offline Mode & Local Storage',
  ]);
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactCompany, setContactCompany] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [estimateResult, setEstimateResult] = useState<{
    estimated_min: number;
    estimated_max: number;
    disclaimer: string;
    requestId?: string;
  } | null>(null);

  const projectTypes = [
    { name: 'Desktop App', icon: Monitor, desc: 'Offline-first, POS, inventory, Windows/macOS/Linux' },
    { name: 'Web App', icon: Layers, desc: 'SaaS portals, cloud workflows, customer dashboards' },
    { name: 'Mobile App', icon: Smartphone, desc: 'Native iOS & Android mobile applications' },
    { name: 'AI Agent', icon: Bot, desc: 'Autonomous LLM assistants & customer support' },
    { name: 'AI Automation', icon: Cpu, desc: 'Invoice parsing, document OCR & workflow pipelines' },
    { name: 'Website', icon: Globe, desc: 'High-conversion marketing & corporate websites' },
    { name: 'E-Commerce', icon: ShoppingBag, desc: 'Omnichannel B2B wholesale & retail storefronts' },
    { name: 'Custom Software', icon: Code2, desc: 'Proprietary enterprise ERP & operational systems' },
  ];

  const complexityTiers = [
    {
      name: 'MVP / Simple',
      desc: 'Focused core feature set to validate market demand quickly.',
      timeline: '4 - 6 Weeks',
    },
    {
      name: 'Standard Business',
      desc: 'Robust production architecture with integrations, dashboards, and role security.',
      timeline: '8 - 12 Weeks',
    },
    {
      name: 'Advanced Enterprise',
      desc: 'High-concurrency systems, offline sync, custom hardware drivers, or multi-tenant SaaS.',
      timeline: '12 - 18 Weeks',
    },
  ];

  const featureOptions = [
    { name: 'Authentication & RBAC', category: 'Security' },
    { name: 'Admin Dashboard & CMS', category: 'Management' },
    { name: 'Offline Mode & Local Storage', category: 'Performance' },
    { name: 'Hardware & Peripheral Integration', category: 'Hardware' },
    { name: 'Payment Gateway & Billing', category: 'Monetization' },
    { name: 'AI / LLM Integration', category: 'Intelligence' },
    { name: 'External API Integration', category: 'Integration' },
    { name: 'Real-time Chat & WebSockets', category: 'Real-Time' },
    { name: 'High-Performance Database', category: 'Database' },
    { name: 'Maps & Geolocation', category: 'Location' },
    { name: 'Analytics & Reporting', category: 'BI' },
    { name: 'Push & SMS Notifications', category: 'Messaging' },
  ];

  const toggleFeature = (name: string) => {
    if (selectedFeatures.includes(name)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== name));
    } else {
      setSelectedFeatures([...selectedFeatures, name]);
    }
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    trackEvent('estimator_submit', { service: projectType });

    try {
      const res = await apiClient.calculateEstimate({
        project_type: projectType,
        complexity,
        selected_features: selectedFeatures,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_company: contactCompany,
        notes,
      });
      setEstimateResult(res);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* Hero Header */}
      <section className="pt-12 md:pt-16 pb-10 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
                <Calculator className="w-4 h-4" />
                <span>Interactive Scoping Wizard</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Software & AI Project Estimator
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                Calculate indicative development costs and project delivery timelines in 5 quick steps. No commitment required.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-3.5 rounded-xl shrink-0 flex items-center gap-3">
              <span className="text-xs text-slate-300 font-medium">Currency:</span>
              <CurrencySwitcher />
            </div>
          </div>
        </div>
      </section>

      {/* Stepper Wizard Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Step {step} of 5</span>
            <span>
              {step === 1 && 'Select Target Architecture'}
              {step === 2 && 'Choose Complexity Tier'}
              {step === 3 && 'Select Features & Modules'}
              {step === 4 && 'Project Specifics & Contact'}
              {step === 5 && 'Estimate Calculation Breakdown'}
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Project Type */}
        {step === 1 && (
          <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                1. What kind of system are you building?
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Select the primary platform or product format.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectTypes.map((pt) => {
                const Icon = pt.icon;
                const isSelected = projectType === pt.name;
                return (
                  <button
                    key={pt.name}
                    type="button"
                    onClick={() => setProjectType(pt.name)}
                    className={`p-5 rounded-xl border text-left flex items-start gap-4 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{pt.name}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{pt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Complexity Tier
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Complexity */}
        {step === 2 && (
          <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                2. Select Project Scope & Complexity
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                This sets baseline engineering hours and QA depth.
              </p>
            </div>

            <div className="space-y-4">
              {complexityTiers.map((tier) => {
                const isSelected = complexity === tier.name;
                return (
                  <button
                    key={tier.name}
                    type="button"
                    onClick={() => setComplexity(tier.name)}
                    className={`w-full p-5 rounded-xl border text-left flex items-center justify-between gap-4 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-900">{tier.name}</h3>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          {tier.timeline}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{tier.desc}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Select Features
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Features */}
        {step === 3 && (
          <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                3. What features and modules are required?
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Select all that apply. You can refine this with our engineering team later.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featureOptions.map((feat) => {
                const isSelected = selectedFeatures.includes(feat.name);
                return (
                  <button
                    key={feat.name}
                    type="button"
                    onClick={() => toggleFeature(feat.name)}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-mono uppercase text-slate-400">
                        {feat.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">{feat.name}</h4>
                    </div>

                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Project Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Contact & Project Notes */}
        {step === 4 && (
          <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                4. Where should we send your detailed specification?
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Enter your details to generate your tailored breakdown.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  value={contactCompany}
                  onChange={(e) => setContactCompany(e.target.value)}
                  placeholder="Acme Enterprises"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specific Requirements or Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Must connect with existing Epson thermal printers and sync locally without internet..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(3)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                isLoading={isLoading}
                onClick={handleCalculate}
                rightIcon={<Calculator className="w-4 h-4" />}
              >
                Calculate Final Estimate
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {step === 5 && estimateResult && (
          <div className="space-y-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-md">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Estimated Development Cost
              </h2>
              <p className="text-sm text-slate-600">
                Based on {projectType} ({complexity}) with {selectedFeatures.length} selected features.
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-2 max-w-md mx-auto shadow-xl">
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold font-mono">
                INDICATIVE PROJECT RANGE ({currency})
              </p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {formatPrice(estimateResult.estimated_min * 86, estimateResult.estimated_min)} – {formatPrice(estimateResult.estimated_max * 86, estimateResult.estimated_max)}
              </p>
              <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                Estimated Delivery: {complexity === 'MVP / Simple' ? '4–6 Weeks' : complexity === 'Standard Business' ? '8–12 Weeks' : '12–18 Weeks'}
              </p>
            </div>

            <div className="bg-blue-50/60 rounded-xl p-5 border border-blue-200 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-blue-900">What is included in this estimate:</p>
              <p>&bull; Complete UI/UX clickable prototypes and design token library</p>
              <p>&bull; Full-stack engineering with automated CI/CD and unit test coverage</p>
              <p>&bull; Production server or desktop signed installer packaging</p>
              <p>&bull; 100% intellectual property and full source code ownership handover</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('/book-consultation')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Schedule Architecture Call
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStep(1);
                  setEstimateResult(null);
                }}
                className="w-full sm:w-auto"
              >
                Calculate Another Project
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
