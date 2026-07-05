import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AnalyticsHistoryRowResource extends BaseResource {
  id: number;
  date: string;
  time: string;
  criticality: string;
  criticalityLabel: string;
  incidentType: string;
  involved: string;
  location: string;
  /**
   * Owning driver of the incident (Incident → Alert → Trip → driver). May be
   * `null` when the row has no associated trip. Required, together with
   * {@link reportId}, to build `GET /drivers/{driverId}/reports/{reportId}`.
   */
  driverId: number | null;
  /**
   * Id of the report generated for this incident, or `null` when no report
   * exists yet. When `null`, the export action must be disabled.
   */
  reportId: number | null;
}

export interface AnalyticsHistoryRowsResponse extends BaseResponse {}
