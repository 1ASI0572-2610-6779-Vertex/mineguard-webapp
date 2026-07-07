import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Simulated payment gateway — a Stripe/PayPal-grade checkout overlay.
 *
 * @remarks
 * Presentational + self-contained. It receives the chosen plan name key and its
 * monthly base amount, renders a professional price breakdown (subtotal + IGV/VAT
 * + total), a framed QR code, and a 10-minute countdown, then fakes a
 * bank-verification round-trip before emitting {@link verify}.
 *
 * It performs **no** network I/O of its own: the parent keeps the registration
 * payload in client state and fires the single real `POST` only after this
 * component reports a successful (simulated) payment. Cancelling emits
 * {@link cancel} and leaves the parent's form untouched.
 */
@Component({
  selector: 'app-payment-checkout',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslatePipe],
  templateUrl: './payment-checkout.html',
  // Reuse the auth design tokens (:host CSS variables) + local checkout styles.
  styleUrls: ['../../views/auth-shell.css', './payment-checkout.css'],
})
export class PaymentCheckout implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  /** i18n key of the plan being purchased (e.g. `iam.registerCompany.plans.standard.name`). */
  readonly planNameKey = input.required<string>();
  /** Monthly base price of the plan, in USD, before tax. */
  readonly amount = input.required<number>();
  /**
   * True while the parent is firing the real backend request after a verified
   * payment. Keeps the "payment verified" success screen on-screen until the
   * parent swaps in the credentials view (or surfaces an error).
   */
  readonly processing = input<boolean>(false);

  /** Emitted once the simulated bank verification succeeds — parent fires the real POST. */
  readonly verify = output<void>();
  /** Emitted when the user abandons the checkout. */
  readonly cancel = output<void>();

  // ── Pricing breakdown ──────────────────────────────────────────────
  /** Peru IGV / general VAT rate applied to the subtotal. */
  private readonly TAX_RATE = 0.18;
  private readonly currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  readonly subtotal = computed(() => this.amount());
  readonly tax = computed(() => this.subtotal() * this.TAX_RATE);
  readonly total = computed(() => this.subtotal() + this.tax());

  readonly subtotalLabel = computed(() => this.currency.format(this.subtotal()));
  readonly taxLabel = computed(() => this.currency.format(this.tax()));
  readonly totalLabel = computed(() => this.currency.format(this.total()));

  /** Human-readable order reference shown on the receipt (stable per checkout). */
  readonly reference = this.buildReference();

  // ── Countdown timer (10:00) ────────────────────────────────────────
  private readonly TOTAL_SECONDS = 600;
  private readonly remaining = signal(this.TOTAL_SECONDS);
  private intervalId: ReturnType<typeof setInterval> | undefined;

  /** True once the payment window elapses — disables the verify action. */
  readonly expired = computed(() => this.remaining() <= 0);

  /** `mm:ss` label for the countdown badge. */
  readonly timeLabel = computed(() => {
    const secs = Math.max(0, this.remaining());
    const mm = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  });

  /** True in the final 60s — drives the "urgent" red styling of the badge. */
  readonly urgent = computed(() => this.remaining() <= 60 && this.remaining() > 0);

  // ── Verification state ─────────────────────────────────────────────
  /** True during the fake 3–5s "validating with your bank" delay. */
  readonly verifying = signal(false);
  /** True after verification resolves — shows the success micro-screen. */
  readonly verified = signal(false);

  ngOnInit(): void {
    this.startTimer();
    // Guarantee the interval is torn down with the component.
    this.destroyRef.onDestroy(() => this.stopTimer());
  }

  /**
   * Runs the simulated bank verification: disables the button, shows the spinner,
   * waits a randomized 3–5s, then reveals the success state and asks the parent
   * to persist the account.
   */
  onVerify(): void {
    if (this.expired() || this.verifying() || this.verified()) return;

    this.verifying.set(true);
    const delay = 3000 + Math.floor(Math.random() * 2000); // 3000–5000 ms
    const timeoutId = setTimeout(() => {
      this.verifying.set(false);
      this.verified.set(true);
      this.stopTimer();
      this.verify.emit();
    }, delay);
    this.destroyRef.onDestroy(() => clearTimeout(timeoutId));
  }

  /** Regenerates the payment window after it expires. */
  regenerate(): void {
    this.remaining.set(this.TOTAL_SECONDS);
    this.startTimer();
  }

  onCancel(): void {
    if (this.verifying() || this.verified()) return;
    this.cancel.emit();
  }

  // ── Internals ──────────────────────────────────────────────────────
  private startTimer(): void {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      this.remaining.update((value) => {
        if (value <= 1) {
          this.stopTimer();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private buildReference(): string {
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `MG-${new Date().getFullYear()}-${rand}`;
  }
}
