import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AccessStatus } from '../domain/model/access-status';
import { CreateSupervisorCommand } from '../domain/model/create-supervisor.command';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { Supervisor } from '../domain/model/supervisor.entity';
import { User } from '../domain/model/user.entity';
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
}

const SESSION_STORAGE_KEY = 'mineguard.session';

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
   */
  signIn(signInCommand: SignInCommand, router: Router) {
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        const session: PersistedSession = {
          id: signInResource.id,
          username: signInResource.username,
          role: signInResource.role,
          token: signInResource.token,
        };
        this.savePersistedSession(session);
        this.applySession(session);
        const dest = session.role === 'Administrator' ? '/analytics/admin-summary' : '/analytics/dashboard';
        router.navigate([dest]).then();
      },
      error: (err) => {
        console.error('Sign-in failed:', err);
        this.clearPersistedSession();
        this.clearSessionSignals();
        router.navigate(['/iam/sign-in']).then();
      },
    });
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
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.clearPersistedSession();
        this.clearSessionSignals();
        router.navigate(['/iam/sign-up']).then();
      },
    });
  }

  /**
   * Executes the sign-out flow and clears authentication state.
   *
   * @param router - Angular Router for post-sign-out navigation
   */
  signOut(router: Router) {
    this.clearPersistedSession();
    this.clearSessionSignals();
    router.navigate(['/iam/sign-in']).then();
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
  }
}
