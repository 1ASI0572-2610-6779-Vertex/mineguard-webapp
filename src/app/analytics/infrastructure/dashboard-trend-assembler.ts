import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardTrend } from '../domain/model/dashboard-trend.entity';
import { DashboardTrendResource, DashboardTrendResponse } from './dashboard-trend-response';

export class DashboardTrendAssembler
  implements BaseAssembler<DashboardTrend, DashboardTrendResource, DashboardTrendResponse>
{
  toEntitiesFromResponse(response: DashboardTrendResponse): DashboardTrend[] {
    return response.dashboardTrend.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DashboardTrendResource): DashboardTrend {
    return new DashboardTrend({
      id: resource.id,
      hour: resource.hour,
      alerts: resource.alerts,
      incidents: resource.incidents,
    });
  }

  toResourceFromEntity(entity: DashboardTrend): DashboardTrendResource {
    return {
      id: entity.id,
      hour: entity.hour,
      alerts: entity.alerts,
      incidents: entity.incidents,
    };
  }
}
