const translations = {
  en: {
    // Navbar
    systemName: 'OpsIQ',
    systemSubtitle: 'Industrial Knowledge Assistant',
    kbStatus: 'Drilling Operations KB — Active',
    langToggle: 'العربية',
    userInitials: 'FK',

    // Hero
    heroBadge: 'Powered by Azure OpenAI · RAG Architecture',
    heroHeading: 'Ask your operations manual anything.',
    heroSubheading:
      'OpsIQ retrieves precise answers from your internal documents — drilling procedures, HSE policies, equipment manuals — with full source citations.',
    searchPlaceholder:
      'Ask in English or Arabic — e.g. HSE checklist for offshore operations',

    // Chips
    chips: [
      'HSE offshore checklist',
      'Well control blowout procedure',
      'Pump pressure tolerance limits',
      'Emergency shutdown sequence',
      'Drilling fluid specifications',
    ],

    // Features
    feature1Title: 'Multilingual Intelligence',
    feature1Desc:
      'Understands Arabic and English queries natively, including Gulf dialect phrasing.',
    feature2Title: 'Source-Cited Answers',
    feature2Desc:
      'Every response traces back to specific document sections, page numbers, and revision versions.',
    feature3Title: 'Sovereign & Secure',
    feature3Desc:
      'Deployed entirely within your Azure region. No data leaves your compliance boundary.',

    // Chat
    chatLabel: 'Conversation',
    clearChat: 'Clear',
    confidenceLabel: 'Confidence',
    typingIndicator: 'OpsIQ is thinking…',

    // Mock messages
    mockUserMsg:
      'What is the maximum allowable working pressure for X-Tree valves during deep water drilling operations?',
    mockAssistantMsg:
      'Based on Drilling Operations Manual §4.2, the maximum allowable working pressure for X-Tree valves in deep water operations is 5,000 psi, with a mandatory safety factor of 1.5x applied during all pressure testing intervals. Note that this applies to water depths exceeding 300 meters — for shallower operations, refer to §4.1 for adjusted tolerances.',
    mockSources: ['Drilling Ops Manual §4.2', 'Well Control Procedure v3.1'],
    mockConfidence: '94%',

    // Mock response
    mockResponse:
      'Based on the documents in the active knowledge base, I found relevant information regarding your query. This response is a frontend prototype — the live system will retrieve real answers from your indexed operational documents via Azure AI Search and Azure OpenAI.',
    mockResponseSources: ['Knowledge Base — Active Documents'],

    // Footer
    footerLeft: '24 documents indexed · Last updated: May 2026 · Azure Saudi North region',
    footerRight: 'OpsIQ v0.1 — Prototype',

    // Aria
    ariaLangToggle: 'Switch language',
    ariaSearch: 'Search knowledge base',
    ariaSend: 'Send query',
    ariaClear: 'Clear conversation',
    ariaChip: 'Use example query',
  },

  ar: {
    // Navbar
    systemName: 'OpsIQ',
    systemSubtitle: 'مساعد المعرفة الصناعية',
    kbStatus: 'قاعدة بيانات عمليات الحفر — نشطة',
    langToggle: 'English',
    userInitials: 'ف.خ',

    // Hero
    heroBadge: 'مدعوم بـ Azure OpenAI · بنية RAG',
    heroHeading: 'اسأل عن أي إجراء تشغيلي أو سياسة أو دليل فني',
    heroSubheading:
      'يسترجع OpsIQ إجابات دقيقة من مستنداتك الداخلية — إجراءات الحفر، سياسات السلامة، أدلة المعدات — مع الاستشهاد الكامل بالمصادر.',
    searchPlaceholder: 'اسأل بالعربية أو الإنجليزية — مثال: قائمة فحص السلامة للعمليات البحرية',

    // Chips
    chips: [
      'قائمة فحص السلامة البحرية',
      'إجراءات التحكم في البئر',
      'حدود تحمل ضغط المضخة',
      'تسلسل الإغلاق الطارئ',
      'مواصفات سائل الحفر',
    ],

    // Features
    feature1Title: 'ذكاء متعدد اللغات',
    feature1Desc: 'يفهم الاستفسارات باللغتين العربية والإنجليزية بشكل طبيعي، بما في ذلك اللهجة الخليجية.',
    feature2Title: 'إجابات موثقة بالمصادر',
    feature2Desc:
      'كل إجابة مرتبطة بأقسام محددة من المستندات وأرقام الصفحات وإصدارات المراجعة.',
    feature3Title: 'سيادي وآمن',
    feature3Desc:
      'نشر كامل داخل منطقة Azure الخاصة بك. لا تغادر البيانات حدود الامتثال.',

    // Chat
    chatLabel: 'المحادثة',
    clearChat: 'مسح',
    confidenceLabel: 'مستوى الثقة',
    typingIndicator: 'OpsIQ يفكر…',

    // Mock messages
    mockUserMsg:
      'ما هو الحد الأقصى لضغط التشغيل المسموح به لصمامات شجرة X خلال عمليات الحفر في المياه العميقة؟',
    mockAssistantMsg:
      'استناداً إلى دليل عمليات الحفر §4.2، يبلغ الحد الأقصى لضغط التشغيل المسموح به لصمامات شجرة X في عمليات المياه العميقة 5,000 رطل لكل بوصة مربعة، مع تطبيق معامل أمان إلزامي بمقدار 1.5x خلال جميع فترات اختبار الضغط. يُطبَّق هذا على الأعماق التي تتجاوز 300 متر — للعمليات الأقل عمقاً، راجع §4.1 للاطلاع على التفاوتات المعدلة.',
    mockSources: ['دليل عمليات الحفر §4.2', 'إجراء التحكم في البئر الإصدار 3.1'],
    mockConfidence: '٩٤٪',

    // Mock response
    mockResponse:
      'استناداً إلى المستندات الموجودة في قاعدة المعرفة النشطة، وجدت معلومات ذات صلة باستفسارك. هذه الاستجابة نموذج أولي للواجهة الأمامية — سيسترجع النظام الفعلي إجابات حقيقية من مستنداتك التشغيلية المفهرسة عبر Azure AI Search وAzure OpenAI.',
    mockResponseSources: ['قاعدة المعرفة — المستندات النشطة'],

    // Footer
    footerLeft: '٢٤ مستنداً مفهرساً · آخر تحديث: مايو ٢٠٢٦ · منطقة Azure شمال السعودية',
    footerRight: 'OpsIQ الإصدار 0.1 — نموذج أولي',

    // Aria
    ariaLangToggle: 'تبديل اللغة',
    ariaSearch: 'البحث في قاعدة المعرفة',
    ariaSend: 'إرسال الاستفسار',
    ariaClear: 'مسح المحادثة',
    ariaChip: 'استخدام مثال الاستفسار',
  },
}

export default translations
