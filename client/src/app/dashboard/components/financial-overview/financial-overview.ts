import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DashboardSignalService } from '../../services/dashboard-signal.service';
import { APP_TEXT } from '../../../app.constant';

@Component({
  selector: 'app-financial-overview',
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './financial-overview.html',
})
export class FinancialOverview {
  private svc = inject(DashboardSignalService);
  readonly text = APP_TEXT.DASHBOARD;
  readonly summary = this.svc.summary;
}
