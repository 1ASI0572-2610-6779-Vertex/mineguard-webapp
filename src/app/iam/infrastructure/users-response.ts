import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a user account for API communication.
 *
 * @remarks
 * In DDD, this is an infrastructure-level resource contract that represents
 * user account information as it appears in HTTP communication, without domain logic.
 */
export interface UserResource extends BaseResource {
  /**
   * The unique identifier for the user account.
   */
  id: number;
  /**
   * The username of the user account.
   */
  username: string;
}

/**
 * Response envelope for user collection queries.
 */
export interface UsersResponse extends BaseResponse {
  /**
   * Array of user resources included in the response.
   */
  users: UserResource[];
}
