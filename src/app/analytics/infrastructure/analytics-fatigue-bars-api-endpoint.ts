import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AnalyticsFatigueBar } from '../domain/model/analytics-fatigue-bar.entity';
import { AnalyticsFatigueBarAssembler } from './analytics-fatigue-bar-assembler';
import {
  AnalyticsFatigueBarResource,
  AnalyticsFatigueBarsResponse,
} from './analytics-fatigue-bars-response';

export class AnalyticsFatigueBarsApiEndpoint extends BaseApiEndpoint<
  AnalyticsFatigueBar,
  AnalyticsFatigueBarResource,
  AnalyticsFatigueBarsResponse,
  AnalyticsFatigueBarAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderAnalyticsFatigueBarsEndpointPath}`,
      new AnalyticsFatigueBarAssembler()
    );
  }
}
