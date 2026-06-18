import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';
import { environment } from '../../../environments/environment';

export const iamInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(IamStore);

  // Only add headers to backend API requests; skip i18n file loading and other assets.
  const isApiRequest = request.url.startsWith(environment.platformProviderApiBaseUrl);
  if (!isApiRequest) {
    return next(request);
  }

  const token = store.currentToken();
  const lang = localStorage.getItem('mineguard.lang') ?? 'es';

  let headers = request.headers.set('Accept-Language', lang);
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return next(request.clone({ headers }));
};
