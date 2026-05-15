import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { FleetSummary } from '../domain/model/fleet-summary.entity';
import { FleetSummaryAssembler } from './fleet-summary-assembler';
import { FleetSummaryResource, FleetSummaryResponse } from './fleet-summary-response';

export class FleetSummaryApiEndpoint extends BaseApiEndpoint<
  FleetSummary,
  FleetSummaryResource,
  FleetSummaryResponse,
  FleetSummaryAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderFleetSummaryEndpointPath}`,
      new FleetSummaryAssembler(),
    );
  }
}
