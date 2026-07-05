import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { CardiacReading } from '../domain/model/cardiac-reading.entity';
import { CardiacReadingAssembler } from './cardiac-reading-assembler';
import { CardiacReadingResource, CardiacReadingsResponse } from './cardiac-reading-response';

export class CardiacReadingsApiEndpoint extends BaseApiEndpoint<
  CardiacReading,
  CardiacReadingResource,
  CardiacReadingsResponse,
  CardiacReadingAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderCardiacReadingsEndpointPath}`,
      new CardiacReadingAssembler(),
    );
  }

  /**
   * GET /api/v1/driving-sessions/{sessionId}/cardiac-readings
   *
   * @remarks
   * Returns the resource **directly, not wrapped in an array** — a Driving
   * Session has exactly one active driver, so cardiac readings are a singleton.
   */
  getBySessionId(sessionId: number): Observable<CardiacReading> {
    const url = `${this.endpointUrl}/${sessionId}/cardiac-readings`;
    return this.http.get<CardiacReadingResource>(url).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError(`Failed to fetch cardiac reading for session ${sessionId}`)),
    );
  }
}
