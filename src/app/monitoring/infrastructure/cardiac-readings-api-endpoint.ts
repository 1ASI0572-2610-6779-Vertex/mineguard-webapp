import { HttpClient } from '@angular/common/http';

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
}
