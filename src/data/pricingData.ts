export interface PricingPackage {
  id: string;
  name: string;
  category: string;
  description: string;
  priceINR: number;
  priceUSD: number;
  period: string; // e.g. "/ project" or "/ month"
  popular?: boolean;
  badge?: string;
  timeline?: string;
  idealFor?: string[];
  features: string[];
  ctaText?: string;
  ctaType?: 'engineer' | 'get-started' | 'quote';
  ctaAction?: string; // route path
  secondaryCtaText?: string;
  secondaryCtaAction?: string;
}

export interface PricingCategory {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  notice?: string;
  isFlagship?: boolean;
  packages: PricingPackage[];
}

export interface AddOnItem {
  id: string;
  title: string;
  priceINR: number;
  priceUSD: number;
  description: string;
  deliverables: string;
}

export interface CentralPricingConfig {
  meta: {
    agencyName: string;
    tagline: string;
    subtagline: string;
    footnote: string;
    startingFromLabel: string;
  };
  categories: PricingCategory[];
  retainers: PricingPackage[];
  addOns: AddOnItem[];
  customProjectCta: {
    title: string;
    description: string;
    disclaimer: string;
    primaryButton: { label: string; path: string };
    secondaryButton: { label: string; path: string };
  };
}

/**
 * =====================================================================
 * CENTRAL PRICING CONFIGURATION OBJECT
 * Edit prices, features, timelines, or copy in one single place.
 * =====================================================================
 */
