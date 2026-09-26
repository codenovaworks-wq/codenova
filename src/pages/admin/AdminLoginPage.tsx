import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { CodeNovaLogo } from '../../components/brand/CodeNovaLogo';
import { Lock, Mail, Shield, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your administrator email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await apiClient.adminLogin(email.trim(), password);
      if (res.token) {
        onLoginSuccess();
      } else {
        setErrorMsg('Invalid administrator credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Background radial gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CodeNovaLogo variant="light" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Restricted Command Center</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Administrator Sign In
          </h2>
          <p className="mt-1.5 text-xs text-slate-400 max-w-sm mx-auto">
            Authorized personnel only. Access engineering control center, CRM leads, billing, and system diagnostics.
          </p>
        </div>

        <div className="mt-8 bg-slate-900/90 backdrop-blur-md py-8 px-6 shadow-2xl border border-slate-800 rounded-2xl sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@codenova.tech"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Administrative Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition text-sm"
            >
              {isLoading ? 'Verifying Credentials...' : 'Sign In to Command Center'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Secure 256-bit Encrypted Session</span>
            <button
              onClick={() => onNavigate('/')}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
            >
              Public Agency Site <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
