import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { IamStore } from '../../../../iam/application/iam.store';
import { AnalyticsStore } from '../../../application/analytics.store';
import { AdminNotices } from '../../components/admin-notices/admin-notices';
import { AdminStats } from '../../components/admin-stats/admin-stats';

@Component({
  selector: 'app-admin-summary-page',
  standalone: true,
  imports: [AdminStats, AdminNotices, MatIconModule],
  templateUrl: './admin-summary-page.html',
  styleUrl: './admin-summary-page.css',
})
export class AdminSummaryPage implements OnInit {
  private store = inject(AnalyticsStore);
  private iamStore = inject(IamStore);

  readonly displayName = this.iamStore.currentUsername;
  readonly summary = this.store.adminSummary;
  readonly notices = this.store.adminNotices;

  readonly todayLabel = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  ngOnInit(): void {
    this.store.loadAdminSummary();
    this.store.loadAdminNotices();
  }
}
