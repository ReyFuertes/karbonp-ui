import { Component, Injector, Input, OnChanges, SimpleChanges } from '@angular/core';

import { IDeduction, IIncome, IPayrollEmployeeSetupData, IPayslipPreview } from '../../payroll.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { GetTypes } from 'src/app/shared/util/types.util';
import { IncomeType, PhilippinesOvertimeTypes } from 'src/app/models/generic.enum';
import { IOptionItem, PaymentType } from 'src/app/models/generic.model';
import { PayrollDeductionType } from '../../payroll.enum';

@Component({
  selector: 'kp-payroll-employee-setup-preview-payslip',
  templateUrl: './payroll-employee-setup-preview-payslip.component.html',
  styleUrls: ['./payroll-employee-setup-preview-payslip.component.scss']
})
export class PayrollEmployeeSetupPreviewPayslipComponent extends GenericPage implements OnChanges {
  @Input() public payslipPreview: IPayslipPreview;
  @Input() public employeeSetupData: IPayrollEmployeeSetupData;
  @Input() public closingBalance: number;
  @Input() public outstandingEmployerLoanClosingBalance: number;
  @Input() public showOutstandingEmployerLoanClosingBalance: boolean;

  public incomes: IIncome[] = [];
  public deductions: IDeduction[] = [];
  public deductionType = PayrollDeductionType;
  public paymentType = PaymentType;
  public incomeType = IncomeType;
  public incomeTypes = GetTypes(IncomeType);
  public deductionTypes = GetTypes(PayrollDeductionType);
  public incomeTypesDictionary = new Map<number, IOptionItem>();
  public deductionTypesDictionary = new Map<number, IOptionItem>();
  public showBreakDownModal: boolean = false;

  constructor(injector: Injector) {
    super(injector)
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges;
    if (changes['payslipPreview']?.currentValue) {
      this.payslipPreview = changes['payslipPreview']?.currentValue;
      this.incomes = this.payslipPreview?.payslip?.incomes;
      this.incomeTypesDictionary.clear();
      this.incomeTypes?.forEach(income => {
        const incomeType = income?.value;
        const amount = this.incomes?.find(income => income?.incomeType === incomeType)?.amount;
        income = Object.assign({}, income, { id: incomeType, value: amount });
        this.incomeTypesDictionary.set(Number(income?.id), income);
      });
      this.deductions = this.payslipPreview?.payslip?.deductions;
      this.deductionTypes?.forEach(deduction => {
        const deductionType = deduction?.value;
        const amount = this.deductions?.find(deduction => deduction?.deductionType === deductionType)?.amount;
        deduction = Object.assign({}, deduction, { id: deductionType, value: amount });
        this.deductionTypesDictionary.set(Number(deduction?.id), deduction);
      });
    }
  }

  public goToPausedLoans(): void {
    alert('Not implemented');
    // this.router.navigateByUrl('/loan-listing');
    // let baseUrl = window.location.href.replace(this.router.url, '');
    // window.open(baseUrl + newRelativeUrl, '_blank');
  }

  public isOvertimeIncomeType(income: IIncome): boolean {
    return income?.incomeType in PhilippinesOvertimeTypes;
  }

  public get getBasicSalaryPaymentType(): number {
    return this.payslipPreview?.payslip?.payrollInputs.find(i => i.payrollInputType === PaymentType.Fixed)?.paymentType;
  }
}
