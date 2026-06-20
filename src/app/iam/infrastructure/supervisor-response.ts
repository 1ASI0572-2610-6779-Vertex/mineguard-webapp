import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { AccessStatus } from '../domain/model/access-status';

/**
 * Supervisor resource as it appears on the wire.
 *
 * GET /api/v1/supervisors response: id, fullName, corporateId, email, accessStatus.
 * username and idCompany are PUT request body fields only — not returned by the server.
 */
export interface SupervisorResource extends BaseResource {
  id: number;
  fullName: string;
  corporateId: string;
  email: string;
  accessStatus: AccessStatus;
  username?: string;
  idCompany?: number;
}

/**
 * Response envelope returned by the supervisors collection endpoint.
 */
export interface SupervisorsResponse extends BaseResponse {}
