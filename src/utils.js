// ═══════════════════════════════════════════════
//  Ensemble CRM — Utilities
// ═══════════════════════════════════════════════

/** Generate a short unique ID */
export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/** Format ISO date string as "Jan 15, 2026" */
export function fmt(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Format number as USD currency */
export function currency(n) {
  const num = Number(n);
  if (!num) return '$0';
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}k`;
  return `$${num.toLocaleString()}`;
}

/**
 * Compute total contract value for an opportunity.
 * = one-time  +  (recurring × duration_in_periods)
 */
export function oppTotal(o) {
  const ot = Number(o.oneTime) || 0;
  const rc = Number(o.recurring) || 0;
  if (!rc || !o.startDate || !o.endDate) return ot;
  const months = Math.max(0, Math.round(
    (new Date(o.endDate) - new Date(o.startDate)) / (1000 * 60 * 60 * 24 * 30.44)
  ));
  const multiplier = o.recurringPeriod === 'Annually' ? Math.ceil(months / 12)
    : o.recurringPeriod === 'Quarterly' ? Math.ceil(months / 3)
    : months; // Monthly
  return ot + rc * multiplier;
}

// ─── localStorage helpers ─────────────────────

const PREFIX = 'ecrm_';

export function ls(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function lss(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently ignore
  }
}
