/** Integration hook, not an analytics client: no requests, cookies, or personal data.
 * Attach a listener after the site's existing analytics consent gate, if desired. */
export const CONVERSION_METRIC_EVENT = 't3-demo-metric';
export type MetricName = 'intro_viewed' | 'intro_started' | 'intro_dismissed' | 'task_started' | 'task_completed' | 'task_skipped' | 'sample_selected' | 'closing_viewed' | 'closing_dismissed' | 'booking_clicked' | 'contact_clicked';
export interface MetricFields { task?: 'answers' | 'assistant-price' | 'quick-price' | 'admin'; reason?: 'complete' | 'tour-ended' | 'exit'; verification?: 'observed' | 'self-reported' }
export function metricPayload(name: MetricName, fields: MetricFields = {}) {
  const event: { name: MetricName; task?: MetricFields['task']; reason?: MetricFields['reason']; verification?: MetricFields['verification'] } = { name };
  if (fields.task && ['answers','assistant-price','quick-price','admin'].includes(fields.task)) event.task = fields.task;
  if (fields.reason && ['complete','tour-ended','exit'].includes(fields.reason)) event.reason = fields.reason;
  if (fields.verification && ['observed','self-reported'].includes(fields.verification)) event.verification = fields.verification;
  return event;
}
export function trackDemo(name: MetricName, fields: MetricFields = {}) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(CONVERSION_METRIC_EVENT, { detail: metricPayload(name, fields) }));
}
