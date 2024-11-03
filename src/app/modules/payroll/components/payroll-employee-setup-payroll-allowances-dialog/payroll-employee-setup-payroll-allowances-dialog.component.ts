import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { InputType, PayrollAllowanceType, SubsistenceReimbursementCostType } from '../../payroll.enum';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getCustomPaytypeSelector, getPayrollEmployeeSetupDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { IAllowanceInput, ICustomPaytype, IPayrollEmployeeSetupData } from '../../payroll.model';
import { getSelectedPayrollInputSelector } from '../../store/payroll-input/payroll-input.selector';
import { saveRecurringInputAllowanceAction } from '../../store/payroll-input/payroll-input.action';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-allowances-dialog',
  templateUrl: './payroll-employee-setup-payroll-allowances-dialog.component.html',
  animations: [fadeInAnimation(300)]
})
export class PayrollEmployeeSetupPayrollAllowancesDialogComponent extends GenericPage implements OnInit {
  public allowancesModalTitle: string;
  public showAllowancesModal: boolean = false;
  public isEdit: boolean = false;
  public allowanceInputSetupForm: FormGroup;
  public showValidation: boolean = false;
  public payrollAllowanceType = PayrollAllowanceType;
  public subsistenceReimbursementCostTypeOptions = GetTypes(SubsistenceReimbursementCostType);
  public customPaytype: ICustomPaytype;
  public inputType = InputType;
  public employeesWithInputType: any[]; //note" not sure whats this for -_-
  public selectedPayrollInput: IAllowanceInput;
  public employeeSetupData: IPayrollEmployeeSetupData;

