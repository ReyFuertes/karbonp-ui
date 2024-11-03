import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getCustomPaytypeSelector, getPayrollEmployeeSetupDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { getPayrollcalculationSelector, getPayrollPayPointSelector, getPhilippinesRegulatedSettingSelector, getSelectedPayrollInputSelector } from '../../store/payroll-input/payroll-input.selector';
import { InputType, NightDifferentialPaymentOption, PayrollIncomeType, SeveranceType, TimeOffSystemType } from '../../payroll.enum';
import { ICustomPaytype, IIncomeInput, IPayrollEmployeeSetupData, IPhilippinesRegulatedSetting } from '../../payroll.model';
import { ILeaveSetup } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { saveIncomeInputAction } from '../../store/payroll-input/payroll-input.action';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-income-dialog',
  templateUrl: './payroll-employee-setup-payroll-income-dialog.component.html',
  animations: [fadeInAnimation(300)]
})
export class PayrollEmployeeSetupPayrollIncomeDialogComponent extends GenericPage {
  public isEdit: boolean = false;
  public incomeModalTitle: string;
  public showIncomeModal: boolean = false;
  public incomeInputSetupForm: FormGroup;
  public customPaytype: ICustomPaytype;
  public inputType = InputType;
  public payrollIncomeType = PayrollIncomeType;
  public selectedPayrollInput: IIncomeInput;
  public employeeSetupData: IPayrollEmployeeSetupData;
  public christmasBonusDaysToUse: number;
  public defaultChristmasBonusDaysPaid: number;
  public leaveSetup: ILeaveSetup;
  public timeOffSystemType = TimeOffSystemType;
  public nightDifferentialPaymentOptions = GetTypes(NightDifferentialPaymentOption);
  public nightDifferentialPaymentOption = NightDifferentialPaymentOption;
  public philippinesRegulatedSetting: IPhilippinesRegulatedSetting;
  public severanceTypeOptions = GetTypes(SeveranceType);
  public severanceType = SeveranceType;
  public isAllowedOverrideCompensationTwentyDaysPerYear: boolean = false;
  public isAllowedOverrideSeveranceIndemnityNinetyDays: boolean = false;
  public isAllowedOverrideSeveranceSeniorityPremium: boolean = false;

