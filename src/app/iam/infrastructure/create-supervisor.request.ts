/**
 * HTTP request body for POST /supervisors (`CreateSupervisorResource`).
 *
 * @remarks
 * The backend DTO is annotated `@JsonIgnoreProperties(ignoreUnknown = false)`,
 * so it accepts **only** these fields — any extra property (including
 * `username`, `password`, or `idCompany`) is rejected with `400`. The tenant
 * (`companyId`) is resolved exclusively from the JWT, never from the body.
 * Username and password are generated server-side and emailed to the supervisor.
 */
export interface CreateSupervisorRequest {
  fullName:    string;
  corporateId: string;
  /** Optional; must be a valid email format when present. */
  email?:      string;
}
