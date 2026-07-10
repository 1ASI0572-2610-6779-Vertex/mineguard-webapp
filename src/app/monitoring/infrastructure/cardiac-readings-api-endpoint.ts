import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
   *
   * A session that has not reported any beat yet answers `404`. That is an
   * empty result, not a failure, so it resolves to `null` instead of reaching
   * `handleError` and surfacing an error banner over a healthy session.
   */
  getBySessionId(sessionId: number): Observable<CardiacReading | null> {
    const url = `${this.endpointUrl}/${sessionId}/cardiac-readings`;
    return this.http.get<CardiacReadingResource>(url).pipe(
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return of(null);
        return this.handleError(`Failed to fetch cardiac reading for session ${sessionId}`)(error);
      }),
    );
  }
}
