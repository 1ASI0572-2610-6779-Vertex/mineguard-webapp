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
      id: resource.id,
      username: resource.username ?? '',
      fullName: resource.fullName,
      corporateId: resource.corporateId,
      email: resource.email,
      accessStatus: resource.accessStatus,
      idCompany: resource.idCompany ?? 1,
    });
  }

  /**
   * Builds the PUT /supervisors/{id} body.
   * Sends all contract fields; password is omitted on update (the backend
   * treats a missing password as "no change").
   */
  toResourceFromEntity(entity: Supervisor): SupervisorResource {
    return {
      id: entity.id,
      username: entity.username,
      fullName: entity.fullName,
      corporateId: entity.corporateId,
      email: entity.email,
      accessStatus: entity.accessStatus,
      idCompany: entity.idCompany,
    };
  }

  toEntitiesFromResponse(_: SupervisorsResponse): Supervisor[] {
    return [];
  }

  toRequestFromCommand(command: CreateSupervisorCommand): CreateSupervisorRequest {
    return {
      username:    command.username,
      email:       command.email,
      fullName:    command.fullName,
      idCompany:   command.idCompany,
      corporateId: command.corporateId,
    };
  }
}
