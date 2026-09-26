import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { CodeNovaLogo } from '../../components/brand/CodeNovaLogo';
import {
  Lock,
  Mail,
  Building2,
  Phone,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../lib/api';

interface ClientLoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (path: string) => void;
}

export const ClientLoginPage: React.FC<ClientLoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Client form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Client Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.clientLogin(email.trim(), password);
      setSuccessMsg('Signed in successfully! Loading your client workspace...');
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 350);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'Authentication failed. Please check your credentials or create an account.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Client Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Full name, email address, and password are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.clientRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        company: company.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setSuccessMsg('Account registered successfully! Accessing your client workspace...');
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please verify the entered information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 bg-slate-50 flex items-center justify-center font-sans">
      <div className="max-w-md w-full">
        {/* Top Brand Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <CodeNovaLogo variant="dark" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>CodeNova Client Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Client Workspace Sign In' : 'Create Client Account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access project milestones, review sprint deliverables, and manage invoices.
          </p>
        </div>

        {/* Outer Auth Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
          {/* Tab Switcher: Sign In vs Create Account */}
          <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Create Account</span>
            </button>
          </div>

          <div className="p-6 md:p-8">
            {/* Notifications */}
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <div className="flex-1">
                  <span>{errorMsg}</span>
                  {mode === 'login' && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register');
                          setErrorMsg(null);
                        }}
                        className="font-bold text-blue-700 hover:underline"
                      >
                        &rarr; New client? Create your account here
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Business / Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  {isLoading ? 'Signing In...' : 'Sign In to Client Workspace'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jaswinder Singh"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Business / Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Company / Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corporation Ltd."
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
        </div>

        {/* Footer Help text */}
        <div className="text-center mt-6">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800 transition"
          >
            &larr; Back to CodeNova Home
          </button>
        </div>
      </div>
    </div>
  );
};
