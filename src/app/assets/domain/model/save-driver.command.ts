/**
 * Command encapsulating all fields required to create or update a driver via POST/PUT /drivers.
 * Password is intentionally absent: the backend auto-generates a temporary password on creation.
 */
export class SaveDriverCommand {
  readonly username: string;
  readonly email: string;
  readonly fullName: string;
  readonly idCompany: number;
  readonly licenseNumber: string;
  readonly workShift: string;
  readonly id?: number;

  constructor(props: {
    username: string;
    email: string;
    fullName: string;
    idCompany: number;
    licenseNumber: string;
    workShift: string;
    id?: number;
  }) {
    this.username      = props.username;
    this.email         = props.email;
    this.fullName      = props.fullName;
    this.idCompany     = props.idCompany;
    this.licenseNumber = props.licenseNumber;
    this.workShift     = props.workShift;
    this.id            = props.id;
  }
}