export const pricingConfig: CentralPricingConfig = {
  meta: {
    agencyName: 'CodeNova',
    tagline: 'Built for businesses that need more than a template.',
    subtagline:
      'Engineering solutions around your business. From early validation MVPs to high-concurrency, enterprise-scale platforms.',
    footnote:
      'Final pricing depends on project scope, features, integrations and complexity.',
    startingFromLabel: 'Starting from',
  },

  categories: [
    // -------------------------------------------------------------
    // 6. CUSTOM SOFTWARE & SAAS (FLAGSHIP HIGH-TICKET SERVICE)
    // -------------------------------------------------------------
    {
      id: 'custom-software-saas',
      name: 'Custom Software & SaaS Development',
      shortName: 'Custom Software & SaaS',
      badge: 'Flagship Core Service',
      isFlagship: true,
      description:
        'Mission-critical bespoke software, high-performance SaaS applications, and enterprise digital infrastructure engineered for scalability and longevity.',
      packages: [
        {
          id: 'starter-mvp',
          name: 'Starter MVP',
          category: 'Custom Software & SaaS',
          description:
            'Ideal for startups, MVP validation, internal business tools, and focused single-market platforms requiring fast, resilient execution.',
          priceINR: 195000,
          priceUSD: 3999,
          period: '/ project',
          timeline: '3 – 5 Weeks',
          badge: 'Rapid Validation',
          idealFor: [
            'Early-stage tech startups',
            'MVP product validation',
            'Internal ops & business tools',
            'Focused SaaS platforms',
          ],
          features: [
            'Complete functional MVP with clean modular code',
            'Modular, extensible architectural framework',
            'Secure authentication & role-based access control (RBAC)',
            'Relational database schema & persistence layer',
            'Custom administrative dashboard & operational views',
            'Third-party REST API integration & webhooks',
            'Automated CI/CD build & cloud deployment pipeline',
            'Full source code transfer & 100% IP ownership',
            'Automated end-to-end testing suite',
            '30-day post-launch critical bug fix warranty',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'standard-business-suite',
          name: 'Standard Business Suite',
          category: 'Custom Software & SaaS',
          description:
            'Engineered for growing businesses, funded startups, and mission-critical multi-entity platforms requiring robust security and deep integrations.',
          priceINR: 390000,
          priceUSD: 7999,
          period: '/ project',
          popular: true,
          timeline: '6 – 10 Weeks',
          badge: 'MOST POPULAR',
          idealFor: [
            'Funded startups',
            'Scaling commercial SaaS',
            'Multi-branch business operations',
            'Automated transaction engines',
          ],
          features: [
            'Advanced business logic & multi-entity database architecture',
            'Advanced administrative management dashboard with metrics',
            'Comprehensive authentication & multi-factor authorization',
            'End-to-end payment gateway & subscription billing engine',
            'Bi-directional third-party API integrations & queues',
            'Production cloud infrastructure provisioning (AWS / GCP)',
            'Automated regression & security vulnerability testing',
            'Security hardening (OWASP standards & rate limiting)',
            'System telemetry, logging, and health monitoring',
            'Architecture diagrams & comprehensive technical documentation',
            '60-day post-launch warranty with priority SLA support',
            'Weekly sprint reviews & direct lead engineer access',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'enterprise-custom-scale',
          name: 'Enterprise / Custom Scale',
          category: 'Custom Software & SaaS',
          description:
            'Engineered for enterprise institutions, multi-tenant enterprise platforms, high-throughput distributed systems, and complex regulated domains.',
          priceINR: 690000,
          priceUSD: 14999,
          period: '/ project',
          timeline: '10 – 16 Weeks',
          badge: 'High Concurrency',
          idealFor: [
            'Enterprise corporations',
            'Multi-tenant B2B SaaS',
            'High transaction volume systems',
            'Complex regulatory & institutional platforms',
          ],
          features: [
            'Dedicated senior engineering pod with full-stack architects',
            'Advanced distributed microservices or modular monolith architecture',
            'Multi-tenant data isolation & partition capabilities',
            'High availability clustering & failover redundancy',
            'Enterprise SSO (SAML 2.0, Okta, Azure AD) integration',
            'Database clustering, caching (Redis), & performance indexing',
            'Comprehensive backup, failover & disaster recovery drill',
            'Enterprise CI/CD deployment automation & staging environments',
            'Deep third-party enterprise ERP/CRM system integrations',
            'Penetration testing & OWASP compliance audit report',
            '90-day comprehensive SLA support & guaranteed response hotline',
            'Executive weekly governance & sprint steering meetings',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
      ],
    },

    // -------------------------------------------------------------
    // 4. AI AGENTS & AUTOMATION (PREMIUM AI SERVICE)
    // -------------------------------------------------------------
    {
      id: 'ai-agents-automation',
      name: 'AI Agents & Intelligent Automation',
      shortName: 'AI Agents & Automation',
      badge: 'Autonomous Intelligence',
      description:
        'Production-grade autonomous AI agents, multi-agent systems, conversational voice intelligence, and deterministic workflow automations.',
      notice:
        'Third-party LLM & cloud API usage fees (OpenAI, Anthropic, Gemini, Twilio, etc.) are billed directly to client accounts unless specifically scoped in the proposal.',
      packages: [
        {
          id: 'ai-chatbot',
          name: 'AI Business Chatbot',
          category: 'AI Agents & Automation',
          description:
            'Domain-trained conversational AI assistant with custom knowledge grounding, intent routing, and brand voice alignment.',
          priceINR: 50000,
          priceUSD: 999,
          period: '/ project',
          timeline: '2 – 3 Weeks',
          features: [
            'Custom knowledge retrieval (RAG) on company documentation',
            'Context-aware intent classification & fallback handlers',
            'Multi-channel web widget with custom branding',
            'CRM & lead qualification pipeline integration',
            'Real-time conversation history & admin analytics dashboard',
            'Strict hallucination guardrails & safety policies',
            'Cloud serverless deployment & 30-day warranty',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'ai-business-agent',
          name: 'AI Business Agent',
          category: 'AI Agents & Automation',
          description:
            'Autonomous action-taking agent capable of executing operational workflows, processing files, and synchronizing business tools.',
          priceINR: 100000,
          priceUSD: 1999,
          period: '/ project',
          timeline: '3 – 5 Weeks',
          features: [
            'Autonomous tool-calling & reasoning engine',
            'Integration with CRM, Google Workspace, and email systems',
            'Document analysis, PDF extraction, and structured parsing',
            'Automated workflow triggers via webhooks & schedules',
            'Admin control center with audit logs & execution approval modes',
            'OpenAI / Anthropic / Gemini model orchestration',
            'Custom security boundary & access permissions',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'ai-voice-agent',
          name: 'AI Voice Agent',
          category: 'AI Agents & Automation',
          description:
            'Real-time conversational voice agent with ultra-low latency, dynamic speech synthesis, telephony routing, and IVR replacement.',
          priceINR: 150000,
          priceUSD: 2999,
          period: '/ project',
          timeline: '4 – 6 Weeks',
          features: [
            'Real-time duplex conversational voice streaming',
            'Telephony & VoIP integration (Twilio / SIP trunking)',
            'Natural speech recognition & emotion-tuned voice cloning',
            'Automated appointment booking & lead intake during calls',
            'Instant call summarization & structured CRM data extraction',
            'Warm transfer protocol to human representatives',
            'Call recording storage & compliance encryption',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'ai-automation-system',
          name: 'AI Automation System',
          category: 'AI Agents & Automation',
          description:
            'Comprehensive automated business workflow infrastructure connecting APIs, databases, message queues, and AI models.',
          priceINR: 250000,
          priceUSD: 4999,
          period: '/ project',
          popular: true,
          badge: 'High ROI',
          timeline: '6 – 8 Weeks',
          features: [
            'Multi-step intelligent business pipeline automation',
            'Bi-directional sync between databases, ERPs, and external APIs',
            'WhatsApp, Slack, and email conversational automation nodes',
            'Automated invoice, contract, and document verification',
            'Event-driven worker queues with failover retry policies',
            'Real-time monitoring dashboard with error alerting',
            '60-day engineering warranty & performance tuning',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'custom-multi-agent-platform',
          name: 'Custom Multi-Agent Platform',
          category: 'AI Agents & Automation',
          description:
            'Cooperative multi-agent swarm architecture where specialized autonomous agents collaborate to execute complex enterprise operations.',
          priceINR: 500000,
          priceUSD: 9999,
          period: '/ project',
          timeline: '8 – 14 Weeks',
          badge: 'Enterprise AI',
          features: [
            'Multi-agent hierarchical architecture (Supervisor & Workers)',
            'Vector database clustering with hybrid semantic search',
            'Custom evaluation pipelines & automated benchmark testing',
            'Deep enterprise database & proprietary software integrations',
            'Role-based governance, safety filtering & deterministic guardrails',
            'Containerized on-premise or sovereign cloud deployment',
            'Dedicated AI lead engineer & executive milestone presentations',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
      ],
    },

    // -------------------------------------------------------------
    // 2. WEB APPLICATION DEVELOPMENT
    // -------------------------------------------------------------
    {
      id: 'web-application-development',
      name: 'Web Application Development',
      shortName: 'Web Applications',
      badge: 'Full-Stack Engineering',
      description:
        'Tailored cloud web applications engineered with contemporary full-stack architectures, high responsiveness, and rigorous security.',
      packages: [
        {
          id: 'business-web-app',
          name: 'Business Web Application',
          category: 'Web Application Development',
          description:
            'Custom web software designed to streamline specific operational workflows, team management, or customer portals.',
          priceINR: 125000,
          priceUSD: 2499,
          period: '/ project',
          timeline: '3 – 5 Weeks',
          features: [
            'Responsive full-stack React / Node.js architecture',
            'Secure user authentication & session management',
            'Role-based access control (Admin, Staff, Customer)',
            'Structured SQL / PostgreSQL database design',
            'Operational admin dashboard & reporting',
            'Payment gateway & transactional notifications',
            'Cloud deployment with automated SSL & domain setup',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'advanced-web-app',
          name: 'Advanced Web Application',
          category: 'Web Application Development',
          description:
            'Scalable cloud applications featuring complex business logic, asynchronous worker jobs, and real-time state synchronization.',
          priceINR: 250000,
          priceUSD: 4999,
          period: '/ project',
          popular: true,
          badge: 'Most Popular',
          timeline: '5 – 8 Weeks',
          features: [
            'Microservices or clean modular monolith architecture',
            'Multi-role permissions with fine-grained policy control',
            'Optimized relational database with indexing & caching',
            'Real-time WebSocket event streaming & notifications',
            'Automated payment & recurring invoice workflows',
            'Custom RESTful API endpoints & OpenAPI documentation',
            'Telemetry dashboard, audit logging, & error tracking',
            'Automated CI/CD deployment to AWS / GCP',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'professional-web-platform',
          name: 'Professional Web Platform',
          category: 'Web Application Development',
          description:
            'Robust multi-stakeholder platform engineered for high transaction volume, large catalogs, or collaborative team tools.',
          priceINR: 400000,
          priceUSD: 7999,
          period: '/ project',
          timeline: '8 – 12 Weeks',
          features: [
            'High-throughput asynchronous processing with Redis queues',
            'Comprehensive admin portal with advanced query engines',
            'Multi-tenant database schema architecture',
            'Third-party ERP, CRM, and accounting integrations',
            'Automated testing suites (Unit, Integration, E2E)',
            'Security hardening against OWASP vulnerabilities',
            'Containerized Docker orchestration & staging environment',
            '60-day post-handover engineering warranty',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'enterprise-web-platform',
          name: 'Enterprise Web Platform',
          category: 'Web Application Development',
          description:
            'Custom enterprise-grade software engineered with distributed infrastructure, high availability, and institutional SLA compliance.',
          priceINR: 750000,
          priceUSD: 14999,
          period: '/ project',
          timeline: '12 – 18 Weeks',
          badge: 'Enterprise Grade',
          features: [
            'Dedicated engineering pod with solutions architect',
            'Multi-region high availability & auto-scaling clusters',
            'Enterprise Single Sign-On (SSO / SAML / OAuth 2.0)',
            'Custom data encryption at rest and in transit',
            'Comprehensive audit trails & compliance readiness',
            'Disaster recovery planning with automated snapshots',
            'Load testing under heavy concurrency scenarios',
            '90-day comprehensive SLA support & warranty',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
      ],
    },

    // -------------------------------------------------------------
    // 3. MOBILE APP DEVELOPMENT
    // -------------------------------------------------------------
    {
      id: 'mobile-app-development',
      name: 'Mobile App Development',
      shortName: 'Mobile Apps',
      badge: 'iOS & Android Engineering',
      description:
        'Native and cross-platform mobile applications engineered for peak responsiveness, intuitive user journeys, and robust cloud backends.',
      packages: [
        {
          id: 'professional-mobile-app',
          name: 'Professional Mobile App',
          category: 'Mobile App Development',
          description:
            'Clean cross-platform mobile application providing seamless customer experiences for Android and iOS devices.',
          priceINR: 100000,
          priceUSD: 1999,
          period: '/ project',
          timeline: '4 – 6 Weeks',
          features: [
            'Cross-platform React Native / Flutter codebase',
            'Native iOS & Android compatibility and compilation',
            'Secure authentication (Email, Google, Phone OTP)',
            'Cloud database schema & REST API backend',
            'Push notification infrastructure setup',
            'Light/Dark mode responsive UI execution',
            'App Store and Google Play publishing assistance',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'business-mobile-app',
          name: 'Business Mobile App',
          category: 'Mobile App Development',
          description:
            'Feature-rich mobile platform with offline-first synchronization, payment checkouts, and an administrative control web dashboard.',
          priceINR: 200000,
          priceUSD: 3999,
          period: '/ project',
          popular: true,
          badge: 'Most Popular',
          timeline: '6 – 9 Weeks',
          features: [
            'iOS & Android native deployment packages',
            'Integrated in-app payment gateway & digital receipts',
            'Geolocation, interactive maps & navigation tracking',
            'Offline data caching with automated sync engine',
            'Dedicated web-based administrative management dashboard',
            'Automated push notification sequences & user segments',
            'App store compliance and review guarantee',
            '45-day warranty & maintenance SLA',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'advanced-mobile-platform',
          name: 'Advanced Mobile Platform',
          category: 'Mobile App Development',
          description:
            'Sophisticated dual-app ecosystem (e.g., Customer + Driver/Vendor) with live GPS streaming, real-time chats, and automated dispatch.',
          priceINR: 350000,
          priceUSD: 6999,
          period: '/ project',
          timeline: '9 – 14 Weeks',
          features: [
            'Dual-sided application suite (User App + Partner/Provider App)',
            'Real-time bidirectional WebSocket communication & live chat',
            'High-frequency GPS tracking & route calculation algorithms',
            'Integrated wallet, escrow, or multi-split payouts',
            'Advanced administrative operations portal with analytics',
            'Automated background jobs and push notification channels',
            'Load testing under concurrent active user streams',
            '60-day post-launch warranty with priority triage',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'enterprise-mobile-application',
          name: 'Enterprise Mobile Application',
          category: 'Mobile App Development',
          description:
            'Mission-critical enterprise mobile infrastructure with offline security, hardware integrations, MDM support, and dedicated cloud scale.',
          priceINR: 600000,
          priceUSD: 11999,
          period: '/ project',
          timeline: '14 – 20 Weeks',
          badge: 'Enterprise Grade',
          features: [
            'Dedicated engineering pod with mobile lead architect',
            'Hardware integrations (Bluetooth LE, RFID, Barcode, Thermal)',
            'Mobile Device Management (MDM) & corporate policy security',
            'End-to-end encrypted local storage & secure keystore',
            'High availability backend with microservices clustering',
            'Automated CI/CD build distribution via Fastlane / TestFlight',
            'Comprehensive penetration test & security certification',
            '90-day comprehensive SLA support & warranty',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
      ],
    },

    // -------------------------------------------------------------
    // 1. WEBSITE DEVELOPMENT
    // -------------------------------------------------------------
    {
      id: 'website-development',
      name: 'Website Development',
      shortName: 'Website Development',
      badge: 'High Performance & Conversion',
      description:
        'Bespoke digital flagships engineered for speed, search dominance, conversion architecture, and impeccable brand authority.',
      packages: [
        {
          id: 'professional-website',
          name: 'Professional Website',
          category: 'Website Development',
          description:
            'Tailor-made multi-page marketing website built with clean code, lightning speed, and strategic conversion callouts.',
          priceINR: 45000,
          priceUSD: 999,
          period: '/ project',
          timeline: '1 – 2 Weeks',
          features: [
            'Bespoke custom UI/UX design (No generic templates)',
            '100% responsive layout across mobile, tablet, and desktop',
            'Headless CMS integration for effortless content editing',
            'Interactive contact forms with spam protection & email alerts',
            'Instant WhatsApp click-to-chat integration',
            'Interactive Google Maps integration',
            'Google Analytics 4 & Meta Pixel event setup',
            'Technical on-page SEO optimization & metadata schema',
            'Sub-second page load performance optimization',
            'Production deployment with automated SSL certificate',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'business-website',
          name: 'Business Website',
          category: 'Website Development',
          description:
            'Comprehensive corporate website featuring dynamic service catalogs, case studies, automated scheduling, and CRM capture.',
          priceINR: 75000,
          priceUSD: 1499,
          period: '/ project',
          popular: true,
          badge: 'Most Popular',
          timeline: '2 – 3 Weeks',
          features: [
            'Complete custom branding & high-conversion UI/UX design',
            'Dynamic CMS for case studies, team profiles, and services',
            'Integrated appointment scheduling & calendar synchronization',
            'Direct CRM & lead pipeline integration (HubSpot / Notion / Sheets)',
            'Multi-step intake questionnaire & proposal request forms',
            'Interactive animations & micro-interactions',
            'Comprehensive technical SEO architecture & XML sitemaps',
            'Global CDN caching with 95+ Google PageSpeed score',
            '30-day post-launch support & content management training',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'premium-business-website',
          name: 'Premium Business Website',
          category: 'Website Development',
          description:
            'High-impact interactive web experience with custom calculators, multi-language localization, and dynamic asset delivery.',
          priceINR: 125000,
          priceUSD: 2499,
          period: '/ project',
          timeline: '3 – 5 Weeks',
          features: [
            'Elite art direction, custom illustrations & motion engineering',
            'Interactive calculators, estimators, or product configurators',
            'Multi-language localization (i18n) framework',
            'Advanced headless CMS architecture with draft preview workflows',
            'Third-party API integrations & dynamic live data feeds',
            'Enterprise-grade SEO architecture & programmatic landing pages',
            'Automated security headers, CSP, and firewall rules',
            '45-day warranty with dedicated lead engineer oversight',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'custom-corporate-website',
          name: 'Custom Corporate Website',
          category: 'Website Development',
          description:
            'Enterprise digital flagship built for global corporations, institutions, and high-visibility organizations.',
          priceINR: 200000,
          priceUSD: 3999,
          period: '/ project',
          timeline: '5 – 8 Weeks',
          badge: 'Enterprise Flagship',
          features: [
            'Executive design discovery & multi-stakeholder design reviews',
            'Custom headless architecture (Next.js / Astro / Vite)',
            'Investor relations portal, press release engine & document library',
            'Integration with corporate ERP / CRM / recruitment platforms',
            'Full WCAG 2.1 AA accessibility compliance audit',
            'Multi-region edge deployment for instant global loading',
            'OWASP security review & automated backup pipelines',
            '60-day comprehensive post-launch SLA warranty',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
      ],
    },

    // -------------------------------------------------------------
    // 5. E-COMMERCE DEVELOPMENT
    // -------------------------------------------------------------
    {
      id: 'ecommerce-development',
      name: 'E-Commerce Development',
      shortName: 'E-Commerce',
      badge: 'High Conversion & Revenue',
      description:
        'Scalable digital storefronts, custom checkout experiences, inventory orchestration, and high-volume multi-vendor marketplaces.',
      packages: [
        {
          id: 'professional-ecommerce',
          name: 'Professional E-Commerce',
          category: 'E-Commerce Development',
          description:
            'Fast, conversion-optimized online store with secure checkout, inventory management, and automated payment gateways.',
          priceINR: 75000,
          priceUSD: 1499,
          period: '/ project',
          timeline: '2 – 4 Weeks',
          features: [
            'Custom product catalog & category taxonomy management',
            'Frictionless cart & 1-page checkout experience',
            'Payment gateway integration (Stripe / Razorpay / PayPal)',
            'Automated order management & invoice generator',
            'Discount coupon engine & promotional campaigns',
            'Real-time inventory tracking & low stock alerts',
            'Customer accounts, order history, and saved addresses',
            'Automated order confirmation emails & SMS alerts',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'business-ecommerce',
          name: 'Business E-Commerce',
          category: 'E-Commerce Development',
          description:
            'Custom storefront engineered for high volume, automated shipping label generation, advanced filters, and loyalty mechanics.',
          priceINR: 150000,
          priceUSD: 2999,
          period: '/ project',
          popular: true,
          badge: 'Most Popular',
          timeline: '4 – 7 Weeks',
          features: [
            'Advanced product filtering (Facets, attributes, price sliders)',
            'Shipping carrier integrations (Shiprocket, FedEx, DHL)',
            'Automated real-time tax calculation by region/postal code',
            'Customer loyalty points, gift cards, and referral system',
            'Abandoned cart recovery automation sequences',
            'Comprehensive administrative analytics & revenue reporting',
            'Multi-currency support with dynamic geo-location pricing',
            '45-day warranty & post-launch conversion optimization',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'advanced-ecommerce-platform',
          name: 'Advanced E-Commerce Platform',
          category: 'E-Commerce Development',
          description:
            'Headless e-commerce architecture tailored for enterprise brands with ERP synchronization and personalized shopping workflows.',
          priceINR: 300000,
          priceUSD: 5999,
          period: '/ project',
          timeline: '7 – 12 Weeks',
          features: [
            'Headless e-commerce frontend with ultra-fast edge rendering',
            'Direct ERP & warehouse management system (WMS) bi-directional sync',
            'B2B wholesale pricing, custom bulk tiers, and quote requests',
            'Subscription recurring billing & automated replenishments',
            'Personalized recommendation engine & smart upselling nodes',
            'Advanced fraud detection & chargeback mitigation safeguards',
            'Automated database backups & high concurrency resilience',
            '60-day post-launch warranty with SLA response',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'custom-marketplace',
          name: 'Custom Marketplace',
          category: 'E-Commerce Development',
          description:
            'Multi-vendor ecosystem with autonomous vendor dashboards, escrow payouts, commission logic, and centralized governance.',
          priceINR: 500000,
          priceUSD: 9999,
          period: '/ project',
          timeline: '12 – 18 Weeks',
          badge: 'Marketplace Scale',
          features: [
            'Multi-vendor architecture with dedicated seller portals',
            'Automated commission split & payout escrow pipeline',
            'Vendor product approval workflows & dispute mediation console',
            'Unified cart checking out across multiple vendors',
            'Buyer-seller direct messaging & support ticketing system',
            'Dedicated master administrative governance dashboard',
            'Enterprise database clustering & high-throughput caching',
            '90-day comprehensive SLA support & warranty',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
      ],
    },

    // -------------------------------------------------------------
    // 7. API & BUSINESS INTEGRATIONS
    // -------------------------------------------------------------
    {
      id: 'api-business-integrations',
      name: 'API & Business Integrations',
      shortName: 'API Integrations',
      badge: 'System Interoperability',
      description:
        'Bridge disparate business software, automate data flows, integrate payment gateways, and eliminate manual synchronization bottlenecks.',
      packages: [
        {
          id: 'professional-integration',
          name: 'Professional Integration',
          category: 'API & Business Integrations',
          description:
            'Reliable point-to-point integration connecting two key business systems with robust error handling and monitoring.',
          priceINR: 50000,
          priceUSD: 999,
          period: '/ project',
          timeline: '1 – 2 Weeks',
          features: [
            'Direct API connector between 2 core platforms',
            'Secure credential storage & OAuth 2.0 handshake',
            'Bi-directional or webhook-driven data synchronization',
            'Automated error notifications & retry logic',
            'Data transformation & schema mapping validation',
            'Deployment to serverless worker infrastructure',
            'Full documentation & test payloads',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'advanced-api-integration',
          name: 'Advanced API Integration',
          category: 'API & Business Integrations',
          description:
            'Complex multi-system integration with asynchronous job queuing, transformation logic, rate-limiting handlers, and database sync.',
          priceINR: 95000,
          priceUSD: 1899,
          period: '/ project',
          popular: true,
          badge: 'Most Popular',
          timeline: '2 – 3 Weeks',
          features: [
            'Multi-system integration hub (e.g. CRM + Payment + WhatsApp + Database)',
            'Queue-based asynchronous processing (Redis / BullMQ)',
            'Rate limiting & API quota throttling management',
            'Complex JSON / XML payload normalization',
            'Detailed audit logging & sync status dashboard',
            'Dead letter queues for failed transaction recovery',
            '30-day warranty & ongoing sync verification',
          ],
          ctaText: 'Get Started',
          ctaAction: '/book-service',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
        {
          id: 'enterprise-integration-system',
          name: 'Enterprise Integration System',
          category: 'API & Business Integrations',
          description:
            'Institutional middleware bridging legacy databases, modern cloud microservices, ERP systems, and external vendor APIs.',
          priceINR: 195000,
          priceUSD: 3999,
          period: '/ project',
          timeline: '2 – 4 Weeks',
          badge: 'Mission-Critical',
          features: [
            'Enterprise middleware integration pipeline',
            'High transaction throughput with guaranteed delivery semantics',
            'Custom ERP integration (SAP, Oracle, Salesforce, Zoho)',
            'Bank-grade data encryption & compliance logging',
            'Automated health check endpoints & telemetry alerts',
            'Dedicated admin control plane to manage API keys & logs',
            '60-day engineering warranty & SLA maintenance',
          ],
          ctaText: 'Talk to an Engineer',
          ctaType: 'engineer',
          ctaAction: '/book-consultation',
          secondaryCtaText: 'Request Custom Quote',
          secondaryCtaAction: '/project-intake',
        },
      ],
    },
  ],

  // -------------------------------------------------------------
  // 8. MAINTENANCE & ENGINEERING RETAINERS
  // -------------------------------------------------------------
  retainers: [
    {
      id: 'business-maintenance',
      name: 'Business Maintenance',
      category: 'Maintenance & Engineering Retainers',
      description:
        'Continuous proactive monitoring, framework updates, dependency patches, and guaranteed emergency SLA response.',
      priceINR: 30000,
      priceUSD: 599,
      period: '/ month',
      badge: 'Essential Security',
      features: [
        '24/7 uptime & health metric monitoring',
        'Monthly security patch management & dependency updates',
        'Automated daily database backups with verified restoration tests',
        'SSL certificate renewal & domain DNS management',
        'Priority incident triage with 8-hour SLA response',
        'Monthly performance & security audit report',
      ],
      ctaText: 'Inquire for Retainer',
      ctaAction: '/contact',
      secondaryCtaText: 'Schedule Call',
      secondaryCtaAction: '/book-consultation',
    },
    {
      id: 'growth-engineering-support',
      name: 'Growth Engineering Support',
      category: 'Maintenance & Engineering Retainers',
      description:
        'Active engineering bandwidth allocated to developing continuous minor features, performance enhancements, and optimization sprints.',
      priceINR: 75000,
      priceUSD: 1499,
      period: '/ month',
      popular: true,
      badge: 'Continuous Velocity',
      features: [
        '40 hours/month of senior engineering capacity',
        'Feature enhancements & product roadmap development',
        'Automated CI/CD deployment management',
        'Database query tuning & frontend performance optimization',
        'Bi-weekly sprint planning & progress review calls',
        'Priority 4-hour critical bug response SLA',
        'Unused hours rollover up to 30 days',
      ],
      ctaText: 'Inquire for Retainer',
      ctaAction: '/contact',
      secondaryCtaText: 'Schedule Call',
      secondaryCtaAction: '/book-consultation',
    },
    {
      id: 'dedicated-engineer-pod',
      name: 'Dedicated Engineer Pod',
      category: 'Maintenance & Engineering Retainers',
      description:
        'A dedicated senior software engineer and architect committed exclusively to your roadmap, sprints, and strategic technology development.',
      priceINR: 240000,
      priceUSD: 4999,
      period: '/ month',
      badge: 'Dedicated Capacity',
      features: [
        '160 engineering hours/month allocated exclusively to your product',
        'Dedicated senior full-stack software engineer',
        'Direct architectural design & high-level system decisions',
        'Comprehensive peer code reviews & refactoring sprints',
        'Continuous feature development & sprint backlog execution',
        'Enterprise CI/CD maintenance & automated test coverage',
        'Weekly sprint demos & direct daily Slack / Meet collaboration',
        'Immediate critical bug resolution & 1-hour priority triage',
      ],
      ctaText: 'Talk to an Engineer',
      ctaType: 'engineer',
      ctaAction: '/book-consultation',
      secondaryCtaText: 'Request Retainer Proposal',
      secondaryCtaAction: '/project-intake',
    },
  ],

  // -------------------------------------------------------------
  // 9. PREMIUM ADD-ONS
  // -------------------------------------------------------------
  addOns: [
    {
      id: 'advanced-ui-ux',
      title: 'Advanced UI/UX Design System',
      priceINR: 25000,
      priceUSD: 499,
      description:
        'Custom Figma component library, high-fidelity prototypes, and design tokens tailored to your brand identity.',
      deliverables: 'Complete Figma system, interactive prototypes, assets',
    },
    {
      id: 'admin-dashboard',
      title: 'Dedicated Admin Dashboard',
      priceINR: 30000,
      priceUSD: 599,
      description:
        'Comprehensive operational dashboard with analytics charts, user management, and CSV data export capabilities.',
      deliverables: 'Full-featured RBAC control panel with data tables',
    },
    {
      id: 'payment-gateway',
      title: 'Payment Gateway Integration',
      priceINR: 15000,
      priceUSD: 299,
      description:
        'Production integration of Razorpay, Stripe, or PayPal with webhooks, receipts, and automated payment status sync.',
      deliverables: 'Configured gateway, webhooks, invoice generation',
    },
    {
      id: 'ai-chatbot-addon',
      title: 'AI Customer Chatbot',
      priceINR: 50000,
      priceUSD: 999,
      description:
        'Domain-trained conversational AI bot embedded in your web application for 24/7 automated customer inquiries.',
      deliverables: 'Embedded chatbot, vector database, prompt templates',
    },
    {
      id: 'ai-voice-integration',
      title: 'AI Voice Integration',
      priceINR: 75000,
      priceUSD: 1499,
      description:
        'Voice streaming node with real-time speech recognition, natural synthesis, and automated telephony routing.',
      deliverables: 'Voice pipeline, Twilio integration, call logging',
    },
    {
      id: 'advanced-seo',
      title: 'Advanced SEO Architecture',
      priceINR: 25000,
      priceUSD: 499,
      description:
        'Comprehensive technical SEO schema markup, OpenGraph assets, canonical hierarchy, XML sitemaps, and Core Web Vitals audit.',
      deliverables: 'Schema validation, meta tags, sitemap, 95+ score',
    },
    {
      id: 'third-party-api',
      title: 'Third-Party API Integration',
      priceINR: 15000,
      priceUSD: 299,
      description:
        'Integration with any external business API (Google Maps, WhatsApp Business, SendGrid, Twilio, Firebase).',
      deliverables: 'Secure connector, authentication, payload testing',
    },
    {
      id: 'cloud-deployment',
      title: 'Production Cloud Deployment',
      priceINR: 15000,
      priceUSD: 299,
      description:
        'Professional production deployment on AWS / GCP / DigitalOcean with custom domain, automated SSL, and CDN caching.',
      deliverables: 'Docker containerization, SSL, DNS config, CI/CD hook',
    },
    {
      id: 'advanced-security',
      title: 'Advanced Security Hardening',
      priceINR: 30000,
      priceUSD: 599,
      description:
        'OWASP Top-10 security audit, Content Security Policy (CSP), rate limiting, DDoS shielding, and vulnerability analysis.',
      deliverables: 'Security audit report, CSP headers, rate limiters',
    },
  ],

  // -------------------------------------------------------------
  // 12. CUSTOM PROJECT CTA
  // -------------------------------------------------------------
  customProjectCta: {
    title: 'Have a complex idea?',
    description:
      "Tell us what you're building. Our engineering team will review your requirements and prepare a custom proposal.",
    disclaimer: 'Initial project discussion available for qualified projects.',
    primaryButton: {
      label: 'Request Custom Proposal',
      path: '/project-intake',
    },
    secondaryButton: {
      label: 'Talk to an Engineer',
      path: '/book-consultation',
    },
  },
};

/**
 * Helper function to retrieve all packages across all categories or for a specific category
 */
export const getAllPricingPackages = (): PricingPackage[] => {
  const list: PricingPackage[] = [];
  pricingConfig.categories.forEach((cat) => {
    list.push(...cat.packages);
  });
  return list;
};

export const getCategoryById = (categoryId: string): PricingCategory | undefined => {
  return pricingConfig.categories.find((c) => c.id === categoryId);
};
