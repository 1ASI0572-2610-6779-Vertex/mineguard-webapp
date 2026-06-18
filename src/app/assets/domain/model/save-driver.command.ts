/**
 * Command encapsulating the fields required to create or update a driver
 * via POST /drivers or PUT /drivers/{id}.
 * Both username and password are intentionally absent: the backend
 * auto-generates them and delivers the credentials via corporate email.
 */
export class SaveDriverCommand {
  readonly email:         string;
  readonly fullName:      string;
  readonly idCompany:     number;
  readonly licenseNumber: string;
  readonly workShift:     string;
  readonly id?:           number;

  constructor(props: {
    email:         string;
    fullName:      string;
    idCompany:     number;
    licenseNumber: string;
    workShift:     string;
    id?:           number;
  }) {
    this.email         = props.email;
    this.fullName      = props.fullName;
    this.idCompany     = props.idCompany;
    this.licenseNumber = props.licenseNumber;
    this.workShift     = props.workShift;
    this.id            = props.id;
  }
}
