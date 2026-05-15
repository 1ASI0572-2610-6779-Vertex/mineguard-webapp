import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { LiveMapVehicle } from '../domain/model/live-map-vehicle.entity';
import { LiveMapVehicleResource, LiveMapVehiclesResponse } from './live-map-vehicle-response';

export class LiveMapVehicleAssembler
  implements BaseAssembler<LiveMapVehicle, LiveMapVehicleResource, LiveMapVehiclesResponse>
{
  toEntityFromResource(resource: LiveMapVehicleResource): LiveMapVehicle {
    return new LiveMapVehicle({
      id: resource.id,
      code: resource.code,
      vehicleType: resource.vehicleType,
      latitude: resource.latitude,
      longitude: resource.longitude,
      status: resource.status,
      driverName: resource.driverName,
    });
  }

  toResourceFromEntity(entity: LiveMapVehicle): LiveMapVehicleResource {
    return {
      id: entity.id,
      code: entity.code,
      vehicleType: entity.vehicleType,
      latitude: entity.latitude,
      longitude: entity.longitude,
      status: entity.status,
      driverName: entity.driverName,
    };
  }

  toEntitiesFromResponse(response: LiveMapVehiclesResponse): LiveMapVehicle[] {
    return (response.vehicles ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
