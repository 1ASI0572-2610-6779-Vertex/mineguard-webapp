/**
 * HTTP request payload to register a new supervisor.
 */
export interface CreateSupervisorRequest {
  fullName: string;
  corporateId: string;
  email: string;
}
