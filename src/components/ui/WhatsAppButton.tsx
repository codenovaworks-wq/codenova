import React from 'react';
import { MessageSquare } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '+916280538868',
  message = 'Hello CodeNova! I would like to discuss a software/AI development project for my business.',
}) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    trackEvent('whatsapp_click', { source: 'floating_widget' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 active:scale-95 cursor-pointer no-underline"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          Chat With Us
        </span>
      </a>
    </div>
  );
};
