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

  // GET /api/v1/trips/{tripId}/cardiac-readings
  getByTripId(tripId: number): Observable<CardiacReading[]> {
    const url = `${this.endpointUrl}/${tripId}/cardiac-readings`;
    return this.http.get<CardiacReadingResource[]>(url).pipe(
      map((resources) => resources.map((r) => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError(`Failed to fetch cardiac readings for trip ${tripId}`)),
    );
  }
}
