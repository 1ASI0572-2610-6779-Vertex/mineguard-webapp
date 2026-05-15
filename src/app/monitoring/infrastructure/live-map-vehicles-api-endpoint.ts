import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { LiveMapVehicle } from '../domain/model/live-map-vehicle.entity';
import { LiveMapVehicleAssembler } from './live-map-vehicle-assembler';
import { LiveMapVehicleResource, LiveMapVehiclesResponse } from './live-map-vehicle-response';

export class LiveMapVehiclesApiEndpoint extends BaseApiEndpoint<
  LiveMapVehicle,
  LiveMapVehicleResource,
  LiveMapVehiclesResponse,
  LiveMapVehicleAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderLiveMapVehiclesEndpointPath}`,
      new LiveMapVehicleAssembler(),
    );
  }
}
