import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <button
        onClick={() => onNavigate('/')}
        className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
      </button>

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Last Updated: January 15, 2025
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
        <p>
          At <strong>CodeNova</strong> ("we," "our," or "us"), we take data security and privacy seriously. This Privacy Policy describes how we collect, use, and protect your information when you visit our website (codenova.tech), use our project estimator, submit contact inquiries, or book technical consultations.
        </p>

        <h3 className="text-lg font-bold text-slate-900">1. Information We Collect</h3>
        <p>
          We only collect personal information that you voluntarily provide to us when submitting inquiries, booking consultations, or utilizing our project scoping tools:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Contact Details:</strong> Full name, business email address, phone number, and organization name.</li>
          <li><strong>Project Specifications:</strong> Target platform, project requirements, budget indications, and technical notes.</li>
          <li><strong>Technical Metadata:</strong> Anonymized event interaction data, browser user agents, and IP addresses for security auditing.</li>
        </ul>

        <h3 className="text-lg font-bold text-slate-900">2. How We Use Your Information</h3>
        <p>
          We process your information strictly for legitimate business purposes:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>To prepare technical proposals, architectural evaluations, and project estimates.</li>
          <li>To schedule and conduct 30-minute discovery video conferences.</li>
          <li>To enforce our mutual non-disclosure and intellectual property obligations.</li>
          <li>To defend against spam, bot traffic, and unauthorized access attempts.</li>
        </ul>

        <h3 className="text-lg font-bold text-slate-900">3. Non-Disclosure & Confidentiality</h3>
        <p>
          All project ideas, proprietary workflow descriptions, diagrams, and corporate information submitted to CodeNova are treated with strict confidentiality under our standard bilateral non-disclosure agreement. We never sell, rent, or trade your data to third-party advertisers.
        </p>

        <h3 className="text-lg font-bold text-slate-900">4. Data Retention & Your Rights</h3>
        <p>
          You may request an export or complete deletion of your submitted project specifications and contact records at any time by emailing us at <a href="mailto:privacy@codenova.tech" className="text-blue-600 underline">privacy@codenova.tech</a>.
        </p>
      </div>
    </div>
  );
};
