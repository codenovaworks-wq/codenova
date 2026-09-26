import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Download,
  Copy,
  Check,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { launchRazorpayPayment } from '../../lib/razorpay';

interface PaymentModalProps {
  orderId: string;
  orderTitle: string;
  totalAmount: number;
  depositAmount: number;
  currency?: 'INR' | 'USD';
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  onSuccess: (payment: any) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  orderId,
  orderTitle,
  totalAmount,
  depositAmount,
  currency = 'INR',
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onClose,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'RAZORPAY' | 'UPI' | 'CARD' | 'NETBANKING'>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [vpaCopied, setVpaCopied] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('7492');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Form states
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('834');
  const [cardHolder, setCardHolder] = useState(customerName || 'Gagandeep Singh');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [payerUpi, setPayerUpi] = useState(`${customerEmail.split('@')[0]}@okhdfcbank`);

  const merchantVpa = '6280538868@okaxis';
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const payAmount = depositAmount > 0 ? depositAmount : totalAmount;
  const remainingBalance = Math.max(0, totalAmount - payAmount);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setVpaCopied(true);
    setTimeout(() => setVpaCopied(false), 2500);
  };

  // Launch official Razorpay standard checkout popup
  const handlePayWithRazorpay = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      await launchRazorpayPayment({
        orderId: orderId,
        amount: payAmount,
        currency: currency,
        title: 'CodeNova Technologies',
        description: `50% Advance Booking for ${orderTitle}`,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone || '+91 6280538868',
        },
        onSuccess: (data) => {
          setIsProcessing(false);
          setPaymentResult({
            receipt_number: data.receiptNumber,
            transaction_ref: data.paymentId,
            payment_method: 'Razorpay Live Gateway',
            order: data.order,
          });
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess(data);
          }, 2000);
        },
        onError: (err) => {
          setIsProcessing(false);
          setPaymentError(err.description || 'Payment was not completed. Please try again.');
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err.message || 'Could not launch payment gateway.');
    }
  };

  const handleInitiatePayment = () => {
    if (selectedMethod === 'RAZORPAY') {
      handlePayWithRazorpay();
      return;
    }
    if (selectedMethod === 'CARD') {
      setOtpStep(true);
      return;
    }
    executeManualPayment();
  };

  const executeManualPayment = async () => {
    setPaymentError(null);
    setIsProcessing(true);
    try {
      const res = await apiClient.processPayment({
        order_id: orderId,
        amount: payAmount,
        payment_method: selectedMethod,
        currency,
        payer_vpa: selectedMethod === 'UPI' ? payerUpi : undefined,
        payer_email: customerEmail,
      });

      if (res.success) {
        setPaymentResult(res);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess(res.payment);
        }, 1800);
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment processing encountered an error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReceipt = () => {
    const text = `
==================================================
           CODENOVA TECHNOLOGIES
      OFFICIAL PAYMENT RECEIPT & TAX INVOICE
==================================================
Receipt No:     ${paymentResult?.receipt_number || 'REC-CN-2026-LIVE'}
Transaction ID: ${paymentResult?.transaction_ref || 'TXN_CN_LIVE'}
Date & Time:    ${new Date().toLocaleString()}
Merchant:       CodeNova Software Development
Location:       Harike Kalan, Sri Muktsar Sahib, 152025, Punjab
Contact:        +91 6280538868 | codenovaworks@gmail.com
--------------------------------------------------
Customer:       ${customerName}
Email:          ${customerEmail}
Phone:          ${customerPhone || '+91 6280538868'}
Order ID:       ${orderId}
Project:        ${orderTitle}
Payment Method: ${paymentResult?.payment_method || selectedMethod}
--------------------------------------------------
Total Project:  ${currencySymbol} ${totalAmount.toLocaleString()}
Amount Paid:    ${currencySymbol} ${payAmount.toLocaleString()} (50% Milestone 1 Advance)
Balance Due:    ${currencySymbol} ${remainingBalance.toLocaleString()} (Milestone 2 - On Handover)
Status:         VERIFIED & PAID (SUCCESS)
==================================================
Thank you for partnering with CodeNova!
Access Client Workspace at: https://codenova.tech/client
==================================================
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CodeNova-Receipt-${orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
              CN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">CodeNova Payment Gateway</span>
                <span className="text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">Harike Kalan, Sri Muktsar Sahib (Punjab)</p>
            </div>
          </div>
          {!isSuccess && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 50/50 Milestone Structure Indicator */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 text-white border-b border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Transparent 50/50 Milestone Protection
            </span>
            <span className="text-xs font-mono font-bold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">
              Order: {orderId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/10 rounded-xl p-3 border border-white/15">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Milestone 1 (Payable Now)
              </div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {currencySymbol}{payAmount.toLocaleString()}
              </div>
              <p className="text-[10px] text-blue-200 mt-0.5">50% Advance to start design & engineering</p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                <Clock className="w-3.5 h-3.5" /> Milestone 2 (On Handover)
              </div>
              <div className="text-xl font-bold font-mono text-slate-200 mt-1">
                {currencySymbol}{remainingBalance.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5">Pay in Client Portal after 100% completion</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Milestone 1 Advance Received!</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Your 50% advance deposit of{' '}
                <strong className="text-slate-900 font-mono">
                  {currencySymbol}{payAmount.toLocaleString()}
                </strong>{' '}
                has been verified. Project engineering is officially activated!
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-bold text-slate-900">{paymentResult?.transaction_ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Number:</span>
                <span className="font-bold text-slate-900">{paymentResult?.receipt_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone 1 (50% Advance):</span>
                <span className="font-bold text-emerald-600">PAID & SETTLED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone 2 (50% Final):</span>
                <span className="font-bold text-amber-600 font-mono">
                  {currencySymbol}{remainingBalance.toLocaleString()} (Pending on Handover)
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5">
                <span className="text-slate-500">Client Portal Access:</span>
                <span className="font-bold text-blue-600">Active (Credentials created)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={downloadReceipt}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Official Receipt
              </button>
              <button
                type="button"
                onClick={() => onSuccess(paymentResult)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                Open Client Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : otpStep ? (
          /* OTP Simulation for 3D Secure */
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3D Secure Card Verification</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                A one-time security password has been sent to your registered mobile number for{' '}
                <strong className="text-slate-800">
                  {currencySymbol}{payAmount.toLocaleString()}
                </strong>
                .
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <label className="text-xs font-semibold text-slate-700 block text-center">
                Enter 4-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={4}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full text-center tracking-widest text-2xl font-mono py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-center text-slate-400">
                Demo Test OTP: <span className="font-mono font-bold text-slate-700">7492</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={executeManualPayment}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? 'Verifying...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        ) : (
          /* Payment Method Selection */
          <div className="p-6 space-y-5">
            {/* Method Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedMethod('RAZORPAY')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedMethod === 'RAZORPAY'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Razorpay
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedMethod === 'UPI'
                    ? 'bg-white text-blue-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" /> UPI QR
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('CARD')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedMethod === 'CARD'
                    ? 'bg-white text-blue-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" /> Cards
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('NETBANKING')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  selectedMethod === 'NETBANKING'
                    ? 'bg-white text-blue-600 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> NetBank
              </button>
            </div>

            {/* TAB 1: RAZORPAY LIVE GATEWAY (RECOMMENDED) */}
            {selectedMethod === 'RAZORPAY' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Razorpay Instant Checkout
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pay 50% advance ({currencySymbol}{payAmount.toLocaleString()}) via Google Pay, PhonePe, Paytm, all Credit/Debit cards (Visa, Mastercard, RuPay), NetBanking, or Wallet.
                  </p>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">
                      ⚡ Google Pay
                    </span>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">
                      ⚡ PhonePe
                    </span>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">
                      ⚡ Paytm
                    </span>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">
                      💳 Visa / Mastercard / RuPay
                    </span>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">
                      🏛️ 50+ Banks
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Remaining 50% Balance ({currencySymbol}{remainingBalance.toLocaleString()}):</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Will be held pending in your Client Portal. You only pay it after your service is fully delivered, tested, and handed over to you.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UPI / QR CODE */}
            {selectedMethod === 'UPI' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                        `upi://pay?pa=${merchantVpa}&pn=CodeNova+Technologies&am=${payAmount}&cu=INR`
                      )}`}
                      alt="CodeNova UPI QR Code"
                      className="w-28 h-28"
                    />
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <p className="text-xs font-bold text-slate-900">
                      Scan & Pay with Any UPI App
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Google Pay, PhonePe, Paytm, BHIM, CRED
                    </p>

                    <div className="flex items-center gap-1.5 justify-center sm:justify-start pt-1">
                      <span className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-800 font-bold">
                        {merchantVpa}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVpa}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded border border-blue-200 bg-blue-50 cursor-pointer"
                      >
                        {vpaCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {vpaCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Or Enter Your UPI ID (VPA):
                  </label>
                  <input
                    type="text"
                    value={payerUpi}
                    onChange={(e) => setPayerUpi(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: DEBIT / CREDIT CARD */}
            {selectedMethod === 'CARD' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-600 font-mono">VISA / RuPay</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full text-xs font-mono px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: NETBANKING */}
            {selectedMethod === 'NETBANKING' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Select Your Bank
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors cursor-pointer ${
                        selectedBank === b
                          ? 'border-blue-600 bg-blue-50 text-blue-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
                <span>{paymentError}</span>
                <button
                  type="button"
                  onClick={() => setPaymentError(null)}
                  className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleInitiatePayment}
                disabled={isProcessing}
                className="w-full py-4 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Connecting to Razorpay...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay 50% Advance ({currencySymbol}{payAmount.toLocaleString()}) via Razorpay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                RBI Authorized Razorpay Live Gateway • Instant Bank Settlement
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
