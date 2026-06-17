import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../../assets/application/assets.store';
import { CatalogSummaryWidget } from '../../../../assets/presentation/components/catalog-summary/catalog-summary';
import { MonitoringStore } from '../../../application/monitoring.store';
import { AuditLog } from '../../components/audit-log/audit-log';

/**
 * Admin "Auditoría y Activos" view ({@link administrador3.png} wireframe).
 *
 * @remarks
 * Composes the catalog summary widget (owned by the assets BC) on the left
 * and the audit log timeline (owned by the monitoring BC) on the right. Each
 * widget pulls from its own bounded-context store; the view is just a shell.
 */
@Component({
  selector: 'app-audit-and-assets-page',
  standalone: true,
  imports: [CatalogSummaryWidget, AuditLog, TranslatePipe, MatIconModule],
  templateUrl: './audit-and-assets-page.html',
  styleUrl: './audit-and-assets-page.css',
})
export class AuditAndAssetsPage implements OnInit {
  private monitoringStore = inject(MonitoringStore);
  private assetsStore = inject(AssetsStore);

  readonly auditLog = this.monitoringStore.auditLog;
  readonly catalogSummary = this.assetsStore.catalogSummary;

  ngOnInit(): void {
    this.monitoringStore.loadAuditLog();
    this.assetsStore.loadCatalogSummary();
  }
}
