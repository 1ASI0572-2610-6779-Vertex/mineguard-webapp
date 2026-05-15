import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Aggregated administrative KPIs displayed on the admin control panel.
 *
 * @remarks
 * Used by the "Resumen del Sistema" view (`administrador1.png` wireframe) to
 * surface hardware health, blocked accounts and total registered assets at a
 * glance.
 */
export class AdminSummary implements BaseEntity {
  private _id: number;
  private _activeSensors: number;
  private _totalSensors: number;
  private _lockedAccounts: number;
  private _registeredAssets: number;

  constructor(props: {
    id: number;
    activeSensors: number;
    totalSensors: number;
    lockedAccounts: number;
    registeredAssets: number;
  }) {
    this._id = props.id;
    this._activeSensors = props.activeSensors;
    this._totalSensors = props.totalSensors;
    this._lockedAccounts = props.lockedAccounts;
    this._registeredAssets = props.registeredAssets;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get activeSensors(): number {
    return this._activeSensors;
  }

  set activeSensors(value: number) {
    this._activeSensors = value;
  }

  get totalSensors(): number {
    return this._totalSensors;
  }

  set totalSensors(value: number) {
    this._totalSensors = value;
  }

  get lockedAccounts(): number {
    return this._lockedAccounts;
  }

  set lockedAccounts(value: number) {
    this._lockedAccounts = value;
  }

  get registeredAssets(): number {
    return this._registeredAssets;
  }

  set registeredAssets(value: number) {
    this._registeredAssets = value;
  }
}
