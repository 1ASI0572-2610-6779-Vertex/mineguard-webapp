import { Component, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { Driver } from '../../../domain/model/driver.entity';

/**
 * "Directorio de Conductores" table for the supervisor "Flota y Conductores" view.
 */
@Component({
  selector: 'app-drivers-directory',
  standalone: true,
  imports: [MatIconButton, MatIcon, TranslatePipe],
  templateUrl: './drivers-directory.html',
  styleUrl: './drivers-directory.css',
})
export class DriversDirectory {
  @Input({ required: true }) drivers: Driver[] = [];

  initialsOf(fullName: string): string {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
}
