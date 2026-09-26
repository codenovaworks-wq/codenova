/**
 * CodeNova Privacy-First Analytics Event Tracker
 * Conforms to the Security & Privacy Document and PRD conversion tracking requirements.
 * Tracks critical conversion events without logging unnecessary PII.
 */

export type AnalyticsEvent =
  | 'lead_submit'
  | 'consultation_request'
  | 'estimator_submit'
  | 'whatsapp_click'
  | 'phone_click'
  | 'primary_cta_click'
  | 'service_view'
  | 'case_study_view'
  | 'blog_read';

interface EventProperties {
  category?: string;
  label?: string;
  value?: number;
  service?: string;
  source?: string;
}

export function trackEvent(eventName: AnalyticsEvent, properties?: EventProperties): void {
  try {
    // Custom synthetic event for browser integrations
    if (typeof window !== 'undefined') {
      const payload = {
        event: eventName,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
        ...properties,
      };

      // Push to dataLayer if GTM exists
      const w = window as any;
      if (w.dataLayer && Array.isArray(w.dataLayer)) {
        w.dataLayer.push(payload);
      }

      // Log in development for auditability
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[CodeNova Analytics] ${eventName}:`, payload);
      }
    }
  } catch {
    // Silent fail to never disrupt user experience
  }
}
