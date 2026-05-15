import { Component, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Layout } from './shared/presentation/components/layout/layout';

/**
 * Root component. Delegates all UI composition to the shared
 * presentation `Layout` shell and only owns the app title + i18n bootstrap.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('mineguard-webapp');

  private translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
  }
}
