import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { Driver } from '../../../domain/model/driver.entity';
import { ConfirmService } from '../../../../shared/presentation/services/confirm.service';
import { NotificationService } from '../../../../shared/presentation/services/notification.service';
import { DriverDialogData, DriverFormDialog } from '../driver-form-dialog/driver-form-dialog';

@Component({
  selector: 'app-drivers-directory',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDialogModule, TranslatePipe],
  templateUrl: './drivers-directory.html',
  styleUrl: './drivers-directory.css',
})
export class DriversDirectory {
  private store  = inject(AssetsStore);
  private dialog = inject(MatDialog);
  private confirm = inject(ConfirmService);
  private notify = inject(NotificationService);

  @Input({ required: true }) drivers: Driver[] = [];

  initialsOf(fullName: string): string {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  }

  openEdit(driver: Driver): void {
    this.dialog.open(DriverFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      panelClass: 'mg-dialog',
      data: { driver } as DriverDialogData,
    });
  }

  /** Soft-deletes (deactivates) a driver after confirmation. History is preserved. */
  async deactivate(driver: Driver): Promise<void> {
    const ok = await this.confirm.ask({
      titleKey: 'assets.fleet.drivers.confirm.deactivate.title',
      messageKey: 'assets.fleet.drivers.confirm.deactivate.message',
      confirmKey: 'assets.fleet.drivers.confirm.deactivate.confirm',
      danger: true,
      params: { name: driver.fullName },
    });
    if (!ok) return;

    this.store.deactivateDriver$(driver.id).subscribe({
      next: () => this.notify.success('assets.fleet.drivers.deactivatedSnack', { name: driver.fullName }),
      error: () => this.notify.error('assets.fleet.drivers.deactivateError'),
    });
  }
}
