/**
 * HTTP request payload for POST /supervisors.
 * Mirrors the exact body required by the backend contract.
 */
export interface CreateSupervisorRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  idCompany: number;
  corporateId: string;
}