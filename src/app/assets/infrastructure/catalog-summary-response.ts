import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Catalog summary resource on the API wire.
 */
export interface CatalogSummaryResource extends BaseResource {
  id: number;
  driversTotal: number;
  driversInactive: number;
  vehiclesTotal: number;
  vehiclesMaintenance: number;
  supervisorsTotal: number;
  supervisorsLocked: number;
}

/**
 * Response envelope returned by the catalog summary endpoint.
 */
export interface CatalogSummaryResponse extends BaseResponse {}
