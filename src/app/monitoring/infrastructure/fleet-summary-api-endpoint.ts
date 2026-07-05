import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CompanyKpisResource } from '../../shared/infrastructure/company-kpis-response';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { FleetSummary } from '../domain/model/fleet-summary.entity';
import { FleetSummaryAssembler } from './fleet-summary-assembler';
import { FleetSummaryResource, FleetSummaryResponse } from './fleet-summary-response';

/**
 * HTTP endpoint client for the live-map fleet summary.
 *
 * @remarks
 * The standalone `/fleet/summary` endpoint no longer exists — the fleet counters
 * are now a projection of the consolidated tenant KPIs
 * (`GET /companies/{companyId}/kpis`). This client fetches the KPIs and maps the
 * relevant subset onto the {@link FleetSummary} entity the widget renders.
 */
export class FleetSummaryApiEndpoint extends BaseApiEndpoint<
  FleetSummary,
  FleetSummaryResource,
  FleetSummaryResponse,
  FleetSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new FleetSummaryAssembler());
  }

  getForCompany(companyId: number): Observable<FleetSummary> {
    return this.http
      .get<CompanyKpisResource>(companyScopedUrl(companyId, environment.platformProviderCompanyKpisEndpointPath))
      .pipe(
        map((kpis) => new FleetSummary({
          id: kpis.companyId,
          operational: kpis.vehiclesOperational,
          maintenance: kpis.vehiclesMaintenance,
          alert: kpis.vehiclesAlert,
          total: kpis.vehiclesTotal,
          operationalPercent: kpis.vehiclesOperationalPercent,
        })),
        catchError(this.handleError('Failed to fetch fleet summary')),
      );
  }
}
