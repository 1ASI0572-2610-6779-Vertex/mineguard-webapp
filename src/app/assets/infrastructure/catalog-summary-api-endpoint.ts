import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CompanyKpisResource } from '../../shared/infrastructure/company-kpis-response';
import { companiesBaseUrl, companyScopedUrl } from '../../shared/infrastructure/company-scoped-url';
import { CatalogSummary } from '../domain/model/catalog-summary.entity';
import { CatalogSummaryAssembler } from './catalog-summary-assembler';
import { CatalogSummaryResource, CatalogSummaryResponse } from './catalog-summary-response';

/**
 * HTTP endpoint client for the assets catalog summary.
 *
 * @remarks
 * The standalone `/catalog/summary` endpoint no longer exists — the catalog
 * counters are now a projection of the consolidated tenant KPIs
 * (`GET /companies/{companyId}/kpis`). This client fetches the KPIs and maps the
 * relevant subset onto the {@link CatalogSummary} entity the widget renders.
 */
export class CatalogSummaryApiEndpoint extends BaseApiEndpoint<
  CatalogSummary,
  CatalogSummaryResource,
  CatalogSummaryResponse,
  CatalogSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(http, companiesBaseUrl, new CatalogSummaryAssembler());
  }

  getForCompany(companyId: number): Observable<CatalogSummary> {
    return this.http
      .get<CompanyKpisResource>(companyScopedUrl(companyId, environment.platformProviderCompanyKpisEndpointPath))
      .pipe(
        map((kpis) => new CatalogSummary({
          id: kpis.companyId,
          driversTotal: kpis.driversTotal,
          driversInactive: kpis.driversInactive,
          vehiclesTotal: kpis.vehiclesTotal,
          vehiclesMaintenance: kpis.vehiclesMaintenance,
          supervisorsTotal: kpis.supervisorsTotal,
          supervisorsLocked: kpis.supervisorsLocked,
        })),
        catchError(this.handleError('Failed to fetch catalog summary')),
      );
  }
}
