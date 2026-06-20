import { Component, Input, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { IamStore } from '../../../application/iam.store';
import { Supervisor } from '../../../domain/model/supervisor.entity';

@Component({
  selector: 'app-supervisor-directory',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './supervisor-directory.html',
  styleUrl: './supervisor-directory.css',
})
export class SupervisorDirectory {
  private store = inject(IamStore);
  private snackBar = inject(MatSnackBar);

  @Input({ required: true }) supervisors: Supervisor[] = [];

  readonly query = signal<string>('');
  readonly pendingActionId = signal<number | null>(null);

  readonly filteredSupervisors = computed(() => {
    const term = this.query().trim().toLowerCase();
    if (!term) return this.supervisors;
    return this.supervisors.filter(
      (s) =>
        s.fullName.toLowerCase().includes(term) ||
        s.corporateId.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term),
    );
  });

  onSearch(value: string): void {
    this.query.set(value);
    this.pendingActionId.set(null);
  }

  initialsOf(fullName: string): string {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  }

  requestSuspend(supervisor: Supervisor): void {
    this.pendingActionId.set(supervisor.id);
  }

  cancelAction(): void {
    this.pendingActionId.set(null);
  }

  confirmSuspend(supervisor: Supervisor): void {
    this.pendingActionId.set(null);
    this.store.updateSupervisorAccess(supervisor.id, 'locked');
    this.snackBar.open(`Cuenta de ${supervisor.fullName} suspendida`, 'OK', {
      duration: 3500,
      panelClass: ['mg-snack', 'mg-snack--neutral'],
    });
  }

  restoreAccess(supervisor: Supervisor): void {
    this.store.updateSupervisorAccess(supervisor.id, 'active');
    this.snackBar.open(`Acceso de ${supervisor.fullName} restaurado`, 'OK', {
      duration: 3500,
      panelClass: ['mg-snack', 'mg-snack--success'],
    });
  }
}
