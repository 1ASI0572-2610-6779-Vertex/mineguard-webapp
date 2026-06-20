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
      // username and idCompany are not returned by GET /api/v1/supervisors
      username:  resource.username  ?? '',
      idCompany: resource.idCompany ?? 1,
    });
  }

  /**
   * Builds the PUT /api/v1/supervisors/{id} body.
   * password is omitted — the backend treats a missing password as "no change".
   */
  toResourceFromEntity(entity: Supervisor): SupervisorResource {
    return {
      id:           entity.id,
      fullName:     entity.fullName,
      corporateId:  entity.corporateId,
      email:        entity.email,
      accessStatus: entity.accessStatus,
      username:     entity.username  || undefined,
      idCompany:    entity.idCompany || undefined,
    };
  }

  toEntitiesFromResponse(_: SupervisorsResponse): Supervisor[] {
    return [];
  }

  toRequestFromCommand(command: CreateSupervisorCommand): CreateSupervisorRequest {
    return {
      email:       command.email,
      fullName:    command.fullName,
      idCompany:   command.idCompany,
      corporateId: command.corporateId,
    };
  }
}
