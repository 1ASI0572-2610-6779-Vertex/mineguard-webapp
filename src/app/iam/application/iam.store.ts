import { computed, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AccessStatus } from '../domain/model/access-status';
import { CreateSupervisorCommand } from '../domain/model/create-supervisor.command';
import { RegisterCompanyCommand } from '../domain/model/register-company.command';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { Supervisor } from '../domain/model/supervisor.entity';
import { User } from '../domain/model/user.entity';
import { CompanyRegistrationResponse } from '../infrastructure/company-registration-response';
import { SubscriptionPlan } from '../infrastructure/company-registration.request';
import { IamApi } from '../infrastructure/iam-api';

/**
 * Persisted IAM session payload kept in browser storage.
 *
 * @remarks
 * Captured at sign-in success and rehydrated on app startup so that a page
 * reload does not destroy the authenticated session.
 */
interface PersistedSession {
  id: number;
  username: string;
  role: string;
  token: string;
  companyId: number | null;
  subscriptionPlan: SubscriptionPlan | null;
  /** Registered display name of the account owner (resolved from the profile directory). */
  fullName: string | null;
  /** Legal name of the company the account belongs to (resolved from the profile directory). */
  companyName: string | null;
}

/**
 * Lightweight profile captured at registration time so the sidebar can show the
 * real person name and company name — neither is returned by the sign-in
 * endpoint (which only yields username, role, companyId and plan).
 */
interface StoredProfile {
  fullName: string;
  companyName: string;
}

const SESSION_STORAGE_KEY = 'mineguard.session';

/**
 * localStorage key for the profile directory: a map of `username → StoredProfile`.
 * Populated when a company is registered (admin account) and when supervisors are
 * created, then read back at sign-in to enrich the session.
 */
const PROFILES_STORAGE_KEY = 'mineguard.profiles';

/**
 * Application service managing IAM domain state and authentication orchestration.
 *
 * @remarks
 * In Domain-Driven Design, this is an application service that:
 * - Manages the state of the authenticated user session
 * - Coordinates authentication flows (sign-in, sign-up, sign-out)
 * - Integrates with the infrastructure layer (IamApi)
 * - Handles navigation after authentication state changes
 *
 * The store maintains user session state through Angular signals:
 * - Authentication status (signed in or not)
 * - Current user information (username, ID, role)
 * - Authentication token in browser storage
 * - Collection of all users in the system
 * - Loading and error states
 *
 * Session is persisted under the {@link SESSION_STORAGE_KEY} localStorage key
 * and rehydrated automatically when the store is instantiated, so a hard
 * refresh of the SPA keeps the user signed in until they explicitly sign out
 * or the token is invalidated by the backend.
 */
@Injectable({ providedIn: 'root' })
export class IamStore {
  /**
   * Signal tracking the authentication status of the current session.
   * @private
   */
  private readonly isSignedInSignal = signal<boolean>(false);

  /**
   * Signal storing the username of the authenticated user.
   * @private
   */
  private readonly currentUsernameSignal = signal<string | null>(null);

  /**
   * Signal storing the ID of the authenticated user.
   * @private
   */
  private readonly currentUserIdSignal = signal<number | null>(null);

  /**
   * Signal storing the role of the authenticated user.
   * Used by route guards to authorize access to role-restricted views.
   * @private
   */
  private readonly currentRoleSignal = signal<string | null>(null);

  /**
   * Signal storing the persisted token of the authenticated user.
   * Kept as a signal (not just a localStorage read) so guards/interceptors
   * react to sign-in / sign-out reactively.
   * @private
   */
  private readonly currentTokenSignal = signal<string | null>(null);

  /** companyId decoded from the JWT payload at sign-in time. */
  private readonly currentCompanyIdSignal = signal<number | null>(null);

  /** Subscription plan of the authenticated user's company (from sign-in). */
  private readonly currentSubscriptionPlanSignal = signal<SubscriptionPlan | null>(null);

  /** Registered full name of the current user (from the profile directory). */
  private readonly currentFullNameSignal = signal<string | null>(null);

  /** Company name of the current user (from the profile directory). */
  private readonly currentCompanyNameSignal = signal<string | null>(null);

