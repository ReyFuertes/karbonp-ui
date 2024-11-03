import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayrollSettingsPayslipsAction, savePayrollSettingsPayslipsAction } from '../../store/payroll-settings-payslip/payroll-settings-payslip.action';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import { getSettingsPayslipSetupSelector } from '../../store/payroll-settings-payslip/payroll-settings-payslip.selector';
import { IPayslipDisplaySetupItem } from '../../payroll.model';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-settings-payslips',
  templateUrl: './payroll-settings-payslips.component.html',
  styleUrls: ['./payroll-settings-payslips.component.scss']
})
export class PayrollSettingsPayslipsComponent extends GenericPage implements OnInit {
  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(getPayrollSettingsPayslipsAction());
    this.form = new FormGroup({
      id: new FormControl(0),
      formatForSelfSealingConfidentiaStationery: new FormControl(false),
      showHoursAndRate: new FormControl(false),
      showPayTypeHoursAndRates: new FormControl(false),
      showYTDTotals: new FormControl(false),
      showYTDbalancesEvenWhenCurrentValueIs0: new FormControl(false),
      showCumulativeYTDTotals: new FormControl(false),
      doNotShowLeave: new FormControl(false),
      doNotShowLeaveAdjustments: new FormControl(false),
      showEmployeeNumber: new FormControl(false),
      showAdditionalNumber: new FormControl(false),
      showIncomeTaxNumber: new FormControl(false),
      showTaxCodes: new FormControl(false),
      nameOfAdditionalNumber: new FormControl(''),
      showEmployeeBankingDetails: new FormControl(false),
      showEmployeeAddress: new FormControl(false),
      doNotShowEmployerContributions: new FormControl(false),
      doNotShowTaxableIncomeDeductions: new FormControl(false),
      doNotShowBenefits: new FormControl(false),
      showLeaveDaysToExpire: new FormControl(false),
      payslipNotes: new FormControl(''),
      showSeveranceBreakdown: new FormControl(false),
      showHourlyBreakdown: new FormControl(false),
      showHourlyRate: new FormControl(false),
      groupShiftsUnderBaseEarnings: new FormControl(true),
      payslipDisplaySetupItems: new FormArray([])
    })
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSettingsPayslipSetupSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([settingsPayslipSetup]) => {
        if (settingsPayslipSetup)
          this.form.patchValue(settingsPayslipSetup);
      });
  }

  public onSave(): void {
    this.store.dispatch(savePayrollSettingsPayslipsAction({ payload: this.form.value }));
  }

  public get getPayslipDisplaySetupItems(): FormArray {
    return this.form.get("payslipDisplaySetupItems") as FormArray;
  }

  public get showLeaveTypeToggle(): boolean {
    return this.getPayslipDisplaySetupItems?.value?.filter((item: IPayslipDisplaySetupItem) => item?.showItemOnPayslip).length > 0;
  }

  public onCancel(): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, '/payroll/overview')
    localStorage.removeItem('payrollSettingsSelectedTab');
  }
}
