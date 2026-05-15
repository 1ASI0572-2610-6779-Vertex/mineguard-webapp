import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VehicleResource, VehiclesResponse } from './vehicle-response';

export class VehicleAssembler
  implements BaseAssembler<Vehicle, VehicleResource, VehiclesResponse>
{
  toEntityFromResource(resource: VehicleResource): Vehicle {
    return new Vehicle({
      id: resource.id,
      code: resource.code,
      model: resource.model,
      category: resource.category,
      status: resource.status,
      assignedDriverName: resource.assignedDriverName,
      shiftLabel: resource.shiftLabel,
    });
  }

  toResourceFromEntity(entity: Vehicle): VehicleResource {
    return {
      id: entity.id,
      code: entity.code,
      model: entity.model,
      category: entity.category,
      status: entity.status,
      assignedDriverName: entity.assignedDriverName,
      shiftLabel: entity.shiftLabel,
    };
  }

  toEntitiesFromResponse(response: VehiclesResponse): Vehicle[] {
    return (response.vehicles ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
