import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Terms & Conditions dialog shown from the sign-in screen.
 *
 * @remarks
 * Presentational only — it renders the localized legal copy (`iam.terms.*`) and
 * closes via `mat-dialog-close`. It imposes no gating on the sign-in flow; the
 * link that opens it is purely informational.
 */
@Component({
  selector: 'app-terms-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './terms-dialog.html',
  styleUrl: './terms-dialog.css',
})
export class TermsDialog {
  /** Section keys rendered in order; each maps to `iam.terms.<key>.title/body`. */
  readonly sections = ['s1', 's2', 's3', 's4'] as const;
}
