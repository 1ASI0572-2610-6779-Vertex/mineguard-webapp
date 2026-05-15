import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { AccessStatus } from '../domain/model/access-status';

/**
 * Supervisor resource as it appears on the wire.
 */
export interface SupervisorResource extends BaseResource {
  id: number;
  fullName: string;
  corporateId: string;
  email: string;
  accessStatus: AccessStatus;
}

/**
 * Response envelope returned by the supervisors collection endpoint.
 */
export interface SupervisorsResponse extends BaseResponse {
  supervisors: SupervisorResource[];
}
