import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { AccessStatus } from './access-status';

/**
 * Supervisor user aggregate, surfaced to the "Gestión de Usuarios" admin view.
 *
 * @remarks
 * A Supervisor is a User specialized for the operational supervisor role. It
 * carries the identity attributes the admin directory needs (full name,
 * corporate ID, corporate e-mail) plus an {@link AccessStatus} that drives the
 * actions available in the directory row (suspend, reset access, etc.).
 */
export class Supervisor implements BaseEntity {
  private _id: number;
  private _fullName: string;
  private _corporateId: string;
  private _email: string;
  private _accessStatus: AccessStatus;

  constructor(props: {
    id: number;
    fullName: string;
    corporateId: string;
    email: string;
    accessStatus: AccessStatus;
  }) {
    this._id = props.id;
    this._fullName = props.fullName;
    this._corporateId = props.corporateId;
    this._email = props.email;
    this._accessStatus = props.accessStatus;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

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

  get accessStatus(): AccessStatus {
    return this._accessStatus;
  }

  set accessStatus(value: AccessStatus) {
    this._accessStatus = value;
  }
}
