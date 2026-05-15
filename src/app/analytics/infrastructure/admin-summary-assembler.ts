import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AdminSummary } from '../domain/model/admin-summary.entity';
import { AdminSummaryResource, AdminSummaryResponse } from './admin-summary-response';

/**
 * Converts between {@link AdminSummary} domain entities and infrastructure resources.
 */
export class AdminSummaryAssembler
  implements BaseAssembler<AdminSummary, AdminSummaryResource, AdminSummaryResponse>
{
  toEntityFromResource(resource: AdminSummaryResource): AdminSummary {
    return new AdminSummary({
      id: resource.id,
      activeSensors: resource.activeSensors,
      totalSensors: resource.totalSensors,
      lockedAccounts: resource.lockedAccounts,
      registeredAssets: resource.registeredAssets,
    });
  }

  toResourceFromEntity(entity: AdminSummary): AdminSummaryResource {
    return {
      id: entity.id,
      activeSensors: entity.activeSensors,
      totalSensors: entity.totalSensors,
      lockedAccounts: entity.lockedAccounts,
      registeredAssets: entity.registeredAssets,
    };
  }

  toEntitiesFromResponse(response: AdminSummaryResponse): AdminSummary[] {
    return [this.toEntityFromResource(response)];
  }
}
