import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DeviceRegistrationError, DevicesStore } from '../../../application/devices.store';
import { RegisterDeviceCommand } from '../../../domain/model/register-device.command';

@Component({
  selector: 'app-devices-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './devices-page.html',
  styleUrl: './devices-page.css',
})
export class DevicesPage implements OnInit {
  private readonly store = inject(DevicesStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  readonly devices = this.store.devices;
  readonly vehicles = this.store.vehicles;
  readonly loading = this.store.loading;
  readonly loadErrorKey = this.store.errorKey;
  private readonly vehicleCodeById = this.store.vehicleCodeById;

  readonly submitting = signal(false);
  readonly formError = signal<DeviceRegistrationError | null>(null);

  readonly deviceCount = computed(() => this.devices().length);

  readonly form = new FormGroup({
    vehicleId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    deviceId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.store.loadVehicles();
    this.store.loadDevices();
  }

  /** Resolves a vehicleId to its vehicle code for the table, falling back to `#id`. */
  vehicleCode(vehicleId: number): string {
    return this.vehicleCodeById().get(vehicleId) ?? `#${vehicleId}`;
  }

  /** Message for the inline error banner: backend text for a conflict, else the i18n key. */
  errorMessage(err: DeviceRegistrationError): string {
    return err.backendMessage?.trim() || this.translate.instant(err.key);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formError.set(null);
    this.submitting.set(true);

    const v = this.form.getRawValue();
    const command = new RegisterDeviceCommand({
      vehicleId: v.vehicleId as number,
      deviceId: v.deviceId.trim(),
    });

    this.store.registerDevice$(command).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset({ vehicleId: null, deviceId: '' });
        this.snackBar.open(
          this.translate.instant('devices.form.successSnack'),
          'OK',
          { duration: 5000, panelClass: ['mg-snack', 'mg-snack--success'] },
        );
      },
      error: (err: DeviceRegistrationError) => {
        this.submitting.set(false);
        this.formError.set(err);
        this.snackBar.open(this.errorMessage(err), 'OK', {
          duration: 6000,
          panelClass: ['mg-snack', 'mg-snack--error'],
        });
      },
    });
  }
}
