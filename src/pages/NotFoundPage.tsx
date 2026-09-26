import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Home } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <p className="text-6xl font-extrabold font-mono text-blue-600">404</p>
        <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested system endpoint or specification document does not exist or has been relocated.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('/')}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Return to Homepage
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('/services')}
          >
            View Services
          </Button>
        </div>
      </div>
    </div>
  );
};