  /**
   * Signal containing all users in the system (for queries/search).
   * @private
   */
  private readonly usersSignal = signal<Array<User>>([]);

  /**
   * Signal holding the supervisor directory used by the admin
   * "Gestión de Usuarios" view.
   * @private
   */
  private readonly supervisorsSignal = signal<Supervisor[]>([]);

  /**
   * Signal holding the last admin operation error message.
   * @private
   */
  private readonly supervisorsErrorSignal = signal<string | null>(null);

  /**
   * Readonly signal indicating if the user is currently signed in.
   */
  readonly isSignedIn = this.isSignedInSignal.asReadonly();

  /**
   * Signal indicating whether user data is currently being loaded.
   */
  readonly loadingUsers = signal<boolean>(false);

  /**
   * Readonly signal for the username of the currently authenticated user.
   */
  readonly currentUsername = this.currentUsernameSignal.asReadonly();

  /**
   * Readonly signal for the ID of the currently authenticated user.
   */
  readonly currentUserId = this.currentUserIdSignal.asReadonly();

  /**
   * Readonly signal for the role of the currently authenticated user.
   * Contains null when no user is signed in.
   */
  readonly currentRole = this.currentRoleSignal.asReadonly();

  /**
   * Computed signal that exposes the current authentication token.
   *
   * @remarks
   * Returns null when not signed in; the value is driven by the rehydrated
   * session signal, so it updates automatically after sign-in / sign-out.
   */
  readonly currentToken = computed(() =>
    this.isSignedIn() ? this.currentTokenSignal() : null,
  );

  /** companyId from the JWT payload. Used by write operations that require tenant scoping. */
  readonly currentCompanyId = this.currentCompanyIdSignal.asReadonly();

  /** Subscription plan of the current company (STARTER/STANDARD/ENTERPRISE). */
  readonly currentSubscriptionPlan = this.currentSubscriptionPlanSignal.asReadonly();

  /** Registered full name of the current user; null when unknown (fallback to username in UI). */
  readonly currentFullName = this.currentFullNameSignal.asReadonly();

  /** Company name of the current user; null when unknown (fallback to "Company #id" in UI). */
  readonly currentCompanyName = this.currentCompanyNameSignal.asReadonly();

  /**
   * Readonly signal for the list of users retrieved by user queries.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Readonly signal indicating if users are currently being loaded.
   */
  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  /**
   * Readonly signal exposing the supervisor directory.
   */
  readonly supervisors = this.supervisorsSignal.asReadonly();

  /**
   * Readonly signal exposing the last admin operation error.
   */
  readonly supervisorsError = this.supervisorsErrorSignal.asReadonly();

  /**
   * Creates an instance of IamStore.
   *
   * @param iamApi - The infrastructure API service for IAM operations
   *
   * @remarks
   * Attempts to rehydrate a previously persisted session from localStorage.
   * If a valid session is found, signals are populated as if the user had
   * just signed in. Otherwise, the store starts in a guest state.
   */
  constructor(private iamApi: IamApi) {
    const persisted = this.loadPersistedSession();
    if (persisted) {
      this.applySession(persisted);
    } else {
      this.clearSessionSignals();
    }
  }

  /**
   * Executes the sign-in flow and updates authentication state.
   *
   * @param signInCommand - Domain command containing user credentials
   * @param router - Angular Router for post-authentication navigation
   * @returns A cold Observable that completes once the session is persisted and
   *   the post-auth navigation is dispatched, or errors with the original HTTP
   *   failure so the caller can surface user feedback (e.g. a toast on `401`).
   *   The session is left clean on failure.
   *
   * @remarks
   * The success side effects (session persistence + redirect) run inside the
   * pipeline, so the caller only needs to `subscribe` and handle loading/error.
   */
  signIn(signInCommand: SignInCommand, router: Router): Observable<void> {
    return this.iamApi.signIn(signInCommand).pipe(
      tap((signInResource) => {
        const profile = this.lookupProfile(signInResource.username);
        const session: PersistedSession = {
          id:        signInResource.id,
          username:  signInResource.username,
          role:      signInResource.role,
          token:     signInResource.token,
          companyId: this.resolveCompanyId(signInResource.token, signInResource.username),
          subscriptionPlan: signInResource.subscriptionPlan ?? 'STANDARD',
          fullName:    profile?.fullName ?? null,
          companyName: profile?.companyName ?? null,
        };
        this.savePersistedSession(session);
        this.applySession(session);

        if (signInResource.requiresPasswordChange) {
          // Token saved so the interceptor can authenticate the PUT /authentication/change-password call.
          router.navigate(['/change-password']).then();
        } else {
          router.navigate([this.landingForRole(session.role)]).then();
        }
      }),
      map(() => void 0),
      catchError((err) => {
        console.error('Sign-in failed:', err);
        this.clearPersistedSession();
        this.clearSessionSignals();
        return throwError(() => err);
      }),
    );
  }

