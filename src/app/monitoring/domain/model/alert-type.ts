/**
 * Category of an operational alert surfaced by the supervisor
 * "Gestión de Alertas" view.
 *
 * @remarks
 * Drives the icon in the inbox card list and the subtitle in the detail panel.
 * It does **not** drive the color band — severity does. `proximity` arrives as
 * `critical` under 10 cm and as `medium` between 10 and 20 cm, so the same type
 * has to be able to render in either color.
 */
export type AlertType =
  | 'proximity_collision'
  | 'proximity'
  | 'restricted_zone_entry'
  | 'high_heart_rate'
  | 'cardiac_arrest'
  | 'fatigue_risk'
  | 'emergency_sos'
  | 'connection_lost';

const ALERT_TYPE_ICONS: Readonly<Record<AlertType, string>> = {
  proximity_collision: 'car_crash',
  proximity: 'radar',
  restricted_zone_entry: 'do_not_enter',
  high_heart_rate: 'favorite',
  cardiac_arrest: 'heart_broken',
  fatigue_risk: 'bedtime',
  emergency_sos: 'sos',
  connection_lost: 'signal_wifi_off',
};

/**
 * Falls back to a neutral bell rather than to any specific category: labeling
 * an unknown alert as a collision is worse than labeling it as nothing.
 */
export function alertTypeIcon(type: string): string {
  return ALERT_TYPE_ICONS[type as AlertType] ?? 'notification_important';
}