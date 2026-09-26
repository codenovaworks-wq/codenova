import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'INR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  currencySymbol: string;
  formatPrice: (inrAmount: number, explicitUsdAmount?: number) => string;
  exchangeRate: number; // INR per 1 USD
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'INR',
  setCurrency: () => {},
  currencySymbol: '₹',
  formatPrice: () => '',
  exchangeRate: 86,
});

const CURRENCY_KEY = 'codenova_selected_currency';
const USD_EXCHANGE_RATE = 86; // 1 USD = 86 INR standard reference

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CURRENCY_KEY) as Currency;
      if (saved === 'INR' || saved === 'USD') return saved;
      // Auto-detect based on locale / timezone if not Indian timezone
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone && !timeZone.includes('Calcutta') && !timeZone.includes('Kolkata') && !timeZone.includes('Asia/Colombo')) {
          return 'USD';
        }
      } catch (e) {
        // fallback
      }
    }
    return 'INR';
  });

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENCY_KEY, curr);
    }
  };

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const formatPrice = (inrAmount: number, explicitUsdAmount?: number): string => {
    if (currency === 'INR') {
      return `₹${Math.round(inrAmount).toLocaleString('en-IN')}`;
    } else {
      const usdValue = explicitUsdAmount !== undefined ? explicitUsdAmount : Math.round(inrAmount / USD_EXCHANGE_RATE);
      return `$${Math.round(usdValue).toLocaleString('en-US')}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencySymbol,
        formatPrice,
        exchangeRate: USD_EXCHANGE_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

export interface CurrencySwitcherProps {
  className?: string;
  variant?: 'light' | 'dark' | 'hero';
  size?: 'sm' | 'md' | 'lg';
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
}) => {
  const { currency, setCurrency } = useCurrency();

  const isDark = variant === 'dark' || variant === 'hero';

  const containerClasses = isDark
    ? 'bg-slate-900/90 border border-slate-700/80 shadow-inner'
    : 'bg-slate-100 border border-slate-200/90 shadow-2xs';

  const activeClasses = isDark
    ? 'bg-blue-600 text-white shadow-sm font-semibold'
    : 'bg-white text-slate-950 shadow-xs font-semibold border border-slate-200';

  const inactiveClasses = isDark
    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50';

  const sizeClasses =
    size === 'lg'
      ? 'px-4 py-2 text-sm gap-2'
      : size === 'sm'
      ? 'px-2.5 py-1 text-xs gap-1.5'
      : 'px-3 py-1.5 text-xs sm:text-sm gap-1.5';

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl transition-all ${containerClasses} ${className}`}
      role="group"
      aria-label="Select pricing currency"
    >
      <button
        type="button"
        onClick={() => setCurrency('INR')}
        className={`flex items-center rounded-lg transition-all cursor-pointer ${sizeClasses} ${
          currency === 'INR' ? activeClasses : inactiveClasses
        }`}
        aria-pressed={currency === 'INR'}
      >
        <span className="text-base leading-none">🇮🇳</span>
        <span className="tracking-tight">India — INR (₹)</span>
      </button>
      <button
        type="button"
        onClick={() => setCurrency('USD')}
        className={`flex items-center rounded-lg transition-all cursor-pointer ${sizeClasses} ${
          currency === 'USD' ? activeClasses : inactiveClasses
        }`}
        aria-pressed={currency === 'USD'}
      >
        <span className="text-base leading-none">🌎</span>
        <span className="tracking-tight">International — USD ($)</span>
      </button>
    </div>
  );
};
