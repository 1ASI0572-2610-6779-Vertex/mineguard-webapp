import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

/** Severity of a user-facing toast, mapped to a `mg-snack--*` panel class. */
type Severity = 'success' | 'error' | 'info' | 'warning';

/**
 * Thin, app-wide wrapper around {@link MatSnackBar} for consistent, empathetic
 * user feedback.
 *
 * @remarks
 * Centralizes the `mg-snack` panel classes (styled from the design tokens in
 * `styles.css`), the localized dismiss label and sensible default durations so
 * every flow surfaces success/error toasts the same way. Messages are passed as
 * i18n keys and resolved through {@link TranslateService}; pass a plain string
 * only when the text is already localized.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  /** Confirms a completed action (green surface). */
  success(messageKey: string, params?: Record<string, unknown>): void {
    this.show('success', messageKey, 5000, params);
  }

  /** Reports a failed action clearly and without jargon (red surface). */
  error(messageKey: string, params?: Record<string, unknown>): void {
    this.show('error', messageKey, 6000, params);
  }

  /** Neutral, informational feedback (accent surface). */
  info(messageKey: string, params?: Record<string, unknown>): void {
    this.show('info', messageKey, 5000, params);
  }

  /** Cautionary feedback (amber surface). */
  warning(messageKey: string, params?: Record<string, unknown>): void {
    this.show('warning', messageKey, 5500, params);
  }

  private show(
    severity: Severity,
    messageKey: string,
    duration: number,
    params?: Record<string, unknown>,
  ): void {
    const config: MatSnackBarConfig = {
      duration,
      panelClass: ['mg-snack', `mg-snack--${severity}`],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };
    this.snackBar.open(
      this.translate.instant(messageKey, params),
      this.translate.instant('common.dismiss'),
      config,
    );
  }
}
