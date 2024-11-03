import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { IAvailableExchangeRate, IExchangeItem, ILeaveSetup, IOptionItem, IPaymentMethod, IPayPeriod } from 'src/app/models/generic.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getDownloadedPayslipSelector, getPayrollEmployeeSetupDataSelector, getPayrollPayrunEmployeesSelector, getPayrollPayslipPreviewDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { ICustomPaytype, IDeduction, IEmployeerContribution, ILoan, IPayrollAllowanceInput, IPayrollCalculation, IPayrollEmployeeSetupData, IPayrollInput, IPayrun, IPayrunEmployee, IPayslip, IPayslipPreview } from '../../payroll.model';
import { approveRevertPayslipAction, generatePDFPaySlipAction, getEmployeeActivityLoggingAction, getPayrollEmployeeSetupDataAction } from '../../store/payrun-in-progress/payroll-payrun-in-progress.action';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';
import { RunPayslipStatusType } from 'src/app/models/generic.enum';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { PayrollInputType } from '../../payroll.enum';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-employee-setup',
  templateUrl: './payroll-employee-setup.component.html',
  styleUrls: ['./payroll-employee-setup.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class PayrollEmployeeSetupComponent extends GenericPage implements OnInit {
  @ViewChild('cdDynamic', { static: false }) public cdDynamic: ConfirmDialog | undefined;

  public payRunId: number;
  public employeeId: number;
  public employeeOptions: IOptionItem[];
  public allEmployees: IOptionItem[];
  public selectedTabIndex: number = 0;
  public payrollEmployeeSetupData: IPayrollEmployeeSetupData;
  public payslipPreview: IPayslipPreview;
  public payrollInputIncomeTypes: IPayrollAllowanceInput[];
  public payrollInputOtherTypes: IPayrollAllowanceInput[];
  public payrollInputAllowanceTypes: IPayrollAllowanceInput[];
  public payrollInputBenefitTypes: IPayrollAllowanceInput[];
  public timeOffSettings: ILeaveSetup[];
  public hasLastDayOfService: boolean;
  public exchangeRates: IAvailableExchangeRate[];
  public outstandingEmployerLoanClosingBalance: number;
  public payslipLoans: ILoan[];
  public hasPausedLoans: boolean;
  public employeeExcludedFromTax: boolean;
  public employeeExcludedFromGovernmentContributions: boolean;
  public relevantExchangeRate: IAvailableExchangeRate;
  public payTypes: ICustomPaytype[];
  public payRuns: IPayrun[];
  public payRollCalculationSetup: IPayrollCalculation;
  public employeePaymentMethod: IPaymentMethod;
  public payPeriod: IPayPeriod;
  public payFrequencyType: number;
  public closingBalance: number;
  public showOutstandingEmployerLoanClosingBalance: boolean;
  public payslip: IPayslip;
  public hasPastDraftPayslip: boolean;
  public socialSecurityEmployee: IDeduction[];
  public socialSecurityEmployer: IEmployeerContribution[];
  public lockPayslipCurrency: number;
  public customExchangeRateOverride: any; //note: no proper model
  public basicSalaryInput: IPayrollInput;
  public latestExchangeRateItem: IExchangeItem;
  public hasSeveranceIncomes: boolean;
  public payrollInputIncomes: IPayrollInput[];
  public payrollInputs: IPayrollInput[];
  public payrollInputDeductions: IPayrollInput[];
  public payrollInputAllowances: IPayrollInput[];
  public payrollInputOthers: IPayrollInput[];
  public payrollInputBenefits: IPayrollInput[];
  public incomeInputTypes: IPayrollInput[];
  public selectedPayrollInputType: IPayrollInput[];
  public deductionInputTypes: IPayrollInput[];
  public allowanceInputTypes: IPayrollInput[];
  public benefitInputTypes: IPayrollInput[];
  public otherInputTypes: IPayrollInput[];
  public payrollInputId: number;
  public downloadedPayslipData = new Map<number, any>();
  public payslipStatusType = RunPayslipStatusType;
  public btnDialogClassClr: string = '';

  constructor(
    injector: Injector,
    private route: ActivatedRoute
  ) {
    super(injector);
    this.currentPageKey = CURRENT_PAYRUN_PAGE_KEY;
    this.form = this.fb.group({
      employees: new FormControl(undefined), //note: employees not matching the grid
    });
    this.route.paramMap
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(params => {
        this.payRunId = Number(params.get('payRunId'));
        this.employeeId = Number(params.get('employeeId'));
        const payload = { employeeId: this.employeeId, payRunId: this.payRunId };
        this.store.dispatch(getPayrollEmployeeSetupDataAction(payload));
        this.loadActivityLog(this.payRunId);
      })
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollPayrunEmployeesSelector)),
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getPayrollPayslipPreviewDataSelector)),
      this.store.pipe(select(getDownloadedPayslipSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([payrunEmployees, payrollEmployeeSetupData, payslipPreview, downloadedPayslip]) => {
        this.employeeOptions = payrunEmployees?.map((payrunEmployee: IPayrunEmployee) => ({
          label: `${payrunEmployee?.firstName} ${payrunEmployee?.lastName}`,
          value: payrunEmployee?.employeeId?.toString()
        }));
        this.payrollEmployeeSetupData = payrollEmployeeSetupData;
        this.payslipPreview = payslipPreview;
        //note: refactor not to use over declared variables -_-
        this.payTypes = payrollEmployeeSetupData?.customPayTypes;
        this.timeOffSettings = payrollEmployeeSetupData?.timeOffSetups;
        this.payRuns = payrollEmployeeSetupData?.allEmployeePayRuns;
        this.payRollCalculationSetup = payrollEmployeeSetupData?.payrollCalculation;
        this.employeePaymentMethod = payrollEmployeeSetupData?.paymentMethod;
        this.payPeriod = payrollEmployeeSetupData?.payPeriod;
        this.payFrequencyType = this.payPeriod?.payFrequencyType;
        this.payrollInputIncomeTypes = payrollEmployeeSetupData?.payrollIncomeInputs;
        this.payrollInputAllowanceTypes = payrollEmployeeSetupData?.payrollAllowanceInputs;
        this.payrollInputBenefitTypes = payrollEmployeeSetupData?.payrollBenefitInputs;
        this.payrollInputOtherTypes = payrollEmployeeSetupData?.payrollOtherInputs;
        this.hasLastDayOfService = payrollEmployeeSetupData?.hasLastDayOfService;
        this.exchangeRates = payrollEmployeeSetupData?.exchangeRates;
        this.outstandingEmployerLoanClosingBalance = payrollEmployeeSetupData?.outstandingEmployerLoanClosingBalance;
        this.payslipLoans = payrollEmployeeSetupData?.payslipLoans;
        this.hasPausedLoans = payrollEmployeeSetupData?.hasPausedLoans;
        this.employeeExcludedFromTax = payrollEmployeeSetupData?.employeeExcludedFromTax;
        this.employeeExcludedFromGovernmentContributions = payrollEmployeeSetupData?.excludeFromGovernmentContributions;
        if (payrollEmployeeSetupData?.designationExchangeRate)
          this.relevantExchangeRate = this.exchangeRates.find(rate => rate.id == payrollEmployeeSetupData?.designationExchangeRate);
        this.loadPayrollInputs();
        this.downloadedPayslipData = downloadedPayslip;
        if (this.downloadedPayslipData) {
          const downloadedPayslip = this.downloadedPayslipData?.get(payrollEmployeeSetupData?.employee?.id);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getPayslipFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
      })
  }

  public onChangeEmployees(event: any): void {
    if (event?.value && this.payRunId)
      this.gotoRoute(this.currentPageKey, `/payroll/payruns/employee-setup/${event?.value}/${this.payRunId}`);
  }

  public loadActivityLog(payRunId: number): void {
    this.store.dispatch(getEmployeeActivityLoggingAction({
      payload: {
        employeeId: this.employeeId,
        payRunId: payRunId ?? this.payRunId
      }
    }));
  }

  public onRevertPayslip(): void {
    this.btnDialogClassClr = 'red';
    this.confirmationService.confirm({
      message: 'Are you sure you want to Revert?',
      accept: () => {
        this.store.dispatch(approveRevertPayslipAction({
          payload: [{ payslipId: this.payslipPreview?.payslip?.id, revert: true }],
          employeePayRun: { //note: we need to pass since api doesnt have proper response what we need
            employeeId: this.employeeId,
            payRunId: this.payRunId
          }
        }));
      },
      reject: () => {
        try {
          this.cdDynamic.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public onApprovePayslip(): void {
    this.btnDialogClassClr = 'success';
    this.confirmationService.confirm({
      message: 'Are you sure you want to Approve?',
      accept: () => {
        this.store.dispatch(approveRevertPayslipAction({
          payload: [{ payslipId: this.payslipPreview?.payslip?.id, revert: false }],
          employeePayRun: { //note: we need to pass since api doesnt have proper response what we need
            employeeId: this.employeeId,
            payRunId: this.payRunId
          }
        }));
      },
      reject: () => {
        try {
          this.cdDynamic.reject(); //note: temporary catch
        } catch (error) { console.log(error) }
      }
    });
  }

  public onDownloadPayslip(): void {
    const { employee, payRun } = this.payrollEmployeeSetupData;
    if (employee) {
      const downloadedPayslip = this.downloadedPayslipData?.get(employee?.id);
      if (downloadedPayslip) {
        try {
          processPayrunDownload(downloadedPayslip?.data, this.getPayslipFileName);
        } catch (error) {
          this.showError(error as string);
        }
      }
      else
        this.store.dispatch(generatePDFPaySlipAction({ employeeId: employee?.id, payRunId: payRun?.id }));
    }
  }

  public loadPayrollInputs(): void {
    /**
     * General note: we need to evaluate the coding types and logic below, -_-
     */
    this.basicSalaryInput = undefined;
    this.closingBalance = undefined;
    this.showOutstandingEmployerLoanClosingBalance = false;
    this.payslip = { ...this.payslipPreview?.payslip, tempNotes: '' };
    this.hasPastDraftPayslip = this.payslipPreview?.hasPastDraftPayslips || false;
    this.socialSecurityEmployee = this.payslip.deductions?.filter(deduction => deduction?.isSocialSecurityDeduction);
    this.socialSecurityEmployer = this.payslip.employerContributions?.filter(contribution => contribution?.isSocialSecurityDeduction);
    this.basicSalaryInput = this.payslip?.payrollInputs?.find(input => input?.payrollInputType === PayrollInputType.BasicSalary);
    if (this.payslip?.payslipCurrency)
      this.lockPayslipCurrency = this.payslip?.payslipCurrency?.lockCurrency;
    if (this.payslip?.payslipCurrency !== null
      && this.payslip?.payslipCurrency?.exchangeRateOverride !== null
      && this.payslip?.payslipCurrency?.exchangeRateOverride !== 0)
      this.customExchangeRateOverride = this.payslip.payslipCurrency?.exchangeRateOverride;
    else
      this.customExchangeRateOverride = null;
    if (this.exchangeRates && this.relevantExchangeRate)
      this.latestExchangeRateItem = this.relevantExchangeRate?.exchangeRateItems[0];
    for (let i = 0; i < this.payslip?.incomes?.length; i++) {
      if (this.payslip?.incomes[i]?.isSeveranceIncome == true) {
        this.hasSeveranceIncomes = true;
        break;
      }
      else
        this.hasSeveranceIncomes = false;
    }
    this.payrollInputIncomes = [];
    this.payrollInputs = [];
    const payrollIncomes = this.payslip.payrollInputs?.filter(input => input?.payrollInputType === PayrollInputType.Income);
    for (let i = 0; i < payrollIncomes?.length; i++) {
      this.payrollInputIncomes.push(payrollIncomes[i]);
      this.payrollInputs.push(payrollIncomes[i]);
    }
    this.payrollInputDeductions = [];
    this.payrollInputAllowances = [];
    const payrollAllowances = this.payslip.payrollInputs?.filter(input => input?.payrollInputType === PayrollInputType.Allowance);
    for (let i = 0; i < payrollAllowances?.length; i++)
      this.payrollInputAllowances.push(payrollAllowances[i]);
    this.payrollInputBenefits = [];
    const payrollBenefits = this.payslip.payrollInputs?.filter(input => input?.payrollInputType === PayrollInputType.Benefit);
    for (let i = 0; i < payrollBenefits?.length; i++)
      this.payrollInputBenefits.push(payrollBenefits[i]);
    this.payrollInputOthers = [];
    let hasLoanInput = false;
    const payrollOther = this.payslip?.payrollInputs?.filter(input => input?.payrollInputType === PayrollInputType.Other);
    for (let i = 0; i < payrollOther?.length; i++) {
      this.payrollInputOthers.push(payrollOther[i]);
      if (payrollOther[i]?.payrollOtherType === PayrollInputType.Allowance) {
        hasLoanInput = true;
        if (payrollOther[i].closingBalance > 0)
          this.closingBalance = payrollOther[i]?.closingBalance;
      }
    }
    if (hasLoanInput === false
      && this.outstandingEmployerLoanClosingBalance !== null
      && this.outstandingEmployerLoanClosingBalance !== 0) {
      this.showOutstandingEmployerLoanClosingBalance = true;
    }
    this.determineIfPayslipHasSeveranceIncomes();
    this.payrollInputId = null;
  }

  public determineIfPayslipHasSeveranceIncomes(): void {
    for (let i = 0; i < this.payslip?.incomes?.length; i++) {
      if (this.payslip?.incomes[i]?.isSeveranceIncome === true) {
        this.hasSeveranceIncomes = true;
        break;
      }
      else
        this.hasSeveranceIncomes = false;
    }
  }

  public onBack(): void {
    this.gotoRoute(this.currentPageKey, `payroll/payruns/edit/${this.payRunId}`);
  }

  public handleTabChange(event: any): void {
    console.log(event)
  }

  private get getPayslipFileName(): string {
    const { employee, payRun } = this.payrollEmployeeSetupData;
    const date = new Date(payRun?.payDate ?? payRun?.toDate);
    return employee?.firstName.substring(0, 1) + '_'
      + employee?.lastName.replace(' ', '') + '_'
      + date.toLocaleString('default', { month: 'short' }) + '_'
      + date.getDate() + '_'
      + date.getFullYear().toString() + '.pdf';
  }
}
