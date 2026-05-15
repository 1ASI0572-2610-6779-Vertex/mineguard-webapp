import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { AuditLogEntryResource, AuditLogResponse } from './audit-log-response';

/**
 * Converts between {@link AuditLogEntry} domain entities and infrastructure
 * resources for the audit log endpoint.
 */
export class AuditLogAssembler
  implements BaseAssembler<AuditLogEntry, AuditLogEntryResource, AuditLogResponse>
{
  toEntityFromResource(resource: AuditLogEntryResource): AuditLogEntry {
    return new AuditLogEntry({
      id: resource.id,
      category: resource.category,
      occurredAt: resource.occurredAt,
      titleKey: resource.titleKey,
      descriptionKey: resource.descriptionKey,
      descriptionParams: resource.descriptionParams ?? {},
      actorKey: resource.actorKey,
    });
  }

  toResourceFromEntity(entity: AuditLogEntry): AuditLogEntryResource {
    return {
      id: entity.id,
      category: entity.category,
      occurredAt: entity.occurredAt,
      titleKey: entity.titleKey,
      descriptionKey: entity.descriptionKey,
      descriptionParams: entity.descriptionParams,
      actorKey: entity.actorKey,
    };
  }

  toEntitiesFromResponse(response: AuditLogResponse): AuditLogEntry[] {
    return (response.entries ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
