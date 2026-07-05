import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

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

  /**
   * GET /audit-logs?format=pdf|xls — downloads the full audit trail as a binary
   * file (`application/pdf` or a real `.xlsx`). Content negotiation is done via
   * the `format` query param per the platform export convention.
   */
  download(format: 'pdf' | 'xls'): Observable<Blob> {
    return this.http
      .get(endpointUrl, { params: { format }, responseType: 'blob' })
      .pipe(catchError(this.handleError(`Failed to export audit log as ${format}`)));
  }
}
