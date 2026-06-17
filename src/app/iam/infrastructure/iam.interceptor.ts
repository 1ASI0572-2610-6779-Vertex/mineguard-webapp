import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IamStore } from '../application/iam.store';

export const iamInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(IamStore);
  const translate = inject(TranslateService);
  const token = store.currentToken();
  const lang = translate.currentLang || translate.defaultLang || 'es';

  let headers = request.headers.set('Accept-Language', lang);
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return next(request.clone({ headers }));
};
