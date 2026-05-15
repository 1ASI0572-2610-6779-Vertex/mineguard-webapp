import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { CatalogSummary } from '../../../domain/model/catalog-summary.entity';

/**
 * "Resumen del Catálogo" left-side widget surfaced by the admin
 * "Auditoría y Activos" view.
 */
@Component({
  selector: 'app-catalog-summary',
  standalone: true,
  imports: [MatIcon, TranslatePipe],
  templateUrl: './catalog-summary.html',
  styleUrl: './catalog-summary.css',
})
export class CatalogSummaryWidget {
  @Input({ required: true }) summary!: CatalogSummary;
}
