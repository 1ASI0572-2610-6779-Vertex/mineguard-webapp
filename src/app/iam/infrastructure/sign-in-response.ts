import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of authenticated user data returned by sign-in endpoint.
 *
 * @remarks
 * In DDD, this is an infrastructure-level resource contract that represents
 * the signed-in user as it appears in HTTP communication, without domain logic.
 * Resources serve as the bridge between the domain layer and external systems.
 *
 * This resource includes the authentication token required for subsequent
 * authenticated requests and the role used for authorization decisions.
 */
export interface SignInResource extends BaseResource {
  id: number;
  username: string;
  token: string;
  role: string;
  /** True when the backend issued a temporary password — user must set a new one before proceeding. */
  requiresPasswordChange: boolean;
}

/**
 * Response envelope returned by the sign-in endpoint.
 *
 * @remarks
 * This interface defines the structure of the API response from a successful
 * sign-in operation. It combines the response envelope pattern with the
 * authenticated user resource, providing both the user information and
 * the authentication credentials needed for the session.
 *
 * @example
 * ```typescript
 * // API returns:
 * // {
 * //   id: 1,
 * //   username: "admin_mineguard",
 * //   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 * //   role: "Administrator"
 * // }
 * ```
 */
export interface SignInResponse extends BaseResponse, SignInResource {}
