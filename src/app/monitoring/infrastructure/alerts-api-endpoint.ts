import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Alert } from '../domain/model/alert.entity';
import { AlertAssembler } from './alert-assembler';
import { AlertResource, AlertsResponse } from './alert-response';

/**
 * HTTP endpoint client for operational alerts.
 */
export class AlertsApiEndpoint extends BaseApiEndpoint<
  Alert,
  AlertResource,
  AlertsResponse,
  AlertAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderOperationalAlertsEndpointPath}`,
      new AlertAssembler(),
    );
  }
}
