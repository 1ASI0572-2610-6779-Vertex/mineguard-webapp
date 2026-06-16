import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../../iam/application/iam.store';
import { AnalyticsStore } from '../../../application/analytics.store';
import { AdminNotices } from '../../components/admin-notices/admin-notices';
import { AdminStats } from '../../components/admin-stats/admin-stats';

/**
 * Admin control panel ("Resumen del Sistema") view. Reads system-wide
 * administrative KPIs and pending notices from {@link AnalyticsStore} and
 * renders them inside the operations shell.
 */
@Component({
  selector: 'app-admin-summary-page',
  standalone: true,
  imports: [AdminStats, AdminNotices, TranslatePipe],
  templateUrl: './admin-summary-page.html',
  styleUrl: './admin-summary-page.css',
})
export class AdminSummaryPage implements OnInit {
  private store = inject(AnalyticsStore);
  private iamStore = inject(IamStore);

  readonly displayName = this.iamStore.currentUsername;

  readonly summary = this.store.adminSummary;
  readonly notices = this.store.adminNotices;

  ngOnInit(): void {
    this.store.loadAdminSummary();
    this.store.loadAdminNotices();
  }
}
