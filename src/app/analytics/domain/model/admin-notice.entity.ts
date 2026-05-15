import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Severity level used to color-code an administrative notice.
 */
export type AdminNoticeLevel = 'warning' | 'info';

/**
 * Administrative notice surfaced in the admin control panel.
 *
 * @remarks
 * Both message and action are stored as i18n keys + parameters so the
 * presentation layer can render them in the active locale without the API
 * shipping pre-translated strings.
 */
export class AdminNotice implements BaseEntity {
  private _id: number;
  private _level: AdminNoticeLevel;
  private _i18nKey: string;
  private _i18nParams: Record<string, unknown>;
  private _actionKey: string;

  constructor(props: {
    id: number;
    level: AdminNoticeLevel;
    i18nKey: string;
    i18nParams: Record<string, unknown>;
    actionKey: string;
  }) {
    this._id = props.id;
    this._level = props.level;
    this._i18nKey = props.i18nKey;
    this._i18nParams = props.i18nParams;
    this._actionKey = props.actionKey;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get level(): AdminNoticeLevel {
    return this._level;
  }

  set level(value: AdminNoticeLevel) {
    this._level = value;
  }

  get i18nKey(): string {
    return this._i18nKey;
  }

  set i18nKey(value: string) {
    this._i18nKey = value;
  }

  get i18nParams(): Record<string, unknown> {
    return this._i18nParams;
  }

  set i18nParams(value: Record<string, unknown>) {
    this._i18nParams = value;
  }

  get actionKey(): string {
    return this._actionKey;
  }

  set actionKey(value: string) {
    this._actionKey = value;
  }
}
