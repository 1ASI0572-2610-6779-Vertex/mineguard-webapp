import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardRecentAlert } from '../domain/model/dashboard-recent-alert.entity';
import {
  DashboardRecentAlertResource,
  DashboardRecentAlertsResponse,
} from './dashboard-recent-alerts-response';

export class DashboardRecentAlertsAssembler
  implements
    BaseAssembler<DashboardRecentAlert, DashboardRecentAlertResource, DashboardRecentAlertsResponse>
{
  toEntitiesFromResponse(response: DashboardRecentAlertsResponse): DashboardRecentAlert[] {
    return response.dashboardRecentAlerts.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DashboardRecentAlertResource): DashboardRecentAlert {
    return new DashboardRecentAlert({
      id: resource.id,
      alertCode: resource.alertCode,
      severity: resource.severity,
      category: resource.category,
      driverName: resource.driverName,
      vehicleCode: resource.vehicleCode,
      vehicleType: resource.vehicleType,
      route: resource.route,
      time: resource.time,
      status: resource.status,
    });
  }

  toResourceFromEntity(entity: DashboardRecentAlert): DashboardRecentAlertResource {
    return {
      id: entity.id,
      alertCode: entity.alertCode,
      severity: entity.severity,
      category: entity.category,
      driverName: entity.driverName,
      vehicleCode: entity.vehicleCode,
      vehicleType: entity.vehicleType,
      route: entity.route,
      time: entity.time,
      status: entity.status,
    };
  }
}
