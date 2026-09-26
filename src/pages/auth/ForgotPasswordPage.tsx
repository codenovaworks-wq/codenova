import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { apiClient } from '../../lib/api';

interface ForgotPasswordPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onLoginSuccess,
  onNavigate,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [resetPin, setResetPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Step 1: Request Reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.forgotPassword(email);
      setSuccessMsg(res.message || 'Verification PIN generated.');
      if (res.reset_pin) {
        setResetPin(res.reset_pin);
      }
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initialize password reset. Please verify your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await apiClient.resetPassword(email, newPassword, resetPin);
      setSuccessMsg('Password updated successfully! Signing you into your workspace...');
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-14 px-4 bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Top Trust Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            CodeNova Account Recovery Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Enter your registered email address to receive a secure recovery PIN and set a new password.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8">
          {/* Step Progress Tracker */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                1
              </span>
              <span className={`text-xs font-semibold ${step === 1 ? 'text-blue-600' : 'text-slate-600'}`}>
                Verify Email
              </span>
            </div>
            <div className="h-0.5 w-12 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
              <span className={`text-xs font-semibold ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                Set Password
              </span>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Works for both Client Accounts and CodeNova Admin credentials.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isLoading ? 'Generating Recovery Code...' : 'Send Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* STEP 2: Enter PIN & Set New Password */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                <span className="font-bold">Recovery Token Sent:</span> A verification PIN was created for <code className="font-semibold text-blue-700">{email}</code>.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Verification Security PIN *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={resetPin}
                    onChange={(e) => setResetPin(e.target.value)}
                    placeholder="6-digit PIN"
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono tracking-wider border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  New Password (min 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Back
                </button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isLoading ? 'Updating Password...' : 'Save Password & Sign In'}
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Direct Support */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Need urgent assistance? Call our Engineering Desk directly at{' '}
            <a href="tel:+916280538868" className="font-bold text-slate-800 hover:text-blue-600">
              +91 6280538868
            </a>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => onNavigate('/client')}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
