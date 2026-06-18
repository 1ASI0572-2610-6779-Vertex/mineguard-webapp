import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SaveDriverCommand } from '../domain/model/save-driver.command';
import { DriverResource } from './driver-response';

interface DriverWriteBody {
  email:         string;
  fullName:      string;
  idCompany:     number;
  licenseNumber: string;
  workShift:     string;
}

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderDriversEndpointPath}`;

/**
 * HTTP endpoint client for driver write operations (POST /drivers, PUT /drivers/{id}).
 * Username and password are omitted — the backend auto-generates credentials on creation.
 */
export class DriversWriteApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  create(command: SaveDriverCommand): Observable<DriverResource> {
    return this.http.post<DriverResource>(endpointUrl, this.toBody(command)).pipe(
      map((res) => res),
      catchError(this.handleError('Failed to create driver')),
    );
  }

  update(command: SaveDriverCommand): Observable<DriverResource> {
    return this.http.put<DriverResource>(`${endpointUrl}/${command.id}`, this.toBody(command)).pipe(
      map((res) => res),
      catchError(this.handleError('Failed to update driver')),
    );
  }

  getById(id: number): Observable<DriverResource> {
    return this.http.get<DriverResource>(`${endpointUrl}/${id}`).pipe(
      catchError(this.handleError(`Failed to fetch driver ${id}`)),
    );
  }

  private toBody(command: SaveDriverCommand): DriverWriteBody {
    return {
      email:         command.email,
      fullName:      command.fullName,
      idCompany:     command.idCompany,
      licenseNumber: command.licenseNumber,
      workShift:     command.workShift,
    };
  }
}
