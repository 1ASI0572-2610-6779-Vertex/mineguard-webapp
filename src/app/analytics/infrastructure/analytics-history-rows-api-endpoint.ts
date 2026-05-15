import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AnalyticsHistoryRow } from '../domain/model/analytics-history-row.entity';
import { AnalyticsHistoryRowAssembler } from './analytics-history-row-assembler';
import {
  AnalyticsHistoryRowResource,
  AnalyticsHistoryRowsResponse,
} from './analytics-history-rows-response';

export class AnalyticsHistoryRowsApiEndpoint extends BaseApiEndpoint<
  AnalyticsHistoryRow,
  AnalyticsHistoryRowResource,
  AnalyticsHistoryRowsResponse,
  AnalyticsHistoryRowAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderAnalyticsHistoryRowsEndpointPath}`,
      new AnalyticsHistoryRowAssembler()
    );
  }
}
