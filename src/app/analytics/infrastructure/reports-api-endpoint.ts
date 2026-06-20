import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Report } from '../domain/model/report.entity';
import { ReportAssembler } from './report-assembler';
import { ReportResource, ReportsResponse } from './reports-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderReportsEndpointPath}`;

export class ReportsApiEndpoint extends BaseApiEndpoint<
  Report,
  ReportResource,
  ReportsResponse,
  ReportAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new ReportAssembler());
  }

  /** GET /reports/{id}?format=pdf — download binary PDF report. */
  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(`${endpointUrl}/${id}`, { params: { format: 'pdf' }, responseType: 'blob' }).pipe(
      catchError(this.handleError(`Failed to download PDF for report ${id}`)),
    );
  }
}
