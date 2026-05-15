import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CreateSupervisorCommand } from '../domain/model/create-supervisor.command';
import { Supervisor } from '../domain/model/supervisor.entity';
import { CreateSupervisorRequest } from './create-supervisor.request';
import { SupervisorResource, SupervisorsResponse } from './supervisor-response';

/**
 * Converts between {@link Supervisor} domain entities and infrastructure
 * resources, and between {@link CreateSupervisorCommand} domain commands and
 * HTTP request payloads.
 */
export class SupervisorAssembler
  implements BaseAssembler<Supervisor, SupervisorResource, SupervisorsResponse>
{
  toEntityFromResource(resource: SupervisorResource): Supervisor {
    return new Supervisor({
      id: resource.id,
      fullName: resource.fullName,
      corporateId: resource.corporateId,
      email: resource.email,
      accessStatus: resource.accessStatus,
    });
  }

  toResourceFromEntity(entity: Supervisor): SupervisorResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      corporateId: entity.corporateId,
      email: entity.email,
      accessStatus: entity.accessStatus,
    };
  }

  toEntitiesFromResponse(response: SupervisorsResponse): Supervisor[] {
    return (response.supervisors ?? []).map((resource) => this.toEntityFromResource(resource));
  }

  toRequestFromCommand(command: CreateSupervisorCommand): CreateSupervisorRequest {
    return {
      fullName: command.fullName,
      corporateId: command.corporateId,
      email: command.email,
    };
  }
}
