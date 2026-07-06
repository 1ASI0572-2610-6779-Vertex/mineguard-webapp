import { Component, Input, inject, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AnalyticsStore } from '../../../application/analytics.store';
import { AdminNotice } from '../../../domain/model/admin-notice.entity';

@Component({
  selector: 'app-admin-notices',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, TranslatePipe],
  templateUrl: './admin-notices.html',
  styleUrl: './admin-notices.css',
})
export class AdminNotices {
  @Input({ required: true }) set notices(value: AdminNotice[]) {
    this.allNotices.set(value);
  }

  private snackBar = inject(MatSnackBar);
  private store    = inject(AnalyticsStore);
  private translate = inject(TranslateService);

  readonly allNotices = signal<AdminNotice[]>([]);
  private readonly dismissedIds = signal<Set<number>>(new Set());
  private readonly readIds = signal<Set<number>>(new Set());

  readonly visibleNotices = computed(() => {
    const dismissed = this.dismissedIds();
    return this.allNotices().filter(n => !dismissed.has(n.id));
  });

  isRead(id: number): boolean {
    return this.readIds().has(id);
  }

  dismiss(notice: AdminNotice): void {
    this.dismissedIds.update(set => {
      const next = new Set(set);
      next.add(notice.id);
      return next;
    });
    this.snackBar.open(this.translate.instant('admin.notices.snack.dismissed'), 'OK', {
      duration: 3000,
      panelClass: ['mg-snack', 'mg-snack--neutral'],
    });
  }

  markRead(notice: AdminNotice): void {
    this.readIds.update(set => {
      const next = new Set(set);
      next.add(notice.id);
      return next;
    });
    // POST /api/v1/companies/{companyId}/notices/{noticeId}/dispatches — registra el re-envío en el backend
    this.store.dispatchNotice(notice.id);
    this.snackBar.open(this.translate.instant('admin.notices.snack.markedRead'), 'OK', {
      duration: 3000,
      panelClass: ['mg-snack', 'mg-snack--success'],
    });
  }

  viewDetails(notice: AdminNotice): void {
    const msg = notice.i18nKey;
    this.snackBar.open(`Detalle: ${msg}`, 'Cerrar', {
      duration: 5000,
      panelClass: ['mg-snack', 'mg-snack--info'],
    });
  }
}
