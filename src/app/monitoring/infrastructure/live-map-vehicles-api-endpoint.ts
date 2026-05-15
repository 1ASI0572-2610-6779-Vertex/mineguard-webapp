import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { LiveMapVehicle } from '../domain/model/live-map-vehicle.entity';
import { LiveMapVehicleAssembler } from './live-map-vehicle-assembler';
import { LiveMapVehicleResource, LiveMapVehiclesResponse } from './live-map-vehicle-response';

/**
 * @class LiveMapVehiclesApiEndpoint
 * @description
 * Punto de enlace (Endpoint) de la API encargado de gestionar la comunicación con el backend
 * para obtener los datos de los vehículos en tiempo real mostrados en el mapa.
 *
 * Extiende de `BaseApiEndpoint` para heredar las operaciones HTTP estándar,
 * inyectando los tipos específicos del dominio de vehículos en tiempo real.
 *
 * @extends {BaseApiEndpoint<LiveMapVehicle, LiveMapVehicleResource, LiveMapVehiclesResponse, LiveMapVehicleAssembler>}
 */
export class LiveMapVehiclesApiEndpoint extends BaseApiEndpoint<
  LiveMapVehicle,
  LiveMapVehicleResource,
  LiveMapVehiclesResponse,
  LiveMapVehicleAssembler
> {

  /**
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular utilizado para realizar las peticiones de red.
   *
   * @description
   * Inicializa el endpoint configurando la URL base y la ruta específica del servicio de vehículos
   * a partir de las variables de entorno. Además, inyecta el `LiveMapVehicleAssembler`
   * responsable de transformar los Data Transfer Objects (DTOs) recibidos en entidades del dominio.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderLiveMapVehiclesEndpointPath}`,
      new LiveMapVehicleAssembler(),
    );
  }
}
