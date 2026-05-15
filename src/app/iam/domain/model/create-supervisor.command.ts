/**
 * Domain command issued by the admin to register a new supervisor.
 *
 * @remarks
 * The system generates a temporary password on creation and forces a change
 * on first login (per the wireframe's helper text). The command carries no
 * password field.
 */
export class CreateSupervisorCommand {
  get fullName(): string {
    return this._fullName;
  }

  set fullName(value: string) {
    this._fullName = value;
  }

  get corporateId(): string {
    return this._corporateId;
  }

  set corporateId(value: string) {
    this._corporateId = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  private _fullName: string;
  private _corporateId: string;
  private _email: string;

  constructor(props: { fullName: string; corporateId: string; email: string }) {
    this._fullName = props.fullName;
    this._corporateId = props.corporateId;
    this._email = props.email;
  }
}
