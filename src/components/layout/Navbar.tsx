import React, { useState, useEffect } from 'react';
import { CodeNovaLogo } from '../brand/CodeNovaLogo';
import { Button } from '../ui/Button';
import {
  Menu,
  X,
  ChevronDown,
  Monitor,
  Cpu,
  Bot,
  Layers,
  Smartphone,
  Globe,
  ShoppingBag,
  Code2,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const servicesList = [
    {
      name: 'Desktop Application Development',
      slug: 'desktop-application-development',
      icon: Monitor,
      desc: 'Offline POS, inventory, ERP & native systems',
      highlight: true,
    },
    {
      name: 'AI Agent Development',
      slug: 'ai-agents',
      icon: Bot,
      desc: 'Autonomous enterprise workflows & assistants',
    },
    {
      name: 'AI Automation',
      slug: 'ai-automation',
      icon: Cpu,
      desc: 'Automated invoice, CRM & data pipelines',
    },
    {
      name: 'Web Application Development',
      slug: 'web-applications',
      icon: Layers,
      desc: 'High-scale SaaS portals & cloud dashboards',
    },
    {
      name: 'Mobile App Development',
      slug: 'mobile-app-development',
      icon: Smartphone,
      desc: 'Native iOS & Android mobile applications',
    },
    {
      name: 'Website Development',
      slug: 'web-development',
      icon: Globe,
      desc: 'Performant corporate web & marketing engines',
    },
    {
      name: 'E-Commerce Development',
      slug: 'ecommerce-development',
      icon: ShoppingBag,
      desc: 'Omnichannel B2B & retail commerce',
    },
    {
      name: 'Custom Software',
      slug: 'custom-software',
      icon: Code2,
      desc: 'Proprietary enterprise operational software',
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single Element Brand Zone */}
          <div className="flex items-center">
            <CodeNovaLogo
              variant="dark"
              onClick={() => handleNavClick('/')}
              className="py-1"
            />
          </div>

          {/* Zone 2: 4-6 Clean Nav Links with Single-Line Labels */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <button
              onClick={() => handleNavClick('/')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath === '/'
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('/services')}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath.startsWith('/services')
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega-menu panel */}
              {servicesDropdownOpen && (
                <div className="absolute left-0 mt-1 w-[460px] bg-white rounded-xl shadow-xl border border-slate-200/90 p-3 grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Core Engineering Services
                    </span>
                    <button
                      onClick={() => handleNavClick('/services')}
                      className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-0.5"
                    >
                      All Services <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {servicesList.map((srv) => {
                    const Icon = srv.icon;
                    return (
                      <button
                        key={srv.slug}
                        onClick={() => handleNavClick(`/services/${srv.slug}`)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors hover:bg-slate-50 group ${
                          srv.highlight ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          className={`p-2 rounded-md shrink-0 mt-0.5 ${
                            srv.highlight
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
                              {srv.name}
                            </span>
                            {srv.highlight && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {srv.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('/solutions')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath === '/solutions'
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Solutions
            </button>

            <button
              onClick={() => handleNavClick('/process')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath === '/process'
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Process
            </button>

            <button
              onClick={() => handleNavClick('/pricing')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath === '/pricing'
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Pricing
            </button>

            <button
              onClick={() => handleNavClick('/blog')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath.startsWith('/blog')
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Blog
            </button>

            <button
              onClick={() => handleNavClick('/contact')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPath === '/contact'
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavClick('/client')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Client Portal
            </Button>
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavClick('/client')}
              className="text-xs px-2.5 py-1.5"
            >
              Client Portal
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('/')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath === '/' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          {/* Mobile Services Sub-List */}
          <div className="py-1">
            <button
              onClick={() => handleNavClick('/services')}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-900 bg-slate-50"
            >
              Services Overview
            </button>
            <div className="pl-4 mt-1 space-y-1">
              <button
                onClick={() => handleNavClick('/services/desktop-application-development')}
                className="flex items-center gap-2 w-full text-left py-2 px-2 text-xs font-medium text-blue-700 bg-blue-50/50 rounded"
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop Application Development (Featured)
              </button>
              <button
                onClick={() => handleNavClick('/services/web-applications')}
                className="flex items-center gap-2 w-full text-left py-2 px-2 text-xs text-slate-600 hover:text-blue-600"
              >
                <Layers className="w-3.5 h-3.5" />
                Web Applications
              </button>
              <button
                onClick={() => handleNavClick('/services/ai-agents')}
                className="flex items-center gap-2 w-full text-left py-2 px-2 text-xs text-slate-600 hover:text-blue-600"
              >
                <Bot className="w-3.5 h-3.5" />
                AI Agents & Workflows
              </button>
              <button
                onClick={() => handleNavClick('/services/mobile-app-development')}
                className="flex items-center gap-2 w-full text-left py-2 px-2 text-xs text-slate-600 hover:text-blue-600"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile App Development
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNavClick('/project-intake')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath === '/project-intake' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            📋 Project Requirements Intake
          </button>

          <button
            onClick={() => handleNavClick('/solutions')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath === '/solutions' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Solutions
          </button>

          <button
            onClick={() => handleNavClick('/project-estimator')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath === '/project-estimator' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Project Estimator
          </button>

          <button
            onClick={() => handleNavClick('/process')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath === '/process' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Development Process
          </button>

          <button
            onClick={() => handleNavClick('/pricing')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath === '/pricing' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Pricing & Engagement
          </button>

          <button
            onClick={() => handleNavClick('/blog')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath.startsWith('/blog') ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Engineering Blog
          </button>

          <button
            onClick={() => handleNavClick('/contact')}
            className={`block w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              currentPath === '/contact' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            Contact
          </button>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('/client')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1"
            >
              Client Portal
            </button>
            <button
              onClick={() => handleNavClick('/admin/login')}
              className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
