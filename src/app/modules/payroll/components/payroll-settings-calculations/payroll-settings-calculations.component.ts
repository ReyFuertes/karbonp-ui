import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { savePayrollSettingsCalculationsAction } from '../../store/payroll-settings-calculations/payroll-settings-calculations.action';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import { getPayrollSettingsCalculationsSelector } from '../../store/payroll-settings-calculations/payroll-settings-calculations.selector';
import { IPayrollCalculation } from '../../payroll.model';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-settings-calculations',
  templateUrl: './payroll-settings-calculations.component.html',
  styleUrls: ['./payroll-settings-calculations.component.scss']
})
export class PayrollSettingsCalculationComponent extends GenericPage implements OnInit {
  public proRataMethodOptions: IOptionItem[];
  public payrollCalculations: IPayrollCalculation;

  constructor(injector: Injector) {
    super(injector);
    this.form = new FormGroup({
      id: new FormControl(0),
      hourlyRate: new FormControl(undefined),
      dontAutoPayPublicHolidays: new FormControl(false),
      allowInputOfShiftsWorked: new FormControl(false),
      normallyWorksMinimumPay: new FormControl(0),
      normallyWorksFixedComponent: new FormControl(0),
      normallyOffMinimumPay: new FormControl(0),
      normallyOffFixedComponent: new FormControl(0),
      overrideHolidayPayRates: new FormControl(false),
      holidayNormalMultiplier: new FormControl(undefined),
      holidayOvertimeMultiplier: new FormControl(undefined),
      sundayPayMinimumPay: new FormControl(0),
      overrideSundayPayRates: new FormControl(false),
      sundayPayNormallyWorksMultiplier: new FormControl(undefined),
      sundayPayNormallyOffMultiplier: new FormControl(undefined),
      sundayPaySeparateInputForOvertimeHoursPaid2X: new FormControl(true),
      bceaLeavePayEnableFluctuatingRate: new FormControl(false),
      bceaLeavePayEffectiveFromDate: new FormControl(undefined),
      etiMinimumWageMonthly: new FormControl(undefined),
      etiMinimumWageNormalRate: new FormControl(undefined),
      etiHasSpecialEconomicZone: new FormControl(false),
      etiSpecialEconomicZone: new FormControl(undefined),
      etiEffectiveFromDate: new FormControl(undefined),
      etiCompliant: new FormControl(false),
      garnisheeDoNotDeductCommission: new FormControl(false),
      sdlEffectiveFromDate: new FormControl(undefined),
      proRataMethod: new FormControl(undefined),
      proRataMethodEffectiveFromDate: new FormControl(undefined),
      enableGoalGetter: new FormControl(true),
      limitType: new FormControl(0),
      dailyLimit: new FormControl(undefined),
      consecutiveDailyLimit: new FormControl(undefined),
      weeklyLimit: new FormControl(undefined),
      normalOvertimeRate: new FormControl(undefined),
      limitExceededOvertimeRate: new FormControl(undefined),
      publicHolidayOvertimeRate: new FormControl(undefined),
      sundayOvertimeRate: new FormControl(undefined),
      christmasBonusDaysPaid: new FormControl(undefined),
      maximumSavingsFundRate: new FormControl(undefined),
      normallyWorksOnSpecialHolidayMinimumPay: new FormControl(0),
      normallyWorksOnSpecialHolidayFixedComponent: new FormControl(0),
      normallyOffOnSpecialHolidayMinimumPay: new FormControl(0),
      normallyOffOnSpecialHolidayFixedComponent: new FormControl(0),
      overrideSpecialHolidayPayRates: new FormControl(false),
      specialholidayNormalMultiplier: new FormControl(undefined),
      specialholidayOvertimeMultiplier: new FormControl(undefined),
      sundayOvertimeHoursLimit: new FormControl(8),
      sundayOvertimeLimitExceededRate: new FormControl(undefined),
      holidayOvertimeHoursLimit: new FormControl(undefined),
      holidayOvertimeLimitExceededRate: new FormControl(undefined),
      holidaySundayNormalRate: new FormControl(undefined),
      holidaySundayOvertimeRate: new FormControl(undefined),
      holidaySundayOvertimeHoursLimit: new FormControl(8),
      holidaySundayLimitExceededOvertimeRate: new FormControl(undefined),
      specialHolidayOvertimeHoursLimit: new FormControl(undefined),
      specialHolidayOvertimeLimitExceededRate: new FormControl(undefined),
      specialHolidaySundayNormalRate: new FormControl(undefined),
      specialHolidaySundayOvertimeRate: new FormControl(undefined),
      specialHolidaySundayOvertimeHoursLimit: new FormControl(8),
      specialHolidaySundayLimitExceededOvertimeRate: new FormControl(undefined),
      sbcCalculationType: new FormControl(0),
      sbcPantryVoucherCalculationType: new FormControl(0),
      dailyUMAValueOverride: new FormControl(undefined),
      minimumNightDifferentialContributionPercentage: new FormControl(undefined),
      doubleHolidayPayNormalMultiplier: new FormControl(undefined),
      doubleHolidayPayOvertimeMultiplier: new FormControl(undefined),
      doubleHolidayPayRestDayNormalMultiplier: new FormControl(undefined),
      doubleHolidayPayRestDayOvertimeMultiplier: new FormControl(undefined),
      taxMethod: new FormControl(0),
    });
    this.proRataMethodOptions = [{
      label: this.translateService.instant('CalendarDays'),
      value: 0
    }, {
      label: this.translateService.instant('WorkingDays'),
      value: 1
    }]
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollSettingsCalculationsSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([payrollCalculations]) => {
        this.payrollCalculations = payrollCalculations;
        if (payrollCalculations)
          this.form.patchValue(payrollCalculations);
      })
  }

  public onSaveCalculations(): void {
    this.store.dispatch(savePayrollSettingsCalculationsAction({ payload: this.form.value }));
  }

  public onCancel(): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, '/payroll/overview')
    localStorage.removeItem('payrollSettingsSelectedTab');
  }
}
