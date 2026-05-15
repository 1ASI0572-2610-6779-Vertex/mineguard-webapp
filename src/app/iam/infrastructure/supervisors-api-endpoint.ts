import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CreateSupervisorCommand } from '../domain/model/create-supervisor.command';
import { Supervisor } from '../domain/model/supervisor.entity';
import { SupervisorAssembler } from './supervisor-assembler';
import { SupervisorResource, SupervisorsResponse } from './supervisor-response';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSupervisorsEndpointPath}`;

/**
 * HTTP endpoint client for supervisor CRUD plus the admin-only
 * create-from-command flow.
 */
export class SupervisorsApiEndpoint extends BaseApiEndpoint<
  Supervisor,
  SupervisorResource,
  SupervisorsResponse,
  SupervisorAssembler
> {
  constructor(http: HttpClient) {
    super(http, endpointUrl, new SupervisorAssembler());
  }

  /**
   * Registers a new supervisor from a domain command. The backend assigns the
   * id and the default `accessStatus: 'active'`.
   */
  createFromCommand(command: CreateSupervisorCommand): Observable<Supervisor> {
    const payload = this.assembler.toRequestFromCommand(command);
    return this.http.post<SupervisorResource>(this.endpointUrl, payload).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to create supervisor')),
    );
  }
}
