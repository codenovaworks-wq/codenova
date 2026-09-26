// Razorpay Client SDK Loader and Checkout Orchestrator
import { apiClient } from './api';

export interface RazorpayCheckoutOptions {
  invoiceId?: string;
  orderId?: string;
  amount: number; // In Rupees (e.g. 50000)
  currency?: string; // Default 'INR'
  title?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (data: {
    paymentId: string;
    orderId: string;
    receiptNumber?: string;
    verified: boolean;
    invoice?: any;
    order?: any;
  }) => void;
  onError: (error: { code?: string; description?: string }) => void;
  onDismiss?: () => void;
}

let scriptLoadPromise: Promise<boolean> | null = null;

export const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve) => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('[Razorpay] Failed to load checkout script from Razorpay CDN');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  return scriptLoadPromise;
};

export async function launchRazorpayPayment(options: RazorpayCheckoutOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !(window as any).Razorpay) {
    options.onError({
      code: 'SCRIPT_LOAD_FAILED',
      description: 'Could not load Razorpay payment gateway. Please check your internet connection.',
    });
    return;
  }

  try {
    // 1. Create order on secure backend server
    const token = apiClient.getToken();
    const orderRes = await fetch('/api/payments/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        invoice_id: options.invoiceId,
        order_id: options.orderId,
        amount: options.amount,
        currency: options.currency || 'INR',
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.success) {
      throw new Error(orderData.error?.message || 'Failed to create payment order');
    }

    // 2. Configure Razorpay Standard Checkout
    const rzpOptions = {
      key: orderData.keyId,
      amount: orderData.amount, // in paise
      currency: orderData.currency,
      name: options.title || 'CodeNova Engineering',
      description: options.description || `Payment for Invoice #${options.invoiceId || options.orderId || 'Services'}`,
      image: '/favicon.svg',
      order_id: orderData.orderId,
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
      },
      theme: {
        color: '#2563EB', // CodeNova Primary Blue
      },
      modal: {
        ondismiss: () => {
          if (options.onDismiss) options.onDismiss();
        },
      },
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          // 3. Verify signature securely on backend
          const verifyRes = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              invoice_id: options.invoiceId,
              order_id: options.orderId,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            options.onSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              receiptNumber: verifyData.receipt_number || `RZP_${response.razorpay_payment_id}`,
              verified: true,
              invoice: verifyData.invoice,
              order: verifyData.order,
            });
          } else {
            throw new Error(verifyData.error?.message || 'Payment verification failed');
          }
        } catch (verifyErr: any) {
          options.onError({
            code: 'VERIFICATION_FAILED',
            description: verifyErr.message || 'Payment was received but verification failed.',
          });
        }
      },
    };

    const rzpInstance = new (window as any).Razorpay(rzpOptions);
    rzpInstance.on('payment.failed', function (resp: any) {
      options.onError({
        code: resp.error?.code,
        description: resp.error?.description || 'Transaction declined by payment network.',
      });
    });

    rzpInstance.open();
  } catch (err: any) {
    options.onError({
      code: 'ORDER_INIT_FAILED',
      description: err.message || 'Unable to initiate payment.',
    });
  }
}
