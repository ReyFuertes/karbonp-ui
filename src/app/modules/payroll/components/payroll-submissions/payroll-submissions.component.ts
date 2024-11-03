import { Component, Injector, ViewChild } from '@angular/core';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayrollTaxSubmissionsAction, getPayrollMonhtlyEmp201SubmissionsAction, getPayrollMonthlyUIFSubmissionsAction, getIncomeAndBenefitTypesSubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { PayrollSubmissionsFilingDetailsDialogComponent } from '../payroll-submissions-filing-details-dialog/payroll-submissions-filing-details-dialog.component';
import { getFilingdetailsSetupAction } from '../../store/payroll-filing-details/payroll-filing-details.action';

@Component({
  selector: 'kp-payroll-submissions',
  templateUrl: './payroll-submissions.component.html',
  styleUrls: ['./payroll-submissions.component.scss']
})
export class PayrollSubmissionsComponent extends GenericPage {
  @ViewChild('psfdd') public psfdd: PayrollSubmissionsFilingDetailsDialogComponent

  public activeIndex: number = 0;
  public showDialog: boolean = false;
  public visibilityIrp5It3: boolean = false;

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(getPayrollMonhtlyEmp201SubmissionsAction());
    this.store.dispatch(getPayrollMonthlyUIFSubmissionsAction());
    this.store.dispatch(getPayrollTaxSubmissionsAction());
    this.store.dispatch(getIncomeAndBenefitTypesSubmissionsAction());
    this.store.dispatch(getFilingdetailsSetupAction());
  }

  public onShowFilingSetupModal(): void {
    this.psfdd.showDialog = true;
  }
}