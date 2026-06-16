// Removed unused NgClass import
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
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
  roles?: string[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
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

  readonly showShell = signal<boolean>(true);
  activeOption = signal<string>('option.dashboard');

  /** Tracks whether the sidenav is open (used for mobile overlay mode). */
  isSidenavOpen = true;

  /** Mini-variant collapsed state — only active when sidenav.mode === 'side'. */
  isCollapsed = false;

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
      icon: 'alt_route',
      path: '/service/planning',
      title: 'option.routeDesign',
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
  ];

  private observer = inject(BreakpointObserver);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  protected store = inject(IamStore);

  constructor() {
    // Re-configure sidenav mode whenever the shell becomes visible after login.
    // ngAfterViewInit already ran (sidenav was undefined then), so we must
    // re-trigger synchronously once the @if block renders the mat-sidenav.
    effect(() => {
      if (this.showShell()) {
        Promise.resolve().then(() => this.reconfigureSidenav());
      }
    });
  }

  readonly visibleOptions = computed(() => {
    const role = this.store.currentRole();
    return this.options.filter((option) => !option.roles || (!!role && option.roles.includes(role)));
  });

  readonly displayName = computed(
    () => this.store.currentUsername() ?? this.translate.instant('layout.user.placeholder.name'),
  );

  readonly displayRole = computed(
    () => this.store.currentRole() ?? this.translate.instant('layout.user.placeholder.role'),
  );

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
        // Mobile: overlay mode — sidenav fully closes, mini-variant irrelevant
        this.sidenav.mode = 'over';
        this.sidenav.close();
        this.isSidenavOpen = false;
        this.isCollapsed = false;
      } else {
        // Desktop: side mode — sidenav always docked, collapse controls width
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

  /**
   * Header menu button handler.
   * - Mobile (over mode): opens/closes the sidenav overlay.
   * - Desktop (side mode): toggles the mini-variant collapsed state.
   */
  toggleMenu(): void {
    if (this.sidenav?.mode === 'over') {
      this.isSidenavOpen = !this.isSidenavOpen;
      this.sidenav.toggle();
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  setActiveOption(option: string): void {
    this.activeOption.set(option);
  }

  performSignOut(): void {
    this.store.signOut(this.router);
  }

  private reconfigureSidenav(): void {
    if (!this.sidenav) return;
    const isNarrow = this.observer.isMatched('(max-width: 1280px)');
    if (isNarrow) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
      this.isSidenavOpen = false;
      this.isCollapsed = false;
    } else {
      this.sidenav.mode = 'side';
      this.sidenav.open();
      this.isSidenavOpen = true;
    }
    this.cdr.detectChanges();
  }

  private static readonly NO_SHELL_ROUTES: readonly string[] = ['/iam/sign-in'];

  private updateShellVisibility(url: string): void {
    const pathOnly = url.split('?')[0].split(';')[0];
    this.showShell.set(!Layout.NO_SHELL_ROUTES.includes(pathOnly));
  }
}