  constructor(injector: Injector) {
    super(injector);
    this.incomeInputSetupForm = new FormGroup({
      id: new FormControl(0),
      incomeInputType: new FormControl(undefined),
      amount: new FormControl(undefined),
      nonTaxableAmount: new FormControl(undefined),
      directiveNumber: new FormControl(undefined),
      overrideCalculatedRate: new FormControl(undefined),
      leaveDaysPaidOut: new FormControl(undefined),
      customRate: new FormControl(0),
      isExtraOrdinaryIncome: new FormControl(0),
      severanceType: new FormControl(undefined),
      compensationTwentyDaysPerYear: new FormControl(0),
      severanceUsePartialYearsForServiceLength: new FormControl(0),
      indemnityNinetyDays: new FormControl(0),
      seniorityPremium: new FormControl(0),
      separationPay: new FormControl(0),
      payThirteenthMonthPay: new FormControl(0),
      settleLoanBalance: new FormControl(0),
      calculateTaxAndIncludeInRefund: new FormControl(0),
      recurringIncome: new FormControl(0),
      severanceLeaveDaysPaidOutOverride: new FormControl(undefined),
      severanceChristmasBonusOverride: new FormControl(undefined),
      severanceApplyVacationPremiumToFullLeaveAmount: new FormControl(0),
      nightDifferentialOption: new FormControl(undefined),
      maternityGrossPayOverride: new FormControl(undefined),
      overrideSeveranceCompensationTwentyDaysPerYear: new FormControl(undefined),
      overrideSeveranceIndemnityNinetyDays: new FormControl(undefined),
      overrideSeveranceSeniorityPremium: new FormControl(undefined)
    });
    combineLatest([
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getCustomPaytypeSelector)),
      this.store.pipe(select(getSelectedPayrollInputSelector)),
      this.store.pipe(select(getPhilippinesRegulatedSettingSelector)),
      this.store.pipe(select(getPayrollPayPointSelector)),
      this.store.pipe(select(getPayrollcalculationSelector)) //note: refactor, store reuse payrollcalculationservice
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employeeSetupData, customPaytype, selectedPayrollInput, philippinesRegulatedSetting, payrollPayPoint, payrollCalculation]) => {
        this.customPaytype = customPaytype;
        this.employeeSetupData = employeeSetupData;
        this.selectedPayrollInput = selectedPayrollInput as IIncomeInput;
        if (this.selectedPayrollInput?.severanceCompensationTwentyDaysPerYear)
          this.isAllowedOverrideCompensationTwentyDaysPerYear = true;
        if (this.selectedPayrollInput?.severanceIndemnityNinetyDays)
          this.isAllowedOverrideSeveranceIndemnityNinetyDays = true;
        if (this.selectedPayrollInput?.severanceSeniorityPremium)
          this.isAllowedOverrideSeveranceSeniorityPremium = true;
        if (this.selectedPayrollInput) {
          this.incomeInputSetupForm.patchValue({
            id: this.selectedPayrollInput?.id,
            incomeInputType: this.selectedPayrollInput?.payrollIncomeType,
            amount: this.selectedPayrollInput?.amount,
            nonTaxableAmount: this.selectedPayrollInput?.nonTaxableAmount,
            directiveNumber: this.selectedPayrollInput?.directiveNumber,
            overrideCalculatedRate: this.selectedPayrollInput?.amount !== null,
            leaveDaysPaidOut: this.selectedPayrollInput?.leaveDaysPaidOut,
            customRate: this.selectedPayrollInput?.customRate ?? 0,
            isExtraOrdinaryIncome: this.selectedPayrollInput?.isExtraOrdinaryIncome ?? 0,
            severanceType: this.selectedPayrollInput?.severanceType,
            compensationTwentyDaysPerYear: this.selectedPayrollInput?.severanceCompensationTwentyDaysPerYear,
            severanceUsePartialYearsForServiceLength: this.selectedPayrollInput?.severanceUsePartialYearsForServiceLength ?? 0,
            indemnityNinetyDays: this.selectedPayrollInput?.severanceIndemnityNinetyDays ?? 0,
            seniorityPremium: this.selectedPayrollInput?.severanceSeniorityPremium,
            separationPay: this.selectedPayrollInput?.separationPay ?? 0,
            payThirteenthMonthPay: this.selectedPayrollInput?.payThirteenthMonthPay,
            settleLoanBalance: this.selectedPayrollInput?.settleLoanBalance,
            calculateTaxAndIncludeInRefund: this.selectedPayrollInput?.calculateTaxAndIncludeInRefund,
            recurringIncome: this.selectedPayrollInput?.recurringIncome ?? 0,
            severanceLeaveDaysPaidOutOverride: this.selectedPayrollInput?.severanceLeaveDaysPaidOutOverride,
            severanceChristmasBonusOverride: this.selectedPayrollInput?.severanceChristmasBonusOverride,
            severanceApplyVacationPremiumToFullLeaveAmount: this.selectedPayrollInput?.severanceApplyVacationPremiumToFullLeaveAmount,
            nightDifferentialOption: this.selectedPayrollInput?.nightDifferentialOption,
            maternityGrossPayOverride: this.selectedPayrollInput?.maternityGrossPayOverride,
            overrideSeveranceCompensationTwentyDaysPerYear: this.selectedPayrollInput?.severanceCompensationTwentyDaysPerYearOverride,
            overrideSeveranceIndemnityNinetyDays: this.selectedPayrollInput?.severanceIndemnityNinetyDaysOverride,
            overrideSeveranceSeniorityPremium: this.selectedPayrollInput?.severanceSeniorityPremiumOverride
          });
        }
        this.philippinesRegulatedSetting = philippinesRegulatedSetting;
        if (payrollPayPoint?.additionalSettings !== null
          && payrollPayPoint?.additionalSettings?.christmasBonusDaysPaid !== null) {
          this.christmasBonusDaysToUse = payrollPayPoint?.additionalSettings?.christmasBonusDaysPaid;
        }
        else if (payrollCalculation?.additionalSettings?.christmasBonusDaysPaid !== null)
          this.christmasBonusDaysToUse = payrollCalculation.additionalSettings.christmasBonusDaysPaid;
        else {
          this.christmasBonusDaysToUse = this.defaultChristmasBonusDaysPaid;
        }
      })
  }

  public onSave(): void {
    if (this.incomeInputSetupForm.valid && this.employeeSetupData) {
      const payload = Object.assign({}, this.incomeInputSetupForm.value, {
        employeeId: this.employeeSetupData?.employee?.id,
        payRunId: this.employeeSetupData?.payRun?.id
      })
      this.store.dispatch(saveIncomeInputAction({
        payload: payload
      }));
      setTimeout(() => this.showIncomeModal = false, 300);
    }
    else
      alert('Not Implemented!');
  }

  public override onHide(): void {
    this.incomeInputSetupForm.reset();
  }

  public toggleCompensationTwentyDaysPerYear(): void {
    this.isAllowedOverrideCompensationTwentyDaysPerYear = !this.incomeInputSetupForm.get('compensationTwentyDaysPerYear').value;
  }

  public toggleSeveranceIndemnityNinetyDays(): void {
    this.isAllowedOverrideSeveranceIndemnityNinetyDays = !this.incomeInputSetupForm.get('indemnityNinetyDays').value;
  }

  public toggleSeniorityPremium(): void {
    this.isAllowedOverrideSeveranceSeniorityPremium = !this.incomeInputSetupForm.get('seniorityPremium').value;
  }

  public get showAmountFields(): boolean {
    const incomeInputType = this.incomeInputSetupForm.get('incomeInputType').value;
    return incomeInputType === PayrollIncomeType.Commission || incomeInputType === PayrollIncomeType.LossOfIncomePolicyPayout || incomeInputType === PayrollIncomeType.AnnualBonus ||
      incomeInputType === PayrollIncomeType.AnnualPayment || incomeInputType === PayrollIncomeType.ExtraPay || incomeInputType === PayrollIncomeType.RestraintOfTrade ||
      incomeInputType === PayrollIncomeType.RetroactiveSalary || incomeInputType === PayrollIncomeType.ProfitSharing || incomeInputType === PayrollIncomeType.ThirteenthMonthPay ||
      ((this.customPaytype?.inputType === InputType.AmountPerEmployee || this.customPaytype?.inputType === InputType.DifferentOnEveryPayslip ||
        this.customPaytype?.inputType === InputType.OnceOffForSpecifiedPayslips))
  }

  public get showQuantityFields(): boolean {
    return this.customPaytype?.inputType === InputType.HourlyRateFactorHours || this.customPaytype?.inputType === InputType.CustomRateQuantity;
  }

  public philippinesHourIncomeInputs = [
    PayrollIncomeType.NightDifferentialOvertime,
    PayrollIncomeType.Undertime,
    PayrollIncomeType.RestDay,
    PayrollIncomeType.RestDayOT,
    PayrollIncomeType.RestDayND,
    PayrollIncomeType.RestDayNDOT,
    PayrollIncomeType.SpecialHoliday,
    PayrollIncomeType.SpecialHolidayOT,
    PayrollIncomeType.SpecialHolidayND,
    PayrollIncomeType.SpecialHolidayNDOT,
    PayrollIncomeType.LegalHoliday,
    PayrollIncomeType.LegalHolidayOT,
    PayrollIncomeType.LegalHolidayND,
    PayrollIncomeType.LegalHolidayNDOT,
    PayrollIncomeType.SpecialHolidayRestDay,
    PayrollIncomeType.SpecialHolidayRestDayOT,
    PayrollIncomeType.SpecialHolidayRestDayND,
    PayrollIncomeType.SpecialHolidayRestDayNDOT,
    PayrollIncomeType.LegalHolidayRestDay,
    PayrollIncomeType.LegalHolidayRestDayOT,
    PayrollIncomeType.LegalHolidayRestDayND,
    PayrollIncomeType.LegalHolidayRestDayNDOT,
    PayrollIncomeType.DoubleHoliday,
    PayrollIncomeType.DoubleHolidayOT,
    PayrollIncomeType.DoubleHolidayND,
    PayrollIncomeType.DoubleHolidayNDOT,
    PayrollIncomeType.DoubleHolidayRestDay,
    PayrollIncomeType.DoubleHolidayRestDayOT,
    PayrollIncomeType.DoubleHolidayRestDayND,
    PayrollIncomeType.DoubleHolidayRestDayNDOT,
  ];
}
