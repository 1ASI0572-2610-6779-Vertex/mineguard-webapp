import { Component, Input, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { AuditCategory } from '../../../domain/model/audit-category';
import { AuditLogEntry } from '../../../domain/model/audit-log-entry.entity';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './audit-log.html',
  styleUrl: './audit-log.css',
})
export class AuditLog {
  private readonly entriesSignal = signal<AuditLogEntry[]>([]);

  @Input({ required: true }) set entries(value: AuditLogEntry[]) {
    this.entriesSignal.set(value);
  }

  readonly query = signal<string>('');
  readonly categoryFilter = signal<AuditCategory | 'all'>('all');

  readonly filteredEntries = computed(() => {
    const term = this.query().trim().toLowerCase();
    const cat = this.categoryFilter();
    let result = this.entriesSignal();
    if (cat !== 'all') result = result.filter(e => e.category === cat);
    if (term) {
      result = result.filter(e =>
        e.titleKey.toLowerCase().includes(term) ||
        e.actorKey.toLowerCase().includes(term) ||
        e.category.toLowerCase().includes(term),
      );
    }
    return result;
  });

  readonly counts = computed(() => {
    const all = this.entriesSignal();
    return {
      all: all.length,
      security: all.filter(e => e.category === 'security').length,
      administrative: all.filter(e => e.category === 'administrative').length,
      operational: all.filter(e => e.category === 'operational').length,
    };
  });

  onSearch(value: string): void {
    this.query.set(value);
  }

  setCategory(cat: AuditCategory | 'all'): void {
    this.categoryFilter.set(cat);
  }

  iconForCategory(cat: AuditCategory): string {
    if (cat === 'security') return 'gpp_bad';
    if (cat === 'administrative') return 'manage_accounts';
    return 'construction';
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
