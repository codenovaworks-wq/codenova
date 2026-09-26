import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface RefundPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onNavigate }) => {
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
          Refund Policy
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Last Updated: January 15, 2025
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
        <p>
          Software engineering services at CodeNova are delivered in progressive milestone sprints. Payment schedules align with defined deliverable approvals (Discovery, Architecture, Design Prototype, Staging Beta, Production Deployment).
        </p>
        <p>
          Clients review and approve each sprint deliverable prior to releasing subsequent milestone funding. If a client terminates an engagement during an active sprint, any unutilized milestone deposits are returned in accordance with the signed Master Services Agreement (MSA).
        </p>
      </div>
    </div>
  );
};
