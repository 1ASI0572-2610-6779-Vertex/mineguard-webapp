import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CreateSupervisorCommand } from '../domain/model/create-supervisor.command';
import { Supervisor } from '../domain/model/supervisor.entity';
import { CreateSupervisorRequest } from './create-supervisor.request';
import { SupervisorResource, SupervisorsResponse } from './supervisor-response';

export class SupervisorAssembler
  implements BaseAssembler<Supervisor, SupervisorResource, SupervisorsResponse>
{
  toEntityFromResource(resource: SupervisorResource): Supervisor {
    return new Supervisor({
      id:           resource.id,
      fullName:     resource.fullName,
      corporateId:  resource.corporateId,
      email:        resource.email,
      accessStatus: resource.accessStatus,
      // username is not returned by GET /api/v1/supervisors; idCompany is never
      // exposed on the wire (tenant resolved from the JWT). The entity keeps its
      // own internal default for idCompany.
      username:  resource.username  ?? '',
    });
  }

  /**
   * Builds the PATCH /api/v1/supervisors/{id} body (`UpdateSupervisorResource`).
   * All fields are optional (partial update); `password` is omitted so the
   * backend treats it as "no change". `idCompany` is never sent — the tenant is
   * resolved from the JWT (multi-tenant firewall).
   */
  toResourceFromEntity(entity: Supervisor): SupervisorResource {
    return {
      id:           entity.id,
      fullName:     entity.fullName,
      corporateId:  entity.corporateId,
      email:        entity.email,
      accessStatus: entity.accessStatus,
      username:     entity.username  || undefined,
    };
  }

  toEntitiesFromResponse(_: SupervisorsResponse): Supervisor[] {
    return [];
  }

  toRequestFromCommand(command: CreateSupervisorCommand): CreateSupervisorRequest {
    return {
      fullName:    command.fullName,
      corporateId: command.corporateId,
      email:       command.email || undefined,
    };
  }
}
