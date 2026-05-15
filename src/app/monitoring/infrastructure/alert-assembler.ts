import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Alert } from '../domain/model/alert.entity';
import { AlertResource, AlertsResponse } from './alert-response';

export class AlertAssembler
  implements BaseAssembler<Alert, AlertResource, AlertsResponse>
{
  toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
      id: resource.id,
      code: resource.code,
      type: resource.type,
      priority: resource.priority,
      status: resource.status,
      occurredAt: resource.occurredAt,
      title: resource.title,
      description: resource.description,
      vehicleClassKey: resource.vehicleClassKey,
      vehicleCode: resource.vehicleCode,
      driverName: resource.driverName,
      resolutionNotes: resource.resolutionNotes ?? '',
    });
  }

  toResourceFromEntity(entity: Alert): AlertResource {
    return {
      id: entity.id,
      code: entity.code,
      type: entity.type,
      priority: entity.priority,
      status: entity.status,
      occurredAt: entity.occurredAt,
      title: entity.title,
      description: entity.description,
      vehicleClassKey: entity.vehicleClassKey,
      vehicleCode: entity.vehicleCode,
      driverName: entity.driverName,
      resolutionNotes: entity.resolutionNotes,
    };
  }

  toEntitiesFromResponse(response: AlertsResponse): Alert[] {
    return (response.alerts ?? []).map((resource) => this.toEntityFromResource(resource));
  }
}
