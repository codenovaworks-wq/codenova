import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { CodeNovaLogo } from '../../components/brand/CodeNovaLogo';
import {
  Lock,
  Mail,
  Building2,
  Phone,
  User,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  UserCheck,
} from 'lucide-react';
import { apiClient } from '../../lib/api';

interface RoleAuthPageProps {
  initialRole?: 'client' | 'admin';
  initialMode?: 'login' | 'register';
  onClientLoginSuccess: (user: any) => void;
  onAdminLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const RoleAuthPage: React.FC<RoleAuthPageProps> = ({
  initialRole = 'client',
  initialMode = 'login',
  onClientLoginSuccess,
  onAdminLoginSuccess,
  onNavigate,
}) => {
  const [role, setRole] = useState<'client' | 'admin'>(initialRole);
  const [clientMode, setClientMode] = useState<'login' | 'register'>(initialMode);

  // Client form states
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Admin form states
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Client Login
  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !clientPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.clientLogin(clientEmail, clientPassword);
      setSuccessMsg('Authentication successful! Loading client workspace...');
      setTimeout(() => {
        onClientLoginSuccess(res.user);
      }, 350);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'Authentication failed. Please verify your credentials or click "Forgot Password".'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Client Register
  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPassword) {
      setErrorMsg('Full name, email address, and password are required.');
      return;
    }

    if (clientPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.clientRegister({
        name: clientName,
        email: clientEmail,
        password: clientPassword,
        company: clientCompany,
        phone: clientPhone,
      });
      setSuccessMsg('Account registered successfully! Accessing your client workspace...');
      setTimeout(() => {
        onClientLoginSuccess(res.user);
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check the entered information.');
    } finally {
      setIsLoading(false);
    }
  };

  // Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setErrorMsg('Please enter admin email and administrative password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.adminLogin(adminEmail, adminPassword);
      if (res.token) {
        setSuccessMsg('Admin credentials authorized! Redirecting to Control Center...');
        setTimeout(() => {
          onAdminLoginSuccess();
        }, 350);
      } else {
        setErrorMsg('Invalid administrative credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Administrative authentication failed. Access denied.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Top Brand Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CodeNovaLogo variant="dark" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Authentication Gateway
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Role-governed security architecture for CodeNova Engineering Platforms.
          </p>
        </div>

        {/* Outer Auth Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Top Role Selector Bar */}
          <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setRole('client');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'client'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Client Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Access</span>
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Feedback Notifications */}
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1">
                  <span>{errorMsg}</span>
                  {role === 'client' && clientMode === 'login' && (
                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setClientMode('register');
                          setErrorMsg(null);
                        }}
                        className="font-bold text-blue-700 hover:underline"
                      >
                        &rarr; Create New Client Account
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('/forgot-password')}
                        className="font-bold text-blue-700 hover:underline"
                      >
                        &rarr; Reset Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ================= ROLE: CLIENT ================= */}
            {role === 'client' && (
              <div>
                {/* Client Sub Tabs: Login vs Register */}
                <div className="flex border-b border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setClientMode('login');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 pb-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                      clientMode === 'login'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Client Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setClientMode('register');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 pb-3 text-xs sm:text-sm font-semibold text-center border-b-2 transition-colors cursor-pointer ${
                      clientMode === 'register'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Register New Account
                  </button>
                </div>

                {/* Sub Tab: Client Sign In */}
                {clientMode === 'login' && (
                  <form onSubmit={handleClientLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Business / Client Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@company.com"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700">
                          Password *
                        </label>
                        <button
                          type="button"
                          onClick={() => onNavigate('/forgot-password')}
                          className="text-xs text-blue-600 hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          required
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In to Client Portal'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                )}

                {/* Sub Tab: Client Register */}
                {clientMode === 'register' && (
                  <form onSubmit={handleClientRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Er. Gagandeep Singh"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Company / Business Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={clientCompany}
                          onChange={(e) => setClientCompany(e.target.value)}
                          placeholder="e.g. Punjab Agro Logistics Hub"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Official Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="client@company.com"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone / WhatsApp Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+91 6280538868"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Set Password (min 6 characters) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={clientPassword}
                          onChange={(e) => setClientPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {isLoading ? 'Creating Account...' : 'Register Client Account & Sign In'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* ================= ROLE: ADMIN ================= */}
            {role === 'admin' && (
              <div className="space-y-5">
                {/* Admin Warning Banner & 1-Click Credentials */}
                <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Restricted Executive System Access</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail('admin@codenova.tech');
                        setAdminPassword('CodeNova2026!Admin');
                      }}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold px-2 py-0.5 rounded cursor-pointer transition-colors border border-amber-400/30"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Official Admin: <code className="text-amber-300 font-mono">admin@codenova.tech</code> / <code className="text-amber-300 font-mono">CodeNova2026!Admin</code>
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Administrator Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@codenova.tech"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Admin Secret Key / Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => onNavigate('/forgot-password')}
                        className="text-xs text-slate-600 hover:underline cursor-pointer"
                      >
                        Reset Key?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={isLoading}
                    className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isLoading ? 'Verifying Admin Session...' : 'Authorize Admin Session'}
                    <KeyRound className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            )}

            {/* Direct Support */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500 text-center">
              <div>
                Technical Desk: <span className="font-semibold text-slate-800">+91 6280538868</span> | <span className="font-semibold text-slate-800">codenovaworks@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Back Link */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            &larr; Back to CodeNova Home
          </button>
        </div>
      </div>
    </div>
  );
};
