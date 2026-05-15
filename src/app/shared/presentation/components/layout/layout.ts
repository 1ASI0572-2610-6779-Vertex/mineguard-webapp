import { NgClass } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { IamStore } from '../../../../iam/application/iam.store';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface MenuOption {
  icon: string;
  path: string;
  title: string;
  /**
   * Optional role allow-list. When present, the option is shown only to users
   * whose `IamStore.currentRole()` is in the list. Omit for options visible
   * to every authenticated user.
   */
  roles?: string[];
}

/**
 * Main shell component that hosts top-level navigation and routed content.
 *
 * @remarks
 * Routes under `/iam/` (sign-in, sign-up) render with a clean full-page shell
 * (no sidebar, no toolbar). Every other route uses the operations chrome.
 *
 * The sidebar menu is filtered by the active user role: admins see admin-only
 * entries, supervisors see supervisor-only entries, and shared entries (no
 * `roles` restriction) appear for both.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NgClass,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    TranslatePipe,
    LanguageSwitcher,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  /**
   * Whether the operations shell (sidenav + toolbar) is visible.
   * Routes under `/iam/` opt out of the shell to render full-page auth views.
   */
  readonly showShell = signal<boolean>(true);

  /**
   * Translation key of the currently active menu option.
   */
  activeOption = signal<string>('option.dashboard');
  isSidenavOpen = true;

  /**
   * Master list of menu options. The template renders only those entries the
   * current user is authorized to see; see {@link visibleOptions}.
   */
  readonly options: MenuOption[] = [
    {
      icon: 'monitor_heart',
      path: '/analytics/admin-summary',
      title: 'option.adminSummary',
      roles: ['Administrator'],
    },
    {
      icon: 'manage_accounts',
      path: '/iam/supervisors',
      title: 'option.userManagement',
      roles: ['Administrator'],
    },
    {
      icon: 'verified_user',
      path: '/monitoring/audit-and-assets',
      title: 'option.auditAndAssets',
      roles: ['Administrator'],
    },
    {
      icon: 'dashboard',
      path: '/analytics/dashboard',
      title: 'option.dashboard',
      roles: ['Supervisor'],
    },
    {
      icon: 'map',
      path: '/monitoring/live-map',
      title: 'option.liveMap',
      roles: ['Supervisor'],
    },
    {
      icon: 'crisis_alert',
      path: '/monitoring/alerts',
      title: 'option.alerts',
      roles: ['Supervisor'],
    },
    {
      icon: 'directions_car',
      path: '/assets/fleet-and-drivers',
      title: 'option.fleetAndDrivers',
      roles: ['Supervisor'],
    },
    {
      icon: 'bar_chart',
      path: '/analytics/reports',
      title: 'option.reports',
      roles: ['Supervisor'],
    },
    { icon: 'home', path: '/home', title: 'option.home' },
  ];

  private observer = inject(BreakpointObserver);
  private router = inject(Router);
  private translate = inject(TranslateService);
  protected store = inject(IamStore);

  /**
   * Menu options filtered by the active user role.
   * Options without a `roles` restriction are visible to every authenticated user.
   */
  readonly visibleOptions = computed(() => {
    const role = this.store.currentRole();
    return this.options.filter((option) => !option.roles || (!!role && option.roles.includes(role)));
  });

  /**
   * Display name shown in the sidenav footer.
   * Falls back to the i18n placeholder when no user is signed in.
   */
  readonly displayName = computed(
    () => this.store.currentUsername() ?? this.translate.instant('layout.user.placeholder.name'),
  );

  /**
   * Display role shown in the sidenav footer.
   */
  readonly displayRole = computed(
    () => this.store.currentRole() ?? this.translate.instant('layout.user.placeholder.role'),
  );

  /**
   * Two-letter avatar initials computed from the active username.
   */
  readonly avatarInitials = computed(() => {
    const name = this.store.currentUsername() ?? 'JP';
    const parts = name.split(/[\s._-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });

  ngOnInit(): void {
    this.updateShellVisibility(this.router.url);
  }

  ngAfterViewInit(): void {
    this.observer.observe(['(max-width: 1280px)']).subscribe((response) => {
      if (!this.sidenav) return;

      if (response.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.isSidenavOpen = false;
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
        this.isSidenavOpen = true;
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateShellVisibility(event.urlAfterRedirects);
        const current = this.options.find((option) => option.path === event.urlAfterRedirects);
        if (current) {
          this.activeOption.set(current.title);
        }
      });
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sidenav?.toggle();
  }

  setActiveOption(option: string): void {
    this.activeOption.set(option);
  }

  performSignOut(): void {
    this.store.signOut(this.router);
  }

  /**
   * Explicit allow-list of routes that render full-page (no sidebar, no toolbar).
   * Only sign-in needs the bare shell; every other route — including admin
   * IAM views like `/iam/supervisors` — must stay inside the operations chrome.
   */
  private static readonly NO_SHELL_ROUTES: readonly string[] = ['/iam/sign-in'];

  private updateShellVisibility(url: string): void {
    const pathOnly = url.split('?')[0].split(';')[0];
    this.showShell.set(!Layout.NO_SHELL_ROUTES.includes(pathOnly));
  }
}
