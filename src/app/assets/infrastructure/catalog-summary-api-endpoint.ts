import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CatalogSummary } from '../domain/model/catalog-summary.entity';
import { CatalogSummaryAssembler } from './catalog-summary-assembler';
import { CatalogSummaryResource, CatalogSummaryResponse } from './catalog-summary-response';

/**
 * HTTP endpoint client for the assets catalog summary.
 */
export class CatalogSummaryApiEndpoint extends BaseApiEndpoint<
  CatalogSummary,
  CatalogSummaryResource,
  CatalogSummaryResponse,
  CatalogSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderCatalogSummaryEndpointPath}`,
      new CatalogSummaryAssembler(),
    );
  }
}
