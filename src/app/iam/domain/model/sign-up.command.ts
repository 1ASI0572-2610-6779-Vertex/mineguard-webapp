/**
 * Domain command encapsulating user registration credentials.
 *
 * @remarks
 * In Domain-Driven Design, a Command represents an intent to perform an action
 * in the domain. SignUpCommand captures the user's intent to create a new account
 * with the system.
 *
 * This command:
 * - Holds immutable credential values for a registration operation
 * - Serves as input to the registration use case
 * - Is transformed by the infrastructure layer for API communication
 *
 * @example
 * ```typescript
 * const command = new SignUpCommand({
 *   username: 'SUP-025',
 *   password: 'newpass123'
 * });
 * this.iamStore.signUp(command, this.router);
 * ```
 */
export class SignUpCommand {
  get username(): string { return this._username; }
  set username(value: string) { this._username = value; }

  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get roles(): string[] { return this._roles; }
  set roles(value: string[]) { this._roles = value; }

  private _username: string;
  private _password: string;
  private _email: string;
  private _fullName: string;
  private _roles: string[];

  constructor(props: { username: string; password: string; email: string; fullName: string; roles: string[] }) {
    this._username = props.username;
    this._password = props.password;
    this._email = props.email;
    this._fullName = props.fullName;
    this._roles = props.roles;
  }
}
