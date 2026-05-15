import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Driver } from '../domain/model/driver.entity';
import { DriverResource, DriversResponse } from './driver-response';

export class DriverAssembler
  implements BaseAssembler<Driver, DriverResource, DriversResponse>
{
  toEntityFromResource(resource: DriverResource): Driver {
    return new Driver({
      id: resource.id,
      fullName: resource.fullName,
      operatorId: resource.operatorId,
      license: resource.license,
      specialty: resource.specialty,
      shiftStatus: resource.shiftStatus,
      lastAccess: resource.lastAccess,
    });
  }

  toResourceFromEntity(entity: Driver): DriverResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      operatorId: entity.operatorId,
      license: entity.license,
      specialty: entity.specialty,
      shiftStatus: entity.shiftStatus,
      lastAccess: entity.lastAccess,
    };
  }

  toEntitiesFromResponse(response: DriversResponse): Driver[] {
    return (response.drivers ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
