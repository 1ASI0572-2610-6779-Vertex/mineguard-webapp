import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CardiacReading } from '../domain/model/cardiac-reading.entity';
import { CardiacReadingResource, CardiacReadingsResponse } from './cardiac-reading-response';

export class CardiacReadingAssembler
  implements BaseAssembler<CardiacReading, CardiacReadingResource, CardiacReadingsResponse>
{
  toEntityFromResource(resource: CardiacReadingResource): CardiacReading {
    return new CardiacReading({
      id: resource.id,
      driverName: resource.driverName,
      vehicleCode: resource.vehicleCode,
      heartRate: resource.heartRate,
      status: resource.status,
    });
  }

  toResourceFromEntity(entity: CardiacReading): CardiacReadingResource {
    return {
      id: entity.id,
      driverName: entity.driverName,
      vehicleCode: entity.vehicleCode,
      heartRate: entity.heartRate,
      status: entity.status,
    };
  }

  toEntitiesFromResponse(response: CardiacReadingsResponse): CardiacReading[] {
    return (response.readings ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
