/**
 * HTTP request body for POST /supervisors.
 * Username and password are omitted — the backend generates them automatically
 * and delivers credentials via corporate email.
 */
export interface CreateSupervisorRequest {
  email:       string;
  fullName:    string;
  idCompany:   number;
  corporateId: string;
}
