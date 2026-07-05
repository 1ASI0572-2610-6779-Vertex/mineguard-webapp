import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Report } from '../domain/model/report.entity';
import { ReportAssembler } from './report-assembler';
import { ReportResource, ReportsResponse } from './reports-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderReportsEndpointPath}`;
const driversBaseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderPerformanceMetricsEndpointPath}`;

export class ReportsApiEndpoint extends BaseApiEndpoint<
  Report,
  ReportResource,
  ReportsResponse,
  ReportAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new ReportAssembler());
  }

  /**
   * GET /drivers/{driverId}/reports/{reportId}?format=pdf|xls — downloads the
   * report as a binary file. The ownership chain (Report → Alert → DrivingSession
   * → Driver) is validated server-side; a mismatch returns 404.
   */
  download(driverId: number, reportId: number, format: 'pdf' | 'xls'): Observable<Blob> {
    const url = `${driversBaseUrl}/${driverId}/reports/${reportId}`;
    return this.http.get(url, { params: { format }, responseType: 'blob' }).pipe(
      catchError(this.handleError(`Failed to download ${format} for report ${reportId}`)),
    );
  }
}
