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
      incidentId: resource.id_incident,
      alertId: resource.id_alert,
      userId: resource.id_user,
      metricId: resource.id_metric,
      reportType: resource.report_type,
      createdAt: resource.created_at,
      description: resource.description,
    });
  }

  toResourceFromEntity(entity: Report): ReportResource {
    return {
      id: entity.id,
      id_incident: entity.incidentId,
      id_alert: entity.alertId,
      id_user: entity.userId,
      id_metric: entity.metricId,
      report_type: entity.reportType,
      created_at: entity.createdAt,
      description: entity.description,
    };
  }
}
