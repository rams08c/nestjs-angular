import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { APP_TEXT } from '../../../app.constant';

@Component({
  selector: 'app-top-categories',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-categories.html',
})
export class TopCategories {
  private svc = inject(DashboardSignalService);
  readonly text = APP_TEXT.DASHBOARD;
  readonly topCategories = this.svc.topCategories;
  readonly colors: string[] = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-neutral'];
}
