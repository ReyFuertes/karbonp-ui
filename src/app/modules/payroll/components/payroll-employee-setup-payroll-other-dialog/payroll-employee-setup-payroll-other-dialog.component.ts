import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getCustomPaytypeSelector, getPayrollEmployeeSetupDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { ICustomPaytype, IOtherInput, IPayrollEmployeeSetupData } from '../../payroll.model';
import { PayFrequencyType } from 'src/app/models/generic.enum';
import { IOptionItem } from 'src/app/models/generic.model';
import { getSelectedPayrollInputSelector } from '../../store/payroll-input/payroll-input.selector';
import { saveOtherInputAction } from '../../store/payroll-input/payroll-input.action';
import { InputType, PayrollOtherType } from '../../payroll.enum';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-other-dialog',
  templateUrl: './payroll-employee-setup-payroll-other-dialog.component.html'
})
export class PayrollEmployeeSetupPayrollOtherDialogComponent extends GenericPage implements OnInit {
  public isEdit: boolean = false;
  public otherModalTitle: string;
  public showOtherModal: boolean = false;
  public otherInputSetupForm: FormGroup;
  public customPaytype: ICustomPaytype;
  public inputType = InputType;
  public payrollOtherType = PayrollOtherType;
  public outstandingEmployerLoanClosingBalance: number;
  public loanRepaymentDescription: string;
  public taxDirectiveTypeOptions: IOptionItem[] = [{
    label: this.translateService.instant('FixedAmountIRP3C'),
    value: 0
  }, {
    label: this.translateService.instant('FixedPercentageIRP3BPA'),
    value: 1
  }];
  public directiveIncomeSourceCodeOptions: IOptionItem[] = [{
    label: this.translateService.instant('3707ShareOptions'),
    value: 3707
  }, {
    label: this.translateService.instant('3908ExemptPolicyProceeds'),
    value: 3908
  }];
  public directiveIncomeSourceCodeLumpSumOptions: IOptionItem[] = [{
    label: this.translateService.instant('3901GratuitiesSeveranceBenefits'),
    value: 3901
  }, {
    label: this.translateService.instant('3907OtherLumpSum'),
    value: 3907
  }];
  public selectedPayrollInput: IOtherInput;
  public employeeSetupData: IPayrollEmployeeSetupData;

