import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

/** Options for a confirmation prompt. All text fields are i18n keys. */
export interface ConfirmOptions {
  titleKey: string;
  messageKey: string;
  confirmKey: string;
  cancelKey?: string;
  /** Danger styling (red confirm button, warning icon, cancel focused). */
  danger?: boolean;
  /** Interpolation params for the title/message keys. */
  params?: Record<string, unknown>;
}

/**
 * App-wide confirmation prompts, built on SweetAlert2 with MineGuard theming.
 *
 * @remarks
 * Centralizes the look (accent/danger colors from the design tokens, reversed
 * buttons, localized labels) so every destructive action confirms the same way.
 * Returns a promise resolving to `true` only when the user confirms.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly translate = inject(TranslateService);

  async ask(opts: ConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
      title: this.translate.instant(opts.titleKey, opts.params),
      text: this.translate.instant(opts.messageKey, opts.params),
      icon: opts.danger ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: this.translate.instant(opts.confirmKey),
      cancelButtonText: this.translate.instant(opts.cancelKey ?? 'common.cancel'),
      confirmButtonColor: opts.danger ? '#DC2626' : '#2578F4',
      cancelButtonColor: '#94A3B8',
      reverseButtons: true,
      focusCancel: !!opts.danger,
      customClass: { popup: 'mg-swal' },
    });
    return result.isConfirmed;
  }
}
