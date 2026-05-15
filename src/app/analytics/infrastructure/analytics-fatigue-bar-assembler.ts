import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AnalyticsFatigueBar } from '../domain/model/analytics-fatigue-bar.entity';
import {
  AnalyticsFatigueBarResource,
  AnalyticsFatigueBarsResponse,
} from './analytics-fatigue-bars-response';

export class AnalyticsFatigueBarAssembler
  implements
    BaseAssembler<AnalyticsFatigueBar, AnalyticsFatigueBarResource, AnalyticsFatigueBarsResponse>
{
  toEntitiesFromResponse(response: AnalyticsFatigueBarsResponse): AnalyticsFatigueBar[] {
    return response.analyticsFatigueBars.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: AnalyticsFatigueBarResource): AnalyticsFatigueBar {
    return new AnalyticsFatigueBar({
      id: resource.id,
      driverId: resource.driverId,
      driverName: resource.driverName,
      fatigueEvents: resource.fatigueEvents,
      width: resource.width,
    });
  }

  toResourceFromEntity(entity: AnalyticsFatigueBar): AnalyticsFatigueBarResource {
    return {
      id: entity.id,
      driverId: entity.driverId,
      driverName: entity.driverName,
      fatigueEvents: entity.fatigueEvents,
      width: entity.width,
    };
  }
}
