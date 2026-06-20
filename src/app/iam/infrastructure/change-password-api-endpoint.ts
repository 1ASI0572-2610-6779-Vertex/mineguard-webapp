import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';

const endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderChangePasswordEndpointPath}`;

/**
 * HTTP endpoint client for PATCH /api/v1/users/me/password.
 * Used exclusively during the forced-password-change flow triggered
 * when the backend sets requiresPasswordChange: true at sign-in.
 */
export class ChangePasswordApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  changePassword(newPassword: string): Observable<void> {
    return this.http
      .patch<void>(endpointUrl, { newPassword })
      .pipe(catchError(this.handleError('Failed to change password')));
  }
}
