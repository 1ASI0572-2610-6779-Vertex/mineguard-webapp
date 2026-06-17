/**
 * Domain command to register a new supervisor.
 * Carries all fields required by POST /supervisors.
 */
export class CreateSupervisorCommand {
  readonly fullName: string;
  readonly corporateId: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly idCompany: number;

  constructor(props: {
    fullName: string;
    corporateId: string;
    email: string;
    username: string;
    password: string;
    idCompany: number;
  }) {
    this.fullName = props.fullName;
    this.corporateId = props.corporateId;
    this.email = props.email;
    this.username = props.username;
    this.password = props.password;
    this.idCompany = props.idCompany;
  }
}