import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AnalyticsIncidentDistribution } from '../domain/model/analytics-incident-distribution.entity';
import { AnalyticsIncidentDistributionAssembler } from './analytics-incident-distribution-assembler';
import {
  AnalyticsIncidentDistributionResource,
  AnalyticsIncidentDistributionResponse,
} from './analytics-incident-distribution-response';

export class AnalyticsIncidentDistributionApiEndpoint extends BaseApiEndpoint<
  AnalyticsIncidentDistribution,
  AnalyticsIncidentDistributionResource,
  AnalyticsIncidentDistributionResponse,
  AnalyticsIncidentDistributionAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderAnalyticsIncidentDistributionEndpointPath}`,
      new AnalyticsIncidentDistributionAssembler()
    );
  }
}
