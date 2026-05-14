import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from './public/components/language-switcher/language-switcher.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { filter } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

interface MenuOption {
  icon: string;
  path: string;
  title: string;
  roles?: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    LanguageSwitcherComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'MineGuard';

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  activeOption: string = 'Centro de Control';
  isSidenavOpen = true;

  allOptions: MenuOption[] = [
    {
      icon: 'dashboard',
      path: '/dashboard',
      title: 'Centro de Control',
    },
    {
      icon: 'home',
      path: '/home',
      title: 'homeTitle',
    },
  ];

  otherOptions: MenuOption[] = this.allOptions;

  constructor(
    private translate: TranslateService,
    private observer: BreakpointObserver,
    private router: Router,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
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
        const currentOption = this.allOptions.find(
          (option) => option.path === event.urlAfterRedirects,
        );

        if (currentOption) {
          this.activeOption = currentOption.title;
        }
      });
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;

    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  setActiveOption(option: string): void {
    this.activeOption = option;
  }
}
