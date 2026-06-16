import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Admin summary resource mirrored on the API wire.
 */
export interface AdminSummaryResource extends BaseResource {
  id: number;
  activeSensors: number;
  totalSensors: number;
  lockedAccounts: number;
  registeredAssets: number;
}

/**
 * Response envelope returned by the admin summary endpoint.
 */
export interface AdminSummaryResponse extends BaseResponse {}
