const mockConversation = {
  en: [
    {
      id: 1,
      role: 'user',
      text: 'What is the maximum allowable working pressure for X-Tree valves during deep water drilling operations?',
    },
    {
      id: 2,
      role: 'assistant',
      text: 'Based on Drilling Operations Manual §4.2, the maximum allowable working pressure for X-Tree valves in deep water operations is 5,000 psi, with a mandatory safety factor of 1.5x applied during all pressure testing intervals. Note that this applies to water depths exceeding 300 meters — for shallower operations, refer to §4.1 for adjusted tolerances.',
      sources: ['Drilling Ops Manual §4.2', 'Well Control Procedure v3.1'],
      confidence: '94%',
    },
  ],
  ar: [
    {
      id: 1,
      role: 'user',
      text: 'ما هو الحد الأقصى لضغط التشغيل المسموح به لصمامات شجرة X خلال عمليات الحفر في المياه العميقة؟',
    },
    {
      id: 2,
      role: 'assistant',
      text: 'استناداً إلى دليل عمليات الحفر §4.2، يبلغ الحد الأقصى لضغط التشغيل المسموح به لصمامات شجرة X في عمليات المياه العميقة 5,000 رطل لكل بوصة مربعة، مع تطبيق معامل أمان إلزامي بمقدار 1.5x خلال جميع فترات اختبار الضغط. يُطبَّق هذا على الأعماق التي تتجاوز 300 متر — للعمليات الأقل عمقاً، راجع §4.1 للاطلاع على التفاوتات المعدلة.',
      sources: ['دليل عمليات الحفر §4.2', 'إجراء التحكم في البئر الإصدار 3.1'],
      confidence: '٩٤٪',
    },
  ],
}

export default mockConversation