  constructor(injector: Injector) {
    super(injector);
    this.otherInputSetupForm = new FormGroup({
      otherInputType: new FormControl(undefined),
      amount: new FormControl(undefined),
      interestRate: new FormControl(undefined),
      calculateInterestBenefit: new FormControl(false),
      balanceIncrease: new FormControl(undefined),
      dontPayOutBalanceIncrease: new FormControl(false),
      balanceIncreaseAtBeginningOfPeriod: new FormControl(false),
      onceOffDeduction: new FormControl(undefined),
      cashEFTRepayment: new FormControl(false),
      foreignServiceTaxExemptionApplied: new FormControl(false),
      savingsPayOutOnCurrentPayslip: new FormControl(false),
      savingsPaidOutToThirdParty: new FormControl(false),
      savingsPayOutAmount: new FormControl(undefined),
      applyTaxDirective: new FormControl(false),
      taxDirectiveType: new FormControl(undefined),
      directiveNumber: new FormControl(undefined),
      customRate: new FormControl(undefined),
      payoutDate: new FormControl(undefined),
      directiveIncomeSourceCode: new FormControl(undefined),
      directiveIssueDate: new FormControl(undefined),
      directiveIncomeAmount: new FormControl(undefined)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getCustomPaytypeSelector)),
      this.store.pipe(select(getSelectedPayrollInputSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employeeSetupData, customPaytype, selectedPayrollInput]) => {
        this.outstandingEmployerLoanClosingBalance = employeeSetupData?.outstandingEmployerLoanClosingBalance;
        this.customPaytype = customPaytype;
        this.employeeSetupData = employeeSetupData;
        const payFrequencyType = employeeSetupData?.payPeriod?.payFrequencyType;
        if (payFrequencyType === PayFrequencyType.Monthly)
          this.loanRepaymentDescription = this.translateService.instant('Monthly') + ' ' + this.translateService.instant('RepaymentAmount');
        if (payFrequencyType === PayFrequencyType.Weekly)
          this.loanRepaymentDescription = this.translateService.instant('Weekly') + ' ' + this.translateService.instant('RepaymentAmount');
        if (payFrequencyType === PayFrequencyType.EveryTwoWeeks)
          this.loanRepaymentDescription = this.translateService.instant('EveryTwoWeeks') + ' ' + this.translateService.instant('RepaymentAmount');
        if (payFrequencyType === PayFrequencyType.TwiceMonthly)
          this.loanRepaymentDescription = this.translateService.instant('TwiceMonthly') + ' ' + this.translateService.instant('RepaymentAmount');
        if (payFrequencyType === PayFrequencyType.Daily)
          this.loanRepaymentDescription = this.translateService.instant('Daily') + ' ' + this.translateService.instant('RepaymentAmount');
        if (payFrequencyType === PayFrequencyType.TenDaily)
          this.loanRepaymentDescription = this.translateService.instant('TenDaily') + ' ' + this.translateService.instant('RepaymentAmount');
        this.selectedPayrollInput = selectedPayrollInput as IOtherInput;
        if (this.selectedPayrollInput) {
          this.otherInputSetupForm.patchValue({
            otherInputType: this.selectedPayrollInput?.payrollOtherType,
            amount: this.selectedPayrollInput?.amount, //note: nneed to check for custom rate
            interestRate: this.selectedPayrollInput?.interestRate,
            calculateInterestBenefit: this.selectedPayrollInput?.calculateInterestBenefit,
            balanceIncrease: this.selectedPayrollInput?.balanceIncrease,
            dontPayOutBalanceIncrease: this.selectedPayrollInput?.dontPayOutBalanceIncrease,
            balanceIncreaseAtBeginningOfPeriod: this.selectedPayrollInput?.balanceIncreaseAtBeginningOfPeriod,
            onceOffDeduction: this.selectedPayrollInput?.onceOffRepayment,
            cashEFTRepayment: this.selectedPayrollInput?.cashEFTRepayment,
            foreignServiceTaxExemptionApplied: this.selectedPayrollInput?.foreignServiceTaxExemptionApplied,
            savingsPayOutOnCurrentPayslip: this.selectedPayrollInput?.savingsPayOutOnCurrentPayslip,
            savingsPaidOutToThirdParty: this.selectedPayrollInput?.savingsPaidOutToThirdParty,
            savingsPayOutAmount: this.selectedPayrollInput?.savingsPayOutAmount,
            applyTaxDirective: this.selectedPayrollInput?.applyTaxDirective,
            taxDirectiveType: this.selectedPayrollInput?.taxDirectiveType,
            directiveNumber: this.selectedPayrollInput?.directiveNumber,
            customRate: this.selectedPayrollInput?.customRate ?? 0,
            payoutDate: this.selectedPayrollInput?.payoutDate !== undefined
              ? new Date(this.selectedPayrollInput?.payoutDate)
              : undefined,
            directiveIncomeSourceCode: this.selectedPayrollInput?.directiveIncomeSourceCode,
            directiveIssueDate: this.selectedPayrollInput?.directiveIssueDate !== undefined
              ? new Date(this.selectedPayrollInput?.directiveIssueDate)
              : undefined,
            directiveIncomeAmount: this.selectedPayrollInput?.directiveIncomeAmount
          });
        }
      })
  }

  public get showQuantityFields(): boolean {
    return this.customPaytype?.inputType === InputType.HourlyRateFactorHours
      || this.customPaytype?.inputType === InputType.CustomRateQuantity;
  }

  public get showAmountFields(): boolean {
    const otherInputType = this.otherInputSetupForm.get('otherInputType').value;
    const amountTypes = [0, 1, 2]; //note: whats this? -_-
    return (amountTypes.indexOf(otherInputType) >= 0
      || (this.customPaytype?.inputType === InputType.AmountPerEmployee
        || this.customPaytype?.inputType === InputType.DifferentOnEveryPayslip
        || this.customPaytype?.inputType === InputType.OnceOffForSpecifiedPayslips));
  }

  public onSave(): void {
    if (this.otherInputSetupForm.valid && this.employeeSetupData) {
      this.store.dispatch(saveOtherInputAction({
        payload: Object.assign({}, this.otherInputSetupForm.value, {
          id: this.selectedPayrollInput?.id ?? 0,
          employeeId: this.employeeSetupData?.employee?.id,
          payRunId: this.employeeSetupData?.payRun?.id
        })
      }));
      setTimeout(() => this.showOtherModal = false, 300);
    }
    else
      alert('Not Implemented!');
  }
}