  /**
   * Requests a password-reset email from the backend.
   * Returns the raw Observable so the caller can manage its own loading/success state.
   * The backend always responds 200 OK regardless of whether the email exists
   * (security best practice — never reveal email existence).
   */
  forgotPassword(email: string): Observable<void> {
    return this.iamApi.forgotPassword(email);
  }

  /**
   * Sends the new password to the backend.
   * Returns the raw Observable so the caller manages loading/error state.
   * Navigation to the dashboard is handled by the caller on success.
   */
  changePassword(newPassword: string): Observable<void> {
    return this.iamApi.changePassword(newPassword);
  }

  /** Resolves the post-change-password destination based on the current role. */
  postChangePasswordDestination(): string {
    return this.landingForRole(this.currentRole());
  }

  /**
   * Maps a role to its default landing route.
   *
   * @remarks
   * Administrators land on the system overview; every other authenticated role
   * (Supervisor) lands on the operational dashboard. Used after sign-in, after a
   * mandatory password change, and by `role.guard` when redirecting a user away
   * from a view their role cannot access.
   */
  landingForRole(role: string | null): string {
    return role === 'Administrator' ? '/admin-overview' : '/dashboard';
  }

  /**
   * Executes the sign-up flow (user registration).
   *
   * @param signUpCommand - Domain command containing new user credentials
   * @param router - Angular Router for post-registration navigation
   */
  signUp(signUpCommand: SignUpCommand, router: Router) {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: () => {
        router.navigate(['/login']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.clearPersistedSession();
        this.clearSessionSignals();
        router.navigate(['/register-company']).then();
      },
    });
  }

  /**
   * Registers a new company (tenant) through the IAM API.
   *
   * @remarks
   * Returns the raw Observable so the caller manages its own loading/success/error
   * state. On success the emitted {@link CompanyRegistrationResponse} carries the
   * generated `adminUsername` and telemetry `apiKey` that must be shown to the
   * user. Unlike sign-in, this does not mutate the authenticated session — the new
   * admin still has to sign in afterwards with the emailed temporary password.
   */
  registerCompany(command: RegisterCompanyCommand): Observable<CompanyRegistrationResponse> {
    return this.iamApi.registerCompany(command);
  }

  /**
   * Executes the sign-out flow and clears authentication state.
   *
   * @param router - Angular Router for post-sign-out navigation
   */
  signOut(router: Router) {
    this.clearPersistedSession();
    this.clearSessionSignals();
    router.navigate(['/login']).then();
  }

  /**
   * Initiates loading of all users into the store state.
   *
   * @todo Implement the actual user loading logic with API calls
   */
  loadUsers() {
    this.loadingUsers.set(true);
    // TODO: Implement user loading logic
  }

  /**
   * Loads the supervisor directory from the IAM API.
   *
   * @remarks
   * Called on-demand from the admin "Gestión de Usuarios" view, so no
   * `takeUntilDestroyed()` is applied (the store is a root singleton and the
   * call happens outside Angular's injection context).
   */
  loadSupervisors(): void {
    this.supervisorsErrorSignal.set(null);
    this.iamApi.getSupervisors().subscribe({
      next: (supervisors) => this.supervisorsSignal.set(supervisors),
      error: (err) => {
        console.error('Failed to load supervisors:', err);
        this.supervisorsErrorSignal.set('Failed to load supervisors');
      },
    });
  }

  /**
   * Registers a new supervisor through the IAM API and appends the resulting
   * entity to the local directory signal on success.
   */
  createSupervisor(command: CreateSupervisorCommand): void {
    this.supervisorsErrorSignal.set(null);
    this.iamApi.createSupervisor(command).subscribe({
      next: (supervisor) => {
        this.supervisorsSignal.update((list) => [...list, supervisor]);
        // Record the supervisor's profile (company inherited from the admin's
        // session) so their own sidebar shows a real name and company on sign-in.
        this.rememberProfile(
          supervisor.corporateId,
          supervisor.fullName,
          this.currentCompanyName() ?? '',
        );
      },
      error: (err) => {
        console.error('Failed to create supervisor:', err);
        this.supervisorsErrorSignal.set('Failed to create supervisor');
      },
    });
  }

  /**
   * Updates the access status of an existing supervisor and replaces the
   * entry in the local directory signal on success.
   */
  updateSupervisorAccess(supervisorId: number, accessStatus: AccessStatus): void {
    const current = this.supervisorsSignal().find((s) => s.id === supervisorId);
    if (!current) return;

    const updated = new Supervisor({
      id: current.id,
      fullName: current.fullName,
      corporateId: current.corporateId,
      email: current.email,
      accessStatus,
    });

    this.supervisorsErrorSignal.set(null);
    this.iamApi.updateSupervisor(updated).subscribe({
      next: (supervisor) => {
        this.supervisorsSignal.update((list) =>
          list.map((s) => (s.id === supervisor.id ? supervisor : s)),
        );
      },
      error: (err) => {
        console.error('Failed to update supervisor access:', err);
        this.supervisorsErrorSignal.set('Failed to update supervisor access');
      },
    });
  }

  /**
   * Reads and parses the persisted session from localStorage, if any.
   *
   * @returns The persisted session or null when absent or unparseable.
   * @private
   */
  private loadPersistedSession(): PersistedSession | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as Partial<PersistedSession>;
      if (
        typeof session.id === 'number' &&
        typeof session.username === 'string' &&
        typeof session.role === 'string' &&
        typeof session.token === 'string'
      ) {
        // Re-resolve companyId whenever it is missing (older sessions, or a JWT
        // that simply does not carry the claim) — from the token first, then the
        // structured username as a fallback.
        if (session.companyId == null) {
          session.companyId = this.resolveCompanyId(session.token, session.username ?? '');
        }
        // subscriptionPlan may be absent in sessions persisted before this
        // change — default to STANDARD (backend's own default).
        if (session.subscriptionPlan == null) {
          session.subscriptionPlan = 'STANDARD';
        }
        // fullName / companyName may be absent in older sessions, or the profile
        // may have been recorded after sign-in — re-resolve from the directory.
        if (session.fullName == null || session.companyName == null) {
          const profile = this.lookupProfile(session.username ?? '');
          session.fullName = session.fullName ?? profile?.fullName ?? null;
          session.companyName = session.companyName ?? profile?.companyName ?? null;
        }
        return session as PersistedSession;
      }
      this.clearPersistedSession();
      return null;
    } catch {
      this.clearPersistedSession();
      return null;
    }
  }

  /**
   * Resolves the authenticated tenant id from the best available source.
   *
   * @remarks
   * The platform JWT does **not** currently carry a `companyId` claim (its
   * payload is only `sub`/`iat`/`exp`), so decoding the token alone yields null
   * and every tenant-scoped call — including the dashboard KPIs — never fires,
   * leaving the control center stuck on "loading". As a fallback we parse the
   * tenant id from the structured username (`admin-{companyId}-{seq}`,
   * `SUP-{companyId}-{seq}`, `CDT-{companyId}-{seq}`). This is safe: the backend
   * independently validates that the path `companyId` matches the JWT's real
   * tenant and returns `404` (never another tenant's data) on any mismatch.
   *
   * When the backend starts embedding `companyId` in the JWT, that value wins
   * automatically and the username fallback becomes a no-op.
   * @private
   */
  private resolveCompanyId(token: string, username: string): number | null {
    return this.decodeCompanyIdFromJwt(token) ?? this.parseCompanyIdFromUsername(username);
  }

  /**
   * Extracts the tenant id embedded as the middle segment of a platform
   * username (e.g. `SUP-1-001` → 1, `admin-42-01` → 42). Returns null when the
   * username does not follow the `PREFIX-{companyId}-{seq}` shape.
   * @private
   */
  private parseCompanyIdFromUsername(username: string): number | null {
    const match = /^[A-Za-z]+-(\d+)-\d+$/.exec((username ?? '').trim());
    return match ? Number(match[1]) : null;
  }

  /**
   * Decodes the `companyId` claim from a JWT payload.
   *
   * @remarks
   * JWTs are encoded with **base64url** (`-`/`_`, no padding), not standard
   * base64 — decoding the payload with a bare `atob()` throws as soon as the
   * segment contains a `-` or `_`. We normalise base64url → base64 first, and
   * accept the claim as either a number or a numeric string. Returns null when
   * the token carries no `companyId` claim (the current backend behaviour).
   *
   * @returns The tenant id, or null if the token is malformed or the claim is absent.
   * @private
   */
  private decodeCompanyIdFromJwt(token: string): number | null {
    const payload = this.decodeJwtPayload(token);
    if (!payload) return null;

    // Primary claim is `companyId`; tolerate a snake_case variant defensively.
    const raw = payload['companyId'] ?? payload['company_id'];
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() !== '' && !Number.isNaN(Number(raw))) {
      return Number(raw);
    }
    return null;
  }

  /**
   * Safely decodes a JWT payload segment (base64url, UTF-8) into an object.
   * Returns null on any malformed input instead of throwing.
   * @private
   */
  private decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
      const segment = token.split('.')[1];
      if (!segment) return null;

      // base64url → base64, then restore padding to a multiple of 4.
      const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

      // Decode bytes and re-interpret as UTF-8 (claims may contain non-ASCII).
      const json = decodeURIComponent(
        atob(padded)
          .split('')
          .map((char) => '%' + char.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(''),
      );
      return JSON.parse(json) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  /**
   * Persists the given session to localStorage.
   * @private
   */
  private savePersistedSession(session: PersistedSession): void {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  /**
   * Removes any persisted session from localStorage.
   * @private
   */
  private clearPersistedSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  /**
   * Updates the session signals from a (rehydrated or freshly authenticated) session.
   * @private
   */
  private applySession(session: PersistedSession): void {
    this.isSignedInSignal.set(true);
    this.currentUsernameSignal.set(session.username);
    this.currentUserIdSignal.set(session.id);
    this.currentRoleSignal.set(session.role);
    this.currentTokenSignal.set(session.token);
    this.currentCompanyIdSignal.set(session.companyId ?? null);
    this.currentSubscriptionPlanSignal.set(session.subscriptionPlan ?? null);
    this.currentFullNameSignal.set(session.fullName ?? null);
    this.currentCompanyNameSignal.set(session.companyName ?? null);
  }

  /**
   * Resets every session-related signal to its guest state.
   * @private
   */
  private clearSessionSignals(): void {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentRoleSignal.set(null);
    this.currentTokenSignal.set(null);
    this.currentCompanyIdSignal.set(null);
    this.currentSubscriptionPlanSignal.set(null);
    this.currentFullNameSignal.set(null);
    this.currentCompanyNameSignal.set(null);
  }

  /**
   * Persists a `username → { fullName, companyName }` entry in the profile
   * directory so a later sign-in with that username can enrich the session.
   *
   * @remarks
   * Best-effort and browser-local: it bridges registration data (which the
   * backend does not echo back at sign-in) to the sidebar. A sign-in from a
   * different browser simply falls back to username / "Company #id".
   */
  rememberProfile(username: string, fullName: string, companyName: string): void {
    const cleanUser = (username ?? '').trim();
    if (!cleanUser) return;
    const directory = this.loadProfiles();
    directory[cleanUser] = {
      fullName: (fullName ?? '').trim(),
      companyName: (companyName ?? '').trim(),
    };
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(directory));
    } catch {
      // Storage full or unavailable — profile enrichment is non-critical.
    }
  }

  /** Reads the stored profile for a username, or null when none is recorded. */
  private lookupProfile(username: string): StoredProfile | null {
    const entry = this.loadProfiles()[(username ?? '').trim()];
    return entry && entry.fullName ? entry : null;
  }

  /** Reads and parses the profile directory from localStorage (empty map on any error). */
  private loadProfiles(): Record<string, StoredProfile> {
    try {
      const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, StoredProfile>;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }
}
