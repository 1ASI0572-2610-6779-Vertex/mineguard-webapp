/**
 * Domain command to register a new supervisor.
 * Password is intentionally absent: the backend auto-generates a temporary
 * password and emails it to the supervisor on account creation.
 */
export class CreateSupervisorCommand {
  readonly fullName: string;
  readonly corporateId: string;
  readonly email: string;
  readonly username: string;
  readonly idCompany: number;

  constructor(props: {
    fullName: string;
    corporateId: string;
    email: string;
    username: string;
    idCompany: number;
  }) {
    this.fullName    = props.fullName;
    this.corporateId = props.corporateId;
    this.email       = props.email;
    this.username    = props.username;
    this.idCompany   = props.idCompany;
  }
}
