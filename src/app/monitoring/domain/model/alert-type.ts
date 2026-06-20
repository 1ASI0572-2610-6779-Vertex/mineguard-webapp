/**
 * Category of an operational alert surfaced by the supervisor
 * "Gestión de Alertas" view.
 *
 * @remarks
 * Drives both the color band in the inbox card list and the subtitle in the
 * detail panel.
 */
export type AlertType =
  | 'proximity_collision'
  | 'restricted_zone_entry'
  | 'high_heart_rate'
  | 'fatigue_risk'
  | 'connection_lost';
