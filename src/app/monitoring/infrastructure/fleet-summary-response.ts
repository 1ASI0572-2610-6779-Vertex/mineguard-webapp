import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface FleetSummaryResource extends BaseResource {
  id: number;
  operational: number;
  maintenance: number;
  alert: number;
  total: number;
  operationalPercent: number;
}

export interface FleetSummaryResponse extends BaseResponse {}
