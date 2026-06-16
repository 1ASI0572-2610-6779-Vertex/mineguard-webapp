import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

interface ErrorResource {
  code: string;
  message: string;
  details: string;
}

/**
 * Provides reusable HTTP error translation for infrastructure services.
 * Extracts the ErrorResource body ({ code, message, details }) returned by the API.
 */
export abstract class ErrorHandlingEnabledBaseType {
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else if (error.error && typeof error.error === 'object' && 'message' in error.error) {
        const body = error.error as ErrorResource;
        errorMessage = body.message || `${operation}: ${error.status}`;
      } else {
        errorMessage = `${operation}: ${error.status || 'Unexpected error'}`;
      }

      return throwError(() => new Error(errorMessage));
    };
  }
}
