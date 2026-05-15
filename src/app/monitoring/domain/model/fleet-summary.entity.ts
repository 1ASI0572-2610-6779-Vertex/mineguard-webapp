import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Aggregated fleet status counters surfaced by the supervisor live-map view.
 *
 * @remarks
 * Drives both the three numeric tiles (operational / maintenance / alert)
 * and the percentage progress bar at the bottom of the widget.
 */
export class FleetSummary implements BaseEntity {
  private _id: number;
  private _operational: number;
  private _maintenance: number;
  private _alert: number;
  private _total: number;
  private _operationalPercent: number;

  constructor(props: {
    id: number;
    operational: number;
    maintenance: number;
    alert: number;
    total: number;
    operationalPercent: number;
  }) {
    this._id = props.id;
    this._operational = props.operational;
    this._maintenance = props.maintenance;
    this._alert = props.alert;
    this._total = props.total;
    this._operationalPercent = props.operationalPercent;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get operational(): number {
    return this._operational;
  }

  set operational(value: number) {
    this._operational = value;
  }

  get maintenance(): number {
    return this._maintenance;
  }

  set maintenance(value: number) {
    this._maintenance = value;
  }

  get alert(): number {
    return this._alert;
  }

  set alert(value: number) {
    this._alert = value;
  }

  get total(): number {
    return this._total;
  }

  set total(value: number) {
    this._total = value;
  }

  get operationalPercent(): number {
    return this._operationalPercent;
  }

  set operationalPercent(value: number) {
    this._operationalPercent = value;
  }
}