  constructor(injector: Injector) {
    super(injector)
    this.allowanceInputSetupForm = new FormGroup({
      allowanceInputType: new FormControl(undefined),
      amount: new FormControl(null),
      employerAmount: new FormControl(null),
      fixedAmountPaidRegularly: new FormControl(false),
      reimbursedForExpenses: new FormControl(false),
      expenses: new FormControl(null),
      companyFuelCard: new FormControl(false),
      fuelCardAmount: new FormControl(null),
      reimbursedPerDistanceTravelled: new FormControl(false),
      ratePerKM: new FormControl(null),
      kmsTravelled: new FormControl(null),
      only20PercentSubjectToTax: new FormControl(false),
      nonTaxableAmount: new FormControl(null),
      taxableItemsPaidbyEmployer: new FormControl(null),
      subsistenceReimbursementCostType: new FormControl(null),
      maximumDailySubsistenceAmount: new FormControl(null),
      numberOfDays: new FormControl(null),
      taxDeduction: new FormControl(null),
      directiveNumber: new FormControl(null),
      customRate: new FormControl(null),
      addAccompanyingDeduction: new FormControl(false),
      percentageOfBaseEarnings: new FormControl(false),
      adjustmentAmount: new FormControl(null),
      recurringAllowance: new FormControl(false),
    });
    this.translateOptionLabels(this.subsistenceReimbursementCostTypeOptions);
  }
  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getCustomPaytypeSelector)),
      this.store.pipe(select(getSelectedPayrollInputSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employeeSetupData, customPaytype, selectedPayrollInput]) => {
        this.customPaytype = customPaytype;
        this.employeeSetupData = employeeSetupData;
        this.selectedPayrollInput = selectedPayrollInput as IAllowanceInput;
        if (this.selectedPayrollInput) {
          this.allowanceInputSetupForm.patchValue({
            id: this.selectedPayrollInput?.id,
            allowanceInputType: this.selectedPayrollInput?.payrollAllowanceType,
            amount: this.selectedPayrollInput?.amount,
            employerAmount: this.selectedPayrollInput?.employerAmount,
            fixedAmountPaidRegularly: this.selectedPayrollInput?.travelAllowanceFixedAmount,
            reimbursedForExpenses: this.selectedPayrollInput?.travelAllowanceReimbursedForExpenses,
            expenses: this.selectedPayrollInput?.travelAllowanceExpenses,
            companyFuelCard: this.selectedPayrollInput?.travelAllowanceHasCompanyFuelCard,
            fuelCardAmount: this.selectedPayrollInput?.travelAllowanceFuelCardSpend,
            reimbursedPerDistanceTravelled: this.selectedPayrollInput?.travelAllowanceReimbursedForDistanceTravelled,
            ratePerKM: this.selectedPayrollInput?.travelAllowanceRatePerDistanceUnit,
            kmsTravelled: this.selectedPayrollInput?.travelAllowanceDistanceTravelled,
            only20PercentSubjectToTax: this.selectedPayrollInput?.travelAllowanceOnly20PercentTaxable,
            nonTaxableAmount: this.selectedPayrollInput?.nonTaxableAmount,
            subsistenceReimbursementCostType: this.selectedPayrollInput?.subsistenceReimbursementCostType,
            maximumDailySubsistenceAmount: this.selectedPayrollInput?.maximumDailySubsistenceAmount,
            numberOfDays: this.selectedPayrollInput?.numberOfDays ?? 0,
            taxDeduction: this.selectedPayrollInput?.taxDeduction,
            directiveNumber: this.selectedPayrollInput?.directiveNumber,
            customRate: this.selectedPayrollInput?.customRate ?? 0,
            addAccompanyingDeduction: this.selectedPayrollInput?.addAccompanyingDeduction,
            percentageOfBaseEarnings: this.selectedPayrollInput?.isPercentageValue,
            adjustmentAmount: this.selectedPayrollInput?.adjustmentAmount,
            recurringAllowance: this.selectedPayrollInput?.recurringAllowance
          });
        }
      })
  }

  public onSave(): void {
    if (this.allowanceInputSetupForm.valid && this.employeeSetupData) {
      this.store.dispatch(saveRecurringInputAllowanceAction({
        payload: Object.assign({}, this.allowanceInputSetupForm.value, {
          id: this.selectedPayrollInput?.id ?? 0,
          numberOfDays: this.selectedPayrollInput?.numberOfDays ?? 0,
          employeeId: this.employeeSetupData?.employee?.id,
          payRunId: this.employeeSetupData?.payRun?.id
        })
      }));
      setTimeout(() => this.showAllowancesModal = false, 300);
    }
    else
      alert('Not Implemented!');
  }

  public get showQuantityFields(): boolean {
    return this.customPaytype?.inputType === InputType.HourlyRateFactorHours
      || this.customPaytype?.inputType === InputType.CustomRateQuantity;
  }

  public get getshowQuantityFields(): boolean {
    return this.customPaytype?.inputType === InputType.HourlyRateFactorHours
      || this.customPaytype?.inputType === InputType.CustomRateQuantity;
  }

  public get showAmountFields(): boolean {
    const allowanceInputType = this.allowanceInputSetupForm.get('allowanceInputType').value;
    const amountTypes = [
      PayrollAllowanceType.ComputerAllowance,
      PayrollAllowanceType.PhoneAllowance,
      PayrollAllowanceType.ExpenseClaim,
      PayrollAllowanceType.ToolAllowance,
      PayrollAllowanceType.UniformAllowance,
      PayrollAllowanceType.BroadBasedEmployeeSharePlan,
      PayrollAllowanceType.GainOnVestingOfEquityInstruments,
      PayrollAllowanceType.Attendance,
      PayrollAllowanceType.Gym,
      PayrollAllowanceType.PantryVouchers,
      PayrollAllowanceType.GasolineVouchers,
      PayrollAllowanceType.TransportSubsidy,
      PayrollAllowanceType.EducationalScholarships,
      PayrollAllowanceType.DiningSubsidy,
    ];
    return amountTypes.indexOf(allowanceInputType) >= 0
      || (this.customPaytype?.inputType === InputType.AmountPerEmployee
        || this.customPaytype?.inputType === InputType.DifferentOnEveryPayslip
        || this.customPaytype?.inputType === InputType.OnceOffForSpecifiedPayslips);
  }

  public get showPercentageToggle(): boolean {
    const allowanceInputType = this.allowanceInputSetupForm.get('allowanceInputType').value;
    const amountTypes = [
      PayrollAllowanceType.Attendance,
      PayrollAllowanceType.Gym,
      PayrollAllowanceType.PantryVouchers,
      PayrollAllowanceType.GasolineVouchers,
      PayrollAllowanceType.TransportSubsidy,
      PayrollAllowanceType.EducationalScholarships,
      PayrollAllowanceType.DiningSubsidy
    ];
    return amountTypes.indexOf(allowanceInputType) >= 0 && this.currentCountryISOCode == this.countryISOCodeType.MEX;
  }

  public get showAdjustmentAmountFields(): boolean {
    const allowanceInputType = this.allowanceInputSetupForm.get('allowanceInputType').value;
    const amountTypes = [
      PayrollAllowanceType.MealAllowance,
      PayrollAllowanceType.ServiceIncentiveLeavePaidOut,
      PayrollAllowanceType.RiceSubsidy,
      PayrollAllowanceType.MedicalCashAllowance,
      PayrollAllowanceType.UniformAndClothingAllowance,
      PayrollAllowanceType.LaundryAllowance,
      PayrollAllowanceType.MedicalBenefit,
      PayrollAllowanceType.Gifts,
      PayrollAllowanceType.AchievementAward,
      PayrollAllowanceType.CBABenefit,
      PayrollAllowanceType.TravelAllowance
    ];
    return amountTypes.indexOf(allowanceInputType) >= 0 && this.currentCountryISOCode === this.countryISOCodeType.PHL;
  }
}
