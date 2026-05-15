import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { AuditCategory } from '../domain/model/audit-category';

/**
 * Audit log entry resource on the API wire.
 */
export interface AuditLogEntryResource extends BaseResource {
  id: number;
  category: AuditCategory;
  occurredAt: string;
  titleKey: string;
  descriptionKey: string;
  descriptionParams: Record<string, unknown>;
  actorKey: string;
}

/**
 * Response envelope for the audit log endpoint.
 */
export interface AuditLogResponse extends BaseResponse {
  entries: AuditLogEntryResource[];
}
