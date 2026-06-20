import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AnalyticsIncidentDistribution } from '../domain/model/analytics-incident-distribution.entity';
import {
  AnalyticsIncidentDistributionResource,
  AnalyticsIncidentDistributionResponse,
} from './analytics-incident-distribution-response';

export class AnalyticsIncidentDistributionAssembler
  implements
    BaseAssembler<
      AnalyticsIncidentDistribution,
      AnalyticsIncidentDistributionResource,
      AnalyticsIncidentDistributionResponse
    >
{
  toEntitiesFromResponse(_: AnalyticsIncidentDistributionResponse): AnalyticsIncidentDistribution[] {
    return [];
  }

  toEntityFromResource(
    resource: AnalyticsIncidentDistributionResource
  ): AnalyticsIncidentDistribution {
    return new AnalyticsIncidentDistribution({
      id: resource.id,
      label: resource.label,
      count: resource.count,
      percent: resource.percent,
      className: resource.className,
    });
  }

  toResourceFromEntity(
    entity: AnalyticsIncidentDistribution
  ): AnalyticsIncidentDistributionResource {
    return {
      id: entity.id,
      label: entity.label,
      count: entity.count,
      percent: entity.percent,
      className: entity.className,
    };
  }
}
