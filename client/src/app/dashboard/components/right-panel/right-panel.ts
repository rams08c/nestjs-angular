import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { DataFlowService } from '../../../shared-services/data-flow.service';
import { APP_TEXT } from '../../../app.constant';

@Component({
  selector: 'app-right-panel',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './right-panel.html',
})
export class RightPanel {
  private dataFlowService = inject(DataFlowService);
  readonly text = APP_TEXT.DASHBOARD;
  readonly currentUser = this.dataFlowService.currentUser;
}
