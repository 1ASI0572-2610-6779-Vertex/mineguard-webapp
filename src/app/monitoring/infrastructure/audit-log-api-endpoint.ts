import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AuditLogEntry } from '../domain/model/audit-log-entry.entity';
import { AuditLogAssembler } from './audit-log-assembler';
import { AuditLogEntryResource, AuditLogResponse } from './audit-log-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAuditLogEndpointPath}`;

/**
 * HTTP endpoint client for the system audit log.
 */
export class AuditLogApiEndpoint extends BaseApiEndpoint<
  AuditLogEntry,
  AuditLogEntryResource,
  AuditLogResponse,
  AuditLogAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new AuditLogAssembler());
  }
}
