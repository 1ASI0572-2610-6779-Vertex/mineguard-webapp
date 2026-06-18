/**
 * HTTP request payload for POST /supervisors.
 * Mirrors the exact body required by the backend contract.
 */
/**
 * HTTP request body for POST /supervisors.
 * Password omitted — backend generates it automatically.
 */
export interface CreateSupervisorRequest {
  username: string;
  email: string;
  fullName: string;
  idCompany: number;
  corporateId: string;
}