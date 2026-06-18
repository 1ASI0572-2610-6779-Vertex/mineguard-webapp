import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { AccessStatus } from './access-status';

export class Supervisor implements BaseEntity {
  private _id: number;
  private _username: string;
  private _fullName: string;
  private _corporateId: string;
  private _email: string;
  private _accessStatus: AccessStatus;
  private _idCompany: number;

  constructor(props: {
    id: number;
    username?: string;
    fullName: string;
    corporateId: string;
    email: string;
    accessStatus: AccessStatus;
    idCompany?: number;
  }) {
    this._id = props.id;
    this._username = props.username ?? '';
    this._fullName = props.fullName;
    this._corporateId = props.corporateId;
    this._email = props.email;
    this._accessStatus = props.accessStatus;
    this._idCompany = props.idCompany ?? 1;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get username(): string { return this._username; }
  set username(value: string) { this._username = value; }

  get fullName(): string { return this._fullName; }
  set fullName(value: string) { this._fullName = value; }

  get corporateId(): string { return this._corporateId; }
  set corporateId(value: string) { this._corporateId = value; }

  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }

  get accessStatus(): AccessStatus { return this._accessStatus; }
  set accessStatus(value: AccessStatus) { this._accessStatus = value; }

  get idCompany(): number { return this._idCompany; }
  set idCompany(value: number) { this._idCompany = value; }
}
