import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AuditLogEntry } from '../../../domain/model/audit-log-entry.entity';

/**
 * "Registro de Eventos (Logs)" right-hand panel surfaced by the admin
 * "Auditoría y Activos" view.
 */
@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [MatButton, MatIcon, TranslatePipe],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.css',
})
export class AuditLog {
  @Input({ required: true }) entries: AuditLogEntry[] = [];

  formatTimestamp(isoTimestamp: string): string {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) {
      return isoTimestamp;
    }
    return date.toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
