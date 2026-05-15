import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';
import { Supervisor } from '../../../domain/model/supervisor.entity';

/**
 * Right-hand "Directorio de Supervisores" panel for the admin user-management view.
 *
 * @remarks
 * Renders a searchable directory of supervisors with per-row access actions
 * (suspend an active account, reset access for a locked one, or display a
 * read-only history marker for inactive accounts).
 */
@Component({
  selector: 'app-supervisor-directory',
  standalone: true,
  imports: [MatButton, TranslatePipe],
  templateUrl: './supervisor-directory.html',
  styleUrl: './supervisor-directory.css',
})
export class SupervisorDirectory {
  private store = inject(IamStore);

  @Input({ required: true }) supervisors: Supervisor[] = [];

  readonly query = signal<string>('');

  readonly filteredSupervisors = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) return this.supervisors;
    return this.supervisors.filter(
      (s) =>
        s.fullName.toLowerCase().includes(term) ||
        s.corporateId.toLowerCase().includes(term),
    );
  });

  onSearch(value: string): void {
    this.query.set(value);
  }

  initialsOf(fullName: string): string {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }

  suspend(supervisor: Supervisor): void {
    this.store.updateSupervisorAccess(supervisor.id, 'locked');
  }

  restoreAccess(supervisor: Supervisor): void {
    this.store.updateSupervisorAccess(supervisor.id, 'active');
  }
}
