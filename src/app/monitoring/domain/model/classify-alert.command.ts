import { AlertStatus } from './alert-status';

/**
 * Domain command capturing the supervisor's intent to close an alert as
 * either resolved or false-alarm, including any operational notes.
 */
export class ClassifyAlertCommand {
  private _alertId: number;
  private _status: AlertStatus;
  private _notes: string;

  constructor(props: { alertId: number; status: AlertStatus; notes: string }) {
    this._alertId = props.alertId;
    this._status = props.status;
    this._notes = props.notes;
  }

  get alertId(): number {
    return this._alertId;
  }

  get status(): AlertStatus {
    return this._status;
  }

  get notes(): string {
    return this._notes;
  }
}
