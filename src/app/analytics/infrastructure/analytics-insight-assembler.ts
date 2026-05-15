import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AnalyticsInsight } from '../domain/model/analytics-insight.entity';
import {
  AnalyticsInsightResource,
  AnalyticsInsightsResponse,
} from './analytics-insights-response';

export class AnalyticsInsightAssembler
  implements BaseAssembler<AnalyticsInsight, AnalyticsInsightResource, AnalyticsInsightsResponse>
{
  toEntitiesFromResponse(response: AnalyticsInsightsResponse): AnalyticsInsight[] {
    return response.analyticsInsights.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: AnalyticsInsightResource): AnalyticsInsight {
    return new AnalyticsInsight({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      className: resource.className,
    });
  }

  toResourceFromEntity(entity: AnalyticsInsight): AnalyticsInsightResource {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      className: entity.className,
    };
  }
}
