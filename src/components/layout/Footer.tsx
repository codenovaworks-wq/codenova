import React from 'react';
import { CodeNovaLogo } from '../brand/CodeNovaLogo';
import { Button } from '../ui/Button';
import { Mail, Phone, Clock, MapPin, ArrowRight, Shield } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLink = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', { source: 'footer' });
  };

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800">
      {/* Top Pre-Footer CTA Bar */}
      <div className="border-b border-slate-800/80 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                Ready to turn your business idea into resilient software?
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
                Schedule a 30-minute discovery call with our engineering leads to discuss architecture, timeline, and deliverables.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleLink('/book-consultation')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Book Free Consultation
              </Button>
              <Button
                variant="darkOutline"
                size="md"
                onClick={() => handleLink('/project-estimator')}
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                Estimate Project Scope
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand & Contact Information */}
          <div className="lg:col-span-2 space-y-4">
            <CodeNovaLogo
              variant="light"
              onClick={() => handleLink('/')}
              symbolSize={40}
            />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              CodeNova helps businesses turn ideas and operational bottlenecks into modern software, autonomous AI solutions, and mission-critical digital products.
            </p>

            <div className="space-y-2.5 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="mailto:codenovaworks@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  codenovaworks@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="tel:+916280538868"
                  onClick={handlePhoneClick}
                  className="hover:text-white transition-colors"
                >
                  +91 6280538868
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Harike Kalan, Sri Muktsar Sahib, 152025, Punjab, India</span>
              </div>
            </div>
          </div>

          {/* Column 2: Engineering Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleLink('/services/desktop-application-development')}
                  className="hover:text-blue-400 transition-colors text-left font-medium text-slate-200"
                >
                  Desktop Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/services/web-applications')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Web Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/services/ai-agents')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  AI Agent Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/services/ai-automation')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  AI Automation Pipelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/services/mobile-app-development')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Mobile Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/services/ecommerce-development')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  E-Commerce Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/services/custom-software')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Custom Software
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/services/ui-ux-design')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  UI/UX & Prototyping
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Portals & Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Client Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleLink('/client')}
                  className="hover:text-blue-400 transition-colors text-left font-bold text-blue-400"
                >
                  Client Portal & Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/project-intake')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Project Requirements Intake
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/project-estimator')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Cost & Scope Estimator
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/book-consultation')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Book Free Consultation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/project-intake')}
                  className="hover:text-blue-400 transition-colors text-left text-amber-400 font-medium"
                >
                  📋 Project Requirements (Google Form)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/solutions')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Industry Solutions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Governance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleLink('/about')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  About CodeNova
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/process')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  7-Phase Delivery Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/pricing')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Pricing & Engagement
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/blog')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Engineering Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/brand-assets')}
                  className="hover:text-blue-400 transition-colors text-left font-medium text-cyan-400"
                >
                  Brand Assets & Logo
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/contact')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/google-form')}
                  className="hover:text-blue-400 transition-colors text-left text-amber-300 font-medium flex items-center gap-1.5"
                >
                  <span>📋 Project Intake Google Form</span>
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleLink('/privacy-policy')}
                  className="hover:text-blue-400 transition-colors text-left text-xs"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/terms')}
                  className="hover:text-blue-400 transition-colors text-left text-xs"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/cookie-policy')}
                  className="hover:text-blue-400 transition-colors text-left text-xs"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('/refund-policy')}
                  className="hover:text-blue-400 transition-colors text-left text-xs"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>
              &copy; {new Date().getFullYear()} CodeNova. All rights reserved. Intellectual property transferred upon milestone completion.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLink('/client')}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Client Portal
            </button>
            <span>&bull;</span>
            <button
              onClick={() => handleLink('/admin/login')}
              className="hover:text-slate-400 transition-colors"
            >
              Admin Portal
            </button>
            <span>&bull;</span>
            <span>GDPR & OWASP Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
