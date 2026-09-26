import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { DesktopAppServicePage } from './pages/DesktopAppServicePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { EstimatorPage } from './pages/EstimatorPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { ProcessPage } from './pages/ProcessPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { CookiePolicyPage, RefundPolicyPage } from './pages/legal/CookiePolicyPage';
import { BrandAssetsPage } from './pages/BrandAssetsPage';
import { ServiceBookingPage } from './pages/ServiceBookingPage';
import { ProjectIntakeFormPage } from './pages/ProjectIntakeFormPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ClientLoginPage } from './pages/client/ClientLoginPage';
import { ClientPortalPage } from './pages/client/ClientPortalPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { apiClient } from './lib/api';
import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('codenova_admin_token');
  });

  const [isClientLoggedIn, setIsClientLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('codenova_client_token');
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    navigate('/admin/dashboard');
  };

  const handleAdminLogout = () => {
    apiClient.adminLogout();
    setIsAdminLoggedIn(false);
    navigate('/admin/login');
  };

  const handleClientLoginSuccess = () => {
    setIsClientLoggedIn(true);
    navigate('/client/dashboard');
  };

  const handleClientLogout = () => {
    apiClient.clearToken();
    setIsClientLoggedIn(false);
    navigate('/client');
  };

  const isAdminRoute = currentPath.startsWith('/admin');
  const isClientDashboardRoute = currentPath === '/client/dashboard';

  // Router dispatcher
  const renderCurrentPage = () => {
    // Admin routes
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
      if (!isAdminLoggedIn) {
        return (
          <AdminLoginPage
            onLoginSuccess={handleAdminLoginSuccess}
            onNavigate={navigate}
          />
        );
      }
      return (
        <AdminDashboardPage
          onLogout={handleAdminLogout}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/admin/login') {
      if (isAdminLoggedIn) {
        return (
          <AdminDashboardPage
            onLogout={handleAdminLogout}
            onNavigate={navigate}
          />
        );
      }
      return (
        <AdminLoginPage
          onLoginSuccess={handleAdminLoginSuccess}
          onNavigate={navigate}
        />
      );
    }

    // Client Portal routes
    if (currentPath === '/client/dashboard') {
      if (!isClientLoggedIn) {
        return (
          <ClientLoginPage
            onLoginSuccess={handleClientLoginSuccess}
            onNavigate={navigate}
          />
        );
      }
      return (
        <ClientPortalPage
          onLogout={handleClientLogout}
          onNavigate={navigate}
        />
      );
    }

    if (
      currentPath === '/client' ||
      currentPath === '/client/login' ||
      currentPath === '/client/register' ||
      currentPath === '/portal'
    ) {
      if (isClientLoggedIn) {
        return (
          <ClientPortalPage
            onLogout={handleClientLogout}
            onNavigate={navigate}
          />
        );
      }
      return (
        <ClientLoginPage
          onLoginSuccess={handleClientLoginSuccess}
          onNavigate={navigate}
        />
      );
    }

    // Public Core Pages
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath === '/services') {
      return <ServicesPage onNavigate={navigate} />;
    }

    // Featured Desktop App Route
    if (currentPath === '/services/desktop-application-development') {
      return <DesktopAppServicePage onNavigate={navigate} />;
    }

    // Sub-service detail routes
    if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/solutions') {
      return <SolutionsPage onNavigate={navigate} />;
    }

    // Portfolio removed upon request -> redirect to services
    if (currentPath === '/portfolio' || currentPath.startsWith('/portfolio/') || currentPath === '/gallery') {
      return <ServicesPage onNavigate={navigate} />;
    }

    if (currentPath === '/project-estimator') {
      return <EstimatorPage onNavigate={navigate} />;
    }

    if (currentPath === '/book-consultation') {
      return <ConsultationPage onNavigate={navigate} />;
    }

    if (currentPath === '/forgot-password' || currentPath === '/reset-password') {
      return (
        <ForgotPasswordPage
          onLoginSuccess={handleClientLoginSuccess}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/login' || currentPath === '/auth' || currentPath === '/register' || currentPath === '/signup') {
      return (
        <ClientLoginPage
          onLoginSuccess={handleClientLoginSuccess}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/book-service') {
      return <ServiceBookingPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/track-order')) {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath === '/project-intake' || currentPath === '/google-form') {
      return <ProjectIntakeFormPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/process') {
      return <ProcessPage onNavigate={navigate} />;
    }

    if (currentPath === '/pricing') {
      return <PricingPage onNavigate={navigate} />;
    }

    if (currentPath === '/blog') {
      return <BlogPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }

    // Legal routes
    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicyPage onNavigate={navigate} />;
    }

    if (currentPath === '/terms') {
      return <TermsPage onNavigate={navigate} />;
    }

    if (currentPath === '/cookie-policy') {
      return <CookiePolicyPage onNavigate={navigate} />;
    }

    if (currentPath === '/refund-policy') {
      return <RefundPolicyPage onNavigate={navigate} />;
    }

    if (currentPath === '/brand-assets' || currentPath === '/logo') {
      return <BrandAssetsPage onNavigate={navigate} />;
    }

    // Fallback 404
    return <NotFoundPage onNavigate={navigate} />;
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
        {/* Hide public Navbar and Footer on admin and client dashboard */}
        {!isAdminRoute && !isClientDashboardRoute && (
          <Navbar currentPath={currentPath} onNavigate={navigate} />
        )}

        <main className="flex-1">
          {renderCurrentPage()}
        </main>

        {!isAdminRoute && !isClientDashboardRoute && (
          <>
            <Footer onNavigate={navigate} />
            <WhatsAppButton />
          </>
        )}
      </div>
    </CurrencyProvider>
  );
}
