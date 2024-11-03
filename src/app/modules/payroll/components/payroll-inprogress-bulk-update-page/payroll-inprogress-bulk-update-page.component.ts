import { Component, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';

import { getPayrollSetupDataAction } from '../../store/payrun-bulk-update/payrun-bulk-update.action';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-inprogress-bulk-update-page',
  templateUrl: './payroll-inprogress-bulk-update-page.component.html',
  styleUrls: ['./payroll-inprogress-bulk-update-page.component.scss']
})
export class PayrollInProgressBulkUpdatePageComponent extends GenericPage {
  public selectedTabIndex: number = 0;
  public payRunId: number;

  constructor(injector: Injector, private route: ActivatedRoute) {
    super(injector);
    this.route.paramMap
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(params => {  
        this.payRunId = Number(params.get('payRunId'));
        this.store.dispatch(getPayrollSetupDataAction({ payRunId: this.payRunId }));
      })
  }

  public handleTabChange(event: any): void {
    localStorage.setItem('selectedTabPayrollBulkUpdate', event.index)
  }

  public onBack(): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, '/payroll/payruns');
  }
}
