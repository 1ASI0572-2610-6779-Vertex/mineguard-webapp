import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AssetsStore } from '../../../application/assets.store';
import { Driver } from '../../../domain/model/driver.entity';
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

  revoke(driver: Driver): void {
    this.dialog.open(DriverFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      panelClass: 'mg-dialog',
      data: { driver } as DriverDialogData,
    });
  }
}
