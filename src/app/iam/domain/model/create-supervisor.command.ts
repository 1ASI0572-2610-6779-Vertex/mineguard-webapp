/**
 * Domain command to register a new supervisor.
 * Both username and password are intentionally absent: the backend
 * auto-generates them and delivers the credentials via corporate email.
 */
export class CreateSupervisorCommand {
  readonly fullName:    string;
  readonly corporateId: string;
  readonly email:       string;
  readonly idCompany:   number;

  constructor(props: {
    fullName:    string;
    corporateId: string;
    email:       string;
    idCompany:   number;
  }) {
    this.fullName    = props.fullName;
    this.corporateId = props.corporateId;
    this.email       = props.email;
    this.idCompany   = props.idCompany;
  }
}
