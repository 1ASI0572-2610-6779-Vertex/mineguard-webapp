/**
 * HTTP request payload for sign-up (user registration) operations.
 *
 * @remarks
 * In DDD, this is an infrastructure-level request contract that defines the structure
 * of data sent to the sign-up API endpoint. It represents the wire format for
 * registration requests and is kept separate from domain commands to avoid
 * coupling the API contract to domain model changes.
 */
export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  roles: string[];
}
