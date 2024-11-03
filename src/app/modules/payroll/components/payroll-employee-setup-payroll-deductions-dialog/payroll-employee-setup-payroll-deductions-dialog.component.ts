import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { IBeneficiary, ICustomPaytype, IPayrollAllowanceInput, IPayrollEmployeeSetupData, IPayrollInput, IPayslipPreview } from '../../payroll.model';
import { IOptionItem } from 'src/app/models/generic.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getBeneficiariesSelector, getCustomPaytypeSelector, getPayrollEmployeeSetupDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { InputType, PayrollDeductionType } from '../../payroll.enum';
import { getSelectedDeductionPayrollInputSelector } from '../../store/payroll-input/payroll-input.selector';
import { saveDeductionInputAction } from '../../store/payroll-input/payroll-input.action';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-deductions-dialog',
  templateUrl: './payroll-employee-setup-payroll-deductions-dialog.component.html'
})
export class PayrollEmployeeSetupPayrollDeductionsDialogComponent extends GenericPage implements OnInit {
  public deductionInputSetupForm: FormGroup;
  public deductionsModalTitle: string;
  public showDeductionsModal: boolean;
  public deductionType = PayrollDeductionType;
  public loanCalculationOptions: IOptionItem[];
  public contributionTypeOptions: IOptionItem[];
  public customPaytype: ICustomPaytype;
  public inputType = InputType;
  public payslipPreview: IPayslipPreview;
  public InputAllowanceBenefitTypes: IPayrollAllowanceInput[] = [];
  public beneficiaries: IBeneficiary[];
  public selectedPayrollInput: IPayrollInput;
  public employeeSetupData: IPayrollEmployeeSetupData;

  constructor(injector: Injector) {
    super(injector);
    this.deductionInputSetupForm = new FormGroup({
      deductionInputType: new FormControl(undefined),
      amount: new FormControl(0),
      balance: new FormControl(0),
      beneficiaryId: new FormControl(undefined),
      employerAmount: new FormControl(undefined),
      employeeAmountNotDeducted: new FormControl(undefined),
      employerOwnsPolicy: new FormControl(false),
      contributionType: new FormControl(undefined),
      categoryFactor: new FormControl(undefined),
      employeeHandlesPayment: new FormControl(false),
      members: new FormControl(0),
      customRate: new FormControl(undefined),
      loanCalculationOption: new FormControl(undefined),
      quantity: new FormControl(undefined),
      loanId: new FormControl(undefined),
      loanAmount: new FormControl(undefined),
      loanBalanceAmount: new FormControl(undefined),
      loanRepaymentAmount: new FormControl(undefined),
      loanTerm: new FormControl(undefined),
      loanType: new FormControl(undefined),
      amountOverride: new FormControl(0),
      loanReferenceNumber: new FormControl(undefined),
      recurringDeduction: new FormControl(false),
    });
    this.loanCalculationOptions = [{
      label: this.translateService.instant('FixedAmount'),
      value: 0
    }, {
      label: this.translateService.instant('PercentageOfSalary'),
      value: 1
    }, {
      label: this.translateService.instant('TimesUMAAmount'),
      value: 2
    }]
    this.contributionTypeOptions = [{
      label: this.translateService.instant('FixedAmount'),
      value: 0
    }, {
      label: this.translateService.instant('PercentageOfRetirementFundIncome'),
      value: 1
    }];
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getBeneficiariesSelector)),
      this.store.pipe(select(getSelectedDeductionPayrollInputSelector)),
      this.store.pipe(select(getCustomPaytypeSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employeeSetupData, beneficiaries, selectedPayrollInput, customPaytype]) => {
        this.employeeSetupData = employeeSetupData;
        this.customPaytype = customPaytype;
        this.beneficiaries = beneficiaries;
        this.selectedPayrollInput = selectedPayrollInput;
        if (selectedPayrollInput) {
          this.deductionInputSetupForm.patchValue({
            deductionInputType: selectedPayrollInput?.payrollDeductionType,
            amount: selectedPayrollInput.amount ?? 0,
            balance: selectedPayrollInput?.balanceIncrease,
            beneficiaryId: selectedPayrollInput?.beneficiary?.id,
            employerAmount: selectedPayrollInput?.employerAmount,
            employeeAmountNotDeducted: selectedPayrollInput?.nonDeductedAmount,
            employerOwnsPolicy: selectedPayrollInput?.employerOwnsPolicy,
            contributionType: selectedPayrollInput?.contributionCalculationType,
            categoryFactor: selectedPayrollInput?.categoryFactor,
            employeeHandlesPayment: selectedPayrollInput?.employeeHandlesPayment,
            members: selectedPayrollInput?.members,
            customRate: selectedPayrollInput?.customRate ?? 0,
            loanCalculationOption: selectedPayrollInput?.loanCalculationOption,
            quantity: selectedPayrollInput?.quantity,
            loanId: undefined,
            loanAmount: undefined,
            loanBalanceAmount: undefined,
            loanRepaymentAmount: undefined,
            loanTerm: undefined,
            loanType: undefined,
            amountOverride: selectedPayrollInput?.amountOverride,
            loanReferenceNumber: undefined,
            recurringDeduction: selectedPayrollInput?.recurringDeduction
          });
        }
      })
  }

  public override onHide(): void {
    this.deductionInputSetupForm.reset();
  }

  public get getBenefitTypes(): IPayrollInput[] {
    return this.employeeSetupData?.payrollBenefitInputs
  }

  public onSave(): void {
    if (this.deductionInputSetupForm.valid && this.employeeSetupData) {
      this.store.dispatch(saveDeductionInputAction({
        payload: Object.assign({}, this.deductionInputSetupForm.value, {
          id: this.selectedPayrollInput?.id ?? 0,
          employeeId: this.employeeSetupData?.employee?.id,
          payRunId: this.employeeSetupData?.payRun?.id
        })
      }));
      setTimeout(() => this.showDeductionsModal = false, 300);
    }
    else
      alert('Not Implemented!');
  }

  public get showAmountFields(): boolean {
    const deductionInputType = this.deductionInputSetupForm.get('deductionInputType').value;
    const amountTypes = [0, 2, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 17, 20, 25]; //note: what is this??
    return amountTypes.indexOf(deductionInputType) >= 0
      || ((this.customPaytype?.inputType === InputType.AmountPerEmployee
        || this.customPaytype?.inputType === InputType.DifferentOnEveryPayslip
        || this.customPaytype?.inputType === InputType.OnceOffForSpecifiedPayslips));
  }

  public get showQuantityFields(): boolean {
    return this.customPaytype?.inputType === PayrollDeductionType.RetirementAnnuityFund
      || this.customPaytype?.inputType === PayrollDeductionType.UnionMembershipFee;
  }
}
