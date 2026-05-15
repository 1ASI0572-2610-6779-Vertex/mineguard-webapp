import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { FleetSummary } from '../domain/model/fleet-summary.entity';
import { FleetSummaryResource, FleetSummaryResponse } from './fleet-summary-response';

export class FleetSummaryAssembler
  implements BaseAssembler<FleetSummary, FleetSummaryResource, FleetSummaryResponse>
{
  toEntityFromResource(resource: FleetSummaryResource): FleetSummary {
    return new FleetSummary({
      id: resource.id,
      operational: resource.operational,
      maintenance: resource.maintenance,
      alert: resource.alert,
      total: resource.total,
      operationalPercent: resource.operationalPercent,
    });
  }

  toResourceFromEntity(entity: FleetSummary): FleetSummaryResource {
    return {
      id: entity.id,
      operational: entity.operational,
      maintenance: entity.maintenance,
      alert: entity.alert,
      total: entity.total,
      operationalPercent: entity.operationalPercent,
    };
  }

  toEntitiesFromResponse(response: FleetSummaryResponse): FleetSummary[] {
    return [this.toEntityFromResource(response)];
  }
}
