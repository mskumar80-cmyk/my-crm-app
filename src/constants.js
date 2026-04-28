// ═══════════════════════════════════════════════
//  Ensemble CRM — Constants & Metadata
// ═══════════════════════════════════════════════

export const INDUSTRIES = [
  'Healthcare', 'Technology', 'Agriculture', 'Manufacturing', 'Logistics',
  'Professional Services', 'Dental', 'Chiropractic', 'Retail', 'Finance', 'Other',
];

export const ACCT_TYPES   = ['Client', 'Prospect', 'Partner', 'Vendor'];
export const ACCT_STATUS  = ['Active', 'At Risk', 'Inactive', 'Churned'];
export const OPP_STAGES   = ['Prospecting', 'Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
export const ACT_TYPES    = ['Call', 'Email', 'Meeting', 'Proposal', 'Follow-up', 'Demo', 'Note'];
export const ROLES        = ['Decision Maker', 'Champion', 'Executive Sponsor', 'Technical Contact', 'Billing Contact', 'Influencer', 'End User'];
export const DEPTS        = ['Executive', 'Sales', 'Marketing', 'IT', 'Finance', 'Operations', 'Clinical', 'Other'];
export const TEAM         = ['Senthil', 'Sijesh', 'Arun', 'Unassigned'];
export const PERIODS      = ['Monthly', 'Quarterly', 'Annually'];
export const CONTRACT_TYPES = ['BAA', 'Signed Contract', 'NDA', 'MSA', 'SOW', 'LOI', 'Other'];

export const LEAD_ACT_TYPES = ['In Person', 'Email', 'Video Conferencing', 'Phone Call', 'Follow-up', 'Demo'];
export const LEAD_STATUSES  = ['New', 'Contacted', 'Working', 'Qualified', 'Unqualified', 'Converted'];
export const LEAD_SOURCES   = ['Website', 'Referral', 'LinkedIn', 'Cold Outreach', 'Event / Conference', 'Partner', 'Inbound Call', 'Trade Show', 'Email Campaign', 'Other'];
export const LEAD_RATINGS   = ['Hot', 'Warm', 'Cold'];

// ─── Display Metadata ───────────────────────────
export const AT_META = {
  Client:  { c: '#10b981', bg: '#ecfdf5' },
  Prospect:{ c: '#6366f1', bg: '#eef2ff' },
  Partner: { c: '#f59e0b', bg: '#fef3c7' },
  Vendor:  { c: '#64748b', bg: '#f1f5f9' },
};

export const AS_META = {
  Active:   { c: '#10b981', bg: '#ecfdf5' },
  'At Risk':{ c: '#f97316', bg: '#fff7ed' },
  Inactive: { c: '#64748b', bg: '#f1f5f9' },
  Churned:  { c: '#ef4444', bg: '#fef2f2' },
};

export const OS_META = {
  Prospecting:    { c: '#64748b', bg: '#f1f5f9' },
  Qualification:  { c: '#0ea5e9', bg: '#e0f2fe' },
  'Needs Analysis':{ c: '#8b5cf6', bg: '#f5f3ff' },
  Proposal:       { c: '#6366f1', bg: '#eef2ff' },
  Negotiation:    { c: '#f97316', bg: '#fff7ed' },
  'Closed Won':   { c: '#10b981', bg: '#ecfdf5' },
  'Closed Lost':  { c: '#ef4444', bg: '#fef2f2' },
};

export const AM = {
  Call:       { e: '📞' },
  Email:      { e: '✉️' },
  Meeting:    { e: '🤝' },
  Proposal:   { e: '📄' },
  'Follow-up':{ e: '🔔' },
  Demo:       { e: '🖥️' },
  Note:       { e: '📝' },
};

export const CT_META = {
  BAA:             { c: '#0ea5e9', bg: '#e0f2fe', icon: '🏥' },
  'Signed Contract':{ c: '#10b981', bg: '#ecfdf5', icon: '✅' },
  NDA:             { c: '#8b5cf6', bg: '#f5f3ff', icon: '🔒' },
  MSA:             { c: '#f59e0b', bg: '#fef3c7', icon: '📋' },
  SOW:             { c: '#6366f1', bg: '#eef2ff', icon: '📝' },
  LOI:             { c: '#f97316', bg: '#fff7ed', icon: '📨' },
  Other:           { c: '#64748b', bg: '#f1f5f9', icon: '📄' },
};

export const LEAD_ACT_META = {
  'In Person':        { e: '🤝', c: '#10b981', bg: '#ecfdf5' },
  'Email':            { e: '✉️',  c: '#6366f1', bg: '#eef2ff' },
  'Video Conferencing':{ e: '🎥', c: '#8b5cf6', bg: '#f5f3ff' },
  'Phone Call':       { e: '📞', c: '#0ea5e9', bg: '#e0f2fe' },
  'Follow-up':        { e: '🔔', c: '#f59e0b', bg: '#fef3c7' },
  'Demo':             { e: '🖥️', c: '#f97316', bg: '#fff7ed' },
};

export const LS_META = {
  New:         { c: '#6366f1', bg: '#eef2ff' },
  Contacted:   { c: '#0ea5e9', bg: '#e0f2fe' },
  Working:     { c: '#8b5cf6', bg: '#f5f3ff' },
  Qualified:   { c: '#10b981', bg: '#ecfdf5' },
  Unqualified: { c: '#64748b', bg: '#f1f5f9' },
  Converted:   { c: '#7c3aed', bg: '#ede9fe' },
};

export const LR_META = {
  Hot:  { c: '#ef4444', bg: '#fef2f2' },
  Warm: { c: '#f97316', bg: '#fff7ed' },
  Cold: { c: '#0ea5e9', bg: '#e0f2fe' },
};

// ─── SVG Icons (inline HTML strings for dangerouslySetInnerHTML) ────
export const SVGICONS = {
  dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>',
  leads:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  accounts:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
  contacts:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  opportunities: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
  activities: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  plus:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  chevL: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>',
  chevR: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"></polyline></svg>',
};
