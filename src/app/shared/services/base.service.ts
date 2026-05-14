import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

export abstract class BaseService<T> {
  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  protected serviceBaseUrl: string = `${environment.serverBasePath}`;
  protected resourceEndPoint: string = '/resources';
  protected http: HttpClient = inject(HttpClient);

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`An error occurred: ${error.error.message}`);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  protected resourcePath(): string {
    return `${this.serviceBaseUrl}${this.resourceEndPoint}`;
  }

  public create(resource: T): Observable<T> {
    return this.http
      .post<T>(this.resourcePath(), JSON.stringify(resource), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public delete(id: any): Observable<T> {
    return this.http
      .delete<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public update(id: any, resource: T): Observable<T> {
    return this.http
      .put<T>(
        `${this.resourcePath()}/${id}`,
        JSON.stringify(resource),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  public updateByQuery(
    query: Record<string, string | number>,
    resource: T
  ): Observable<T[]> {
    const queryParams = new URLSearchParams();

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        queryParams.set(key, query[key].toString());
      }
    }

    return this.http
      .put<T[]>(
        `${this.resourcePath()}?${queryParams}`,
        JSON.stringify([resource]),
        this.httpOptions
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  public getAll(): Observable<Array<T>> {
    return this.http
      .get<Array<T>>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getByQuery(
    query: Record<string, string | number>
  ): Observable<Array<T>> {
    const queryParams = new URLSearchParams();

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        queryParams.set(key, query[key].toString());
      }
    }

    return this.http
      .get<Array<T>>(`${this.resourcePath()}?${queryParams}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getById(id: any): Observable<T> {
    return this.http
      .get<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
