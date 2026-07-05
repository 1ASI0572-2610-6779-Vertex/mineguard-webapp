import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, shareReplay } from 'rxjs';

import { IamStore } from '../../iam/application/iam.store';
import { CompanyKpis } from '../domain/model/company-kpis';
import { CompanyKpisApiEndpoint } from '../infrastructure/company-kpis-api-endpoint';

/** How long a cached KPIs snapshot is considered fresh (ms). */
const KPIS_TTL_MS = 60_000;

/**
 * Shared application store for the consolidated tenant KPIs.
 *
 * @remarks
 * The `/companies/{companyId}/kpis` resource feeds three different widgets on
 * three different pages (dashboard, catalog summary, fleet summary). Before this
 * store each page fetched it independently — the same payload over the wire up
 * to three times. This store fetches it **once** and lets every context derive
 * its own view model from the cached {@link CompanyKpis} signal.
 *
 * Redundancy is avoided on two levels:
 * - **Freshness cache:** within {@link KPIS_TTL_MS} a repeated `load()` is a
 *   no-op (the signal already holds fresh data).
 * - **In-flight de-duplication:** concurrent `load()` calls (e.g. several widgets
 *   initialising in the same tick) share a single HTTP request via `shareReplay`.
 *
 * The cache is keyed by the authenticated `companyId`, so a tenant switch
 * (sign-out / sign-in as another company) transparently forces a refetch.
 */
@Injectable({ providedIn: 'root' })
export class CompanyKpisStore {
  private readonly api = inject(CompanyKpisApiEndpoint);
  private readonly iam = inject(IamStore);

  private readonly kpisSignal = signal<CompanyKpis | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  /** The cached KPIs snapshot, or null before the first successful load. */
  readonly kpis = this.kpisSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  /** Shared in-flight request, de-duplicating concurrent loads. */
  private inFlight: Observable<CompanyKpis> | null = null;
  /** Tenant the cached value belongs to. */
  private cachedCompanyId: number | null = null;
  /** Epoch millis of the last successful load. */
  private loadedAt = 0;

  /**
   * Ensures the KPIs are loaded, reusing the cache when fresh. Safe to call from
   * many components' `ngOnInit` — redundant calls collapse into at most one HTTP
   * request per TTL window per tenant.
   *
   * @param force - Bypass the freshness cache and refetch (still de-duplicated).
   */
  load(force = false): void {
    const companyId = this.iam.currentCompanyId();
    if (companyId == null) {
      this.errorSignal.set('No authenticated company');
      return;
    }

    if (this.inFlight) return; // a request is already running — reuse it

    const sameTenant = this.cachedCompanyId === companyId;
    const isFresh = sameTenant && this.kpisSignal() != null && Date.now() - this.loadedAt < KPIS_TTL_MS;
    if (!force && isFresh) return;

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.inFlight = this.api.getForCompany(companyId).pipe(
      finalize(() => {
        this.loadingSignal.set(false);
        this.inFlight = null;
      }),
      shareReplay(1),
    );

    this.inFlight.subscribe({
      next: (kpis) => {
        this.kpisSignal.set(kpis);
        this.cachedCompanyId = companyId;
        this.loadedAt = Date.now();
      },
      error: (err) => {
        console.error('Failed to load company KPIs:', err);
        this.errorSignal.set('Failed to load company KPIs');
      },
    });
  }

  /** Forces a refetch regardless of cache freshness. */
  refresh(): void {
    this.load(true);
  }

  /** Drops the cached snapshot (e.g. on sign-out). */
  clear(): void {
    this.kpisSignal.set(null);
    this.cachedCompanyId = null;
    this.loadedAt = 0;
    this.inFlight = null;
  }
}
