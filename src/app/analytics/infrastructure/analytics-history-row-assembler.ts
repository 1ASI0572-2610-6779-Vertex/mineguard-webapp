import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AnalyticsHistoryRow } from '../domain/model/analytics-history-row.entity';
import {
  AnalyticsHistoryRowResource,
  AnalyticsHistoryRowsResponse,
} from './analytics-history-rows-response';

export class AnalyticsHistoryRowAssembler
  implements
    BaseAssembler<AnalyticsHistoryRow, AnalyticsHistoryRowResource, AnalyticsHistoryRowsResponse>
{
  toEntitiesFromResponse(response: AnalyticsHistoryRowsResponse): AnalyticsHistoryRow[] {
    return response.analyticsHistoryRows.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: AnalyticsHistoryRowResource): AnalyticsHistoryRow {
    return new AnalyticsHistoryRow({
      id: resource.id,
      date: resource.date,
      time: resource.time,
      criticality: resource.criticality,
      criticalityLabel: resource.criticalityLabel,
      incidentType: resource.incidentType,
      involved: resource.involved,
      location: resource.location,
    });
  }

  toResourceFromEntity(entity: AnalyticsHistoryRow): AnalyticsHistoryRowResource {
    return {
      id: entity.id,
      date: entity.date,
      time: entity.time,
      criticality: entity.criticality,
      criticalityLabel: entity.criticalityLabel,
      incidentType: entity.incidentType,
      involved: entity.involved,
      location: entity.location,
    };
  }
}
