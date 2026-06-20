import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderForgotPasswordEndpointPath}`;

export class ForgotPasswordApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  forgotPassword(email: string): Observable<void> {
    return this.http
      .post<void>(endpointUrl, { email })
      .pipe(catchError(this.handleError('Forgot password request failed')));
  }
}
