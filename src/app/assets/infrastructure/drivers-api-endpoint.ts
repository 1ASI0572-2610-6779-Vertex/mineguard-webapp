import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Driver } from '../domain/model/driver.entity';
import { DriverAssembler } from './driver-assembler';
import { DriverResource, DriversResponse } from './driver-response';

/**
 * HTTP endpoint client for the drivers directory projection.
 */
export class DriversApiEndpoint extends BaseApiEndpoint<
  Driver,
  DriverResource,
  DriversResponse,
  DriverAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderDriversDirectoryEndpointPath}`,
      new DriverAssembler(),
    );
  }
}
