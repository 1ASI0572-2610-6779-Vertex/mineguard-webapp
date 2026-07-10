/**
 * Severity tier displayed in the alert detail panel header
 * ("PRIORIDAD CRÍTICA" / etc.).
 */
export type AlertPriority = 'low' | 'medium' | 'warning' | 'high' | 'critical';

const ALERT_PRIORITIES: readonly AlertPriority[] = [
  'critical',
  'high',
  'warning',
  'medium',
  'low',
];

/**
 * Sort weight, most severe first. Telemetry only raises `critical` and `medium`
 * today, but the inbox's "por prioridad" sort has to place every tier the
 * backend can emit — comparing on `priority === 'critical'` alone collapses
 * medium, high and low into one indistinguishable bucket.
 */
export function alertPriorityRank(priority: AlertPriority): number {
  const rank = ALERT_PRIORITIES.indexOf(priority);
  return rank === -1 ? ALERT_PRIORITIES.length : rank;
}

/**
 * An unrecognized tier degrades to `low` rather than throwing: a mislabeled
 * alert still has to render, and the caller already lost the true severity.
 */
export function normalizeAlertPriority(raw: string): AlertPriority {
  const key = (raw ?? '').toLowerCase();
  return ALERT_PRIORITIES.includes(key as AlertPriority) ? (key as AlertPriority) : 'low';
}

const ALERT_PRIORITY_ICONS: Readonly<Record<AlertPriority, string>> = {
  critical: 'crisis_alert',
  high: 'trending_up',
  warning: 'warning',
  medium: 'warning',
  low: 'info',
};

export function alertPriorityIcon(priority: string): string {
  return ALERT_PRIORITY_ICONS[priority as AlertPriority] ?? 'info';
}