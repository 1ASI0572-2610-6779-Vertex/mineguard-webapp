import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { AccessStatus } from '../domain/model/access-status';

/**
 * Supervisor resource as it appears on the wire.
 *
 * GET /api/v1/supervisors response: id, fullName, corporateId, email, accessStatus.
 * `username` is a PATCH request-body field only (part of UpdateSupervisorResource)
 * — not returned by the server. `idCompany` is never sent nor returned (the
 * tenant is resolved from the JWT).
 */
export interface SupervisorResource extends BaseResource {
  id: number;
  fullName: string;
  corporateId: string;
  email: string;
  accessStatus: AccessStatus;
  username?: string;
}

/**
 * Response envelope returned by the supervisors collection endpoint.
 */
export interface SupervisorsResponse extends BaseResponse {}
