import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Alert } from '../domain/model/alert.entity';
import { AlertStatus } from '../domain/model/alert-status';
import { AlertType } from '../domain/model/alert-type';
import { AlertResource, AlertsResponse } from './alert-response';

/**
 * Backend alert discriminators that don't match {@link AlertType} verbatim.
 *
 * @remarks
 * Telemetry-raised alerts (`POST /telemetry`) tag the proximity threshold and
 * the impact event with the same action names the ingest response reports
 * (`proximity`, `collision`), while the analytics endpoints use the canonical
 * `proximity_collision`. Both describe the same alert category, so they
 * collapse onto one type here — otherwise the inbox loses its color band and
 * the `monitoring.alerts.type.*` lookup renders the raw key.
 */
const ALERT_TYPE_ALIASES: Readonly<Record<string, AlertType>> = {
  proximity: 'proximity_collision',
  collision: 'proximity_collision',
};

/**
 * An unrecognized type passes through untouched rather than being coerced onto
 * some default: mislabeling a safety alert is worse than rendering its raw key.
 */
function normalizeAlertType(raw: string): AlertType {
  const key = (raw ?? '').toLowerCase();
  return ALERT_TYPE_ALIASES[key] ?? (key as AlertType);
}

/**
 * The backend labels an unresolved alert `active`; the domain calls it `open`.
 *
 * @remarks
 * Every unresolved-alert check in the UI compares against `open` — the inbox
 * "Abiertas" pill, the classify buttons in the detail panel, and the live-map
 * critical-alerts sidebar. Without this alias each one silently sees zero
 * matches and every alert renders as if it were already resolved.
 */
const ALERT_STATUS_ALIASES: Readonly<Record<string, AlertStatus>> = {
  active: 'open',
};

function normalizeAlertStatus(raw: string): AlertStatus {
  const key = (raw ?? '').toLowerCase();
  return ALERT_STATUS_ALIASES[key] ?? (key as AlertStatus);
}

export class AlertAssembler
  implements BaseAssembler<Alert, AlertResource, AlertsResponse>
{
  toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
      id: resource.id,
      code: resource.code,
      type: normalizeAlertType(resource.type),
      priority: resource.priority,
      status: normalizeAlertStatus(resource.status),
      occurredAt: resource.occurredAt,
      title: resource.title,
      description: resource.description,
      // Telemetry alerts raised without an active driving session carry no
      // vehicle/driver attribution — the backend sends null for all three.
      vehicleClassKey: resource.vehicleClassKey ?? '',
      vehicleCode: resource.vehicleCode ?? '',
      driverName: resource.driverName ?? '',
      resolutionNotes: resource.resolutionNotes ?? '',
    });
  }

  toResourceFromEntity(entity: Alert): AlertResource {
    return {
      id: entity.id,
      code: entity.code,
      type: entity.type,
      priority: entity.priority,
      status: entity.status,
      occurredAt: entity.occurredAt,
      title: entity.title,
      description: entity.description,
      vehicleClassKey: entity.vehicleClassKey,
      vehicleCode: entity.vehicleCode,
      driverName: entity.driverName,
      resolutionNotes: entity.resolutionNotes,
    };
  }

  toEntitiesFromResponse(_: AlertsResponse): Alert[] {
    return [];
  }
}
