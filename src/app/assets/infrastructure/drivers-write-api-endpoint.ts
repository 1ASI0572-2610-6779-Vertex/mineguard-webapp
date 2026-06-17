import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SaveDriverCommand } from '../domain/model/save-driver.command';
import { DriverResource } from './driver-response';

interface DriverWriteBody {
  username: string;
  password: string;
  email: string;
  fullName: string;
  idCompany: number;
  licenseNumber: string;
  workShift: string;
}

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderDriversEndpointPath}`;

/**
 * HTTP endpoint client for driver write operations (POST /drivers, PUT /drivers/{id}).
 * Separate from DriversApiEndpoint (GET /driversDirectory) because the write contract
 * uses different fields: username, password, email, idCompany, licenseNumber, workShift.
 */
export class DriversWriteApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  create(command: SaveDriverCommand): Observable<DriverResource> {
    const body = this.toBody(command);
    return this.http.post<DriverResource>(endpointUrl, body).pipe(
      map((res) => res),
      catchError(this.handleError('Failed to create driver')),
    );
  }

  update(command: SaveDriverCommand): Observable<DriverResource> {
    const body = this.toBody(command);
    return this.http.put<DriverResource>(`${endpointUrl}/${command.id}`, body).pipe(
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
      username: command.username,
      password: command.password,
      email: command.email,
      fullName: command.fullName,
      idCompany: command.idCompany,
      licenseNumber: command.licenseNumber,
      workShift: command.workShift,
    };
  }
}
