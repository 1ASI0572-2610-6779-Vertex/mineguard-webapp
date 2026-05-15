import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DashboardRiskDriver } from '../domain/model/dashboard-risk-driver.entity';
import {
  DashboardRiskDriverResource,
  DashboardRiskDriversResponse,
} from './dashboard-risk-drivers-response';

export class DashboardRiskDriversAssembler
  implements
    BaseAssembler<DashboardRiskDriver, DashboardRiskDriverResource, DashboardRiskDriversResponse>
{
  toEntitiesFromResponse(response: DashboardRiskDriversResponse): DashboardRiskDriver[] {
    return response.dashboardRiskDrivers.map((resource) => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: DashboardRiskDriverResource): DashboardRiskDriver {
    return new DashboardRiskDriver({
      id: resource.id,
      driverId: resource.driverId,
      driverName: resource.driverName,
      vehicleType: resource.vehicleType,
      riskScore: resource.riskScore,
    });
  }

  toResourceFromEntity(entity: DashboardRiskDriver): DashboardRiskDriverResource {
    return {
      id: entity.id,
      driverId: entity.driverId,
      driverName: entity.driverName,
      vehicleType: entity.vehicleType,
      riskScore: entity.riskScore,
    };
  }
}
