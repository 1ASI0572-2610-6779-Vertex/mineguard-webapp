import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a newly registered user returned by sign-up endpoint.
 *
 * @remarks
 * In DDD, this is an infrastructure-level resource contract that represents
 * the newly created user as it appears in HTTP communication, without domain logic.
 *
 * Unlike SignInResource, this does not include an authentication token.
 * The user must complete the sign-in flow to obtain an authentication session.
 */
export interface SignUpResource extends BaseResource {
  /**
   * The unique identifier assigned to the new user account.
   */
  id: number;
  /**
   * The username of the newly registered user account.
   */
  username: string;
}

/**
 * Response envelope returned by the sign-up endpoint.
 */
export interface SignUpResponse extends BaseResponse, SignUpResource {}
