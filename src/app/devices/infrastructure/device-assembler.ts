import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Device } from '../domain/model/device.entity';
import { DeviceResource, DevicesResponse } from './device-response';

export class DeviceAssembler
  implements BaseAssembler<Device, DeviceResource, DevicesResponse>
{
  toEntityFromResource(resource: DeviceResource): Device {
    return new Device({
      id: resource.id,
      vehicleId: resource.vehicleId,
      sensorType: resource.sensorType,
      deviceId: resource.deviceId,
      status: resource.status,
      companyId: resource.companyId,
    });
  }

  toResourceFromEntity(entity: Device): DeviceResource {
    return {
      id: entity.id,
      vehicleId: entity.vehicleId,
      sensorType: entity.sensorType,
      deviceId: entity.deviceId,
      status: entity.status,
      companyId: entity.companyId,
    };
  }

  toEntitiesFromResponse(_: DevicesResponse): Device[] {
    return [];
  }
}
