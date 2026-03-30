import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_TEXT } from '../../../app.constant';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-nav.html',
})
export class SidebarNav {
  readonly text = APP_TEXT.DASHBOARD;

  readonly navItems: NavItem[] = [
    { label: this.text.NAV_DASHBOARD, route: '/dashboard', icon: '🏠' },
    { label: this.text.NAV_TRANSACTIONS, route: '/transactions', icon: '💳' },
    { label: this.text.NAV_BUDGETS, route: '/budgets', icon: '📊' },
    { label: this.text.NAV_GOALS, route: '/goals', icon: '🎯' },
    { label: this.text.NAV_REPORTS, route: '/reports', icon: '📈' },
    { label: this.text.NAV_ACCOUNTS, route: '/accounts', icon: '🏦' },
    { label: this.text.NAV_SETTINGS, route: '/settings', icon: '⚙️' },
  ];
}
