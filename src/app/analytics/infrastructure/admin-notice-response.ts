import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { AdminNoticeLevel } from '../domain/model/admin-notice.entity';

/**
 * Admin notice resource mirrored on the API wire.
 */
export interface AdminNoticeResource extends BaseResource {
  id: number;
  level: AdminNoticeLevel;
  i18nKey: string;
  i18nParams: Record<string, unknown>;
  actionKey: string;
}

/**
 * Response envelope returned by the admin notices endpoint.
 */
export interface AdminNoticesResponse extends BaseResponse {
  notices: AdminNoticeResource[];
}
