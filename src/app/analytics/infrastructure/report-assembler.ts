import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Report } from '../domain/model/report.entity';
import { ReportResource, ReportsResponse } from './reports-response';

export class ReportAssembler implements BaseAssembler<Report, ReportResource, ReportsResponse> {
  toEntitiesFromResponse(_: ReportsResponse): Report[] {
    return [];
  }

  toEntityFromResource(resource: ReportResource): Report {
    return new Report({
      id: resource.id,
      incidentId: resource.incidentId,
      alertId: resource.alertId,
      userId: resource.userId,
      metricId: resource.metricId,
      reportType: resource.reportType,
      createdAt: resource.createdAt,
      description: resource.description,
    });
  }

  toResourceFromEntity(entity: Report): ReportResource {
    return {
      id: entity.id,
      incidentId: entity.incidentId,
      alertId: entity.alertId,
      userId: entity.userId,
      metricId: entity.metricId,
      reportType: entity.reportType,
      createdAt: entity.createdAt,
      description: entity.description,
    };
  }
}
