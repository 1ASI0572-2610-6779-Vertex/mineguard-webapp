import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CatalogSummary } from '../domain/model/catalog-summary.entity';
import { CatalogSummaryResource, CatalogSummaryResponse } from './catalog-summary-response';

/**
 * Converts between {@link CatalogSummary} domain entities and infrastructure
 * resources.
 */
export class CatalogSummaryAssembler
  implements BaseAssembler<CatalogSummary, CatalogSummaryResource, CatalogSummaryResponse>
{
  toEntityFromResource(resource: CatalogSummaryResource): CatalogSummary {
    return new CatalogSummary({
      id: resource.id,
      driversTotal: resource.driversTotal,
      driversInactive: resource.driversInactive,
      vehiclesTotal: resource.vehiclesTotal,
      vehiclesMaintenance: resource.vehiclesMaintenance,
      supervisorsTotal: resource.supervisorsTotal,
      supervisorsLocked: resource.supervisorsLocked,
    });
  }

  toResourceFromEntity(entity: CatalogSummary): CatalogSummaryResource {
    return {
      id: entity.id,
      driversTotal: entity.driversTotal,
      driversInactive: entity.driversInactive,
      vehiclesTotal: entity.vehiclesTotal,
      vehiclesMaintenance: entity.vehiclesMaintenance,
      supervisorsTotal: entity.supervisorsTotal,
      supervisorsLocked: entity.supervisorsLocked,
    };
  }

  toEntitiesFromResponse(response: CatalogSummaryResponse): CatalogSummary[] {
    return [this.toEntityFromResource(response)];
  }
}
