import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AdminNotice } from '../domain/model/admin-notice.entity';
import { AdminNoticeResource, AdminNoticesResponse } from './admin-notice-response';

/**
 * Converts between {@link AdminNotice} domain entities and infrastructure resources.
 */
export class AdminNoticeAssembler
  implements BaseAssembler<AdminNotice, AdminNoticeResource, AdminNoticesResponse>
{
  toEntityFromResource(resource: AdminNoticeResource): AdminNotice {
    return new AdminNotice({
      id: resource.id,
      level: resource.level,
      i18nKey: resource.i18nKey,
      i18nParams: resource.i18nParams ?? {},
      actionKey: resource.actionKey,
    });
  }

  toResourceFromEntity(entity: AdminNotice): AdminNoticeResource {
    return {
      id: entity.id,
      level: entity.level,
      i18nKey: entity.i18nKey,
      i18nParams: entity.i18nParams,
      actionKey: entity.actionKey,
    };
  }

  toEntitiesFromResponse(response: AdminNoticesResponse): AdminNotice[] {
    return (response.notices ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
