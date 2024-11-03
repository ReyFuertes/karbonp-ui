import { Component, Injector, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { IBeneficiary, ICustomPaytype, IPayrollAllowanceInput, IPayrollCalculation, IPayrollCalculationSetting, IPayrollEmployeeSetupData, IPayrollInput, IPayrollInputNote, IPayslip, IPayslipPreview } from '../../payroll.model';
import { CountryISOCodeType, RunPayslipStatusType } from 'src/app/models/generic.enum';
import { IDesignation, IOptionItem, PaymentType } from 'src/app/models/generic.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { generatePDFPaySlipAction, getBeneficiariesAction, getEmployeeRetirementFundingAction, getPayrollEmployeeHoursAction, getPayrollPayTypeAction, getPublicHolidaysByPayRunAction, getRestDaysForEmployeeAction, getTimeAndAttendanceAction, saveBasicSalaryAction, updatePayslipProRataPercentageAction } from '../../store/payrun-in-progress/payroll-payrun-in-progress.action';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';
import { getBeneficiariesSelector, getEmployeeDesignationSelector, getEmployeeWorkingHourSelector, getPayrollCalculationSettingsSelector, getPayrollcalculationsSelector, getPayrollEmployeeSetupDataSelector, getPayrollPayslipPreviewDataSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { IEmployeeWorkingHour } from 'src/app/modules/employee/employee.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { PayrollEmployeeSetupPayrollDeductionsDialogComponent } from '../payroll-employee-setup-payroll-deductions-dialog/payroll-employee-setup-payroll-deductions-dialog.component';
import { PayrollEmployeeSetupPayrollAllowancesDialogComponent } from '../payroll-employee-setup-payroll-allowances-dialog/payroll-employee-setup-payroll-allowances-dialog.component';
import { sortByAsc } from 'src/app/shared/util/sort';
import { PayrollEmployeeSetupPayrollIncomeDialogComponent } from '../payroll-employee-setup-payroll-income-dialog/payroll-employee-setup-payroll-income-dialog.component';
import { PayrollEmployeeSetupPayrollNotesPublicDialogComponent } from '../payroll-employee-setup-payroll-notes-public-dialog/payroll-employee-setup-payroll-notes-public-dialog.component';
import { PayrollEmployeeSetupPayrollNotesPrivateDialogComponent } from '../payroll-employee-setup-payroll-notes-private-dialog/payroll-employee-setup-payroll-notes-private-dialog.component';
import { PayrollEmployeeSetupPayrollBenefitsDialogComponent } from '../payroll-employee-setup-payroll-benefits-dialog/payroll-employee-setup-payroll-benefits-dialog.component';
import { BeneficiaryType, InputType, LoanCalculationOptionType, PayrollAllowanceType, PayrollBenefitType, PayrollDeductionType, PayrollIncomeType, PayrollInputType, PayrollOtherType } from '../../payroll.enum';
import { PayrollEmployeeSetupPayrollOtherDialogComponent } from '../payroll-employee-setup-payroll-other-dialog/payroll-employee-setup-payroll-other-dialog.component';
import { deleteNotesAction, deletePayrollInputAction, getBasicSalaryPayrollInputAction, getDeductionPayrollInputAction, getRelevantPhilippinesRegulatedSettingAction, getSelectedPayrollInputsAction } from '../../store/payroll-input/payroll-input.action';
import { PayrollEmployeeSetupPayrollGoalGetterDialogComponent } from '../payroll-employee-setup-payroll-goal-getter-dialog/payroll-employee-setup-payroll-goal-getter-dialog.component';

@Component({
  selector: 'kp-payroll-employee-setup-payroll',
  templateUrl: './payroll-employee-setup-payroll.component.html',
  styleUrls: ['./payroll-employee-setup-payroll.component.scss']
})
export class PayrollEmployeeSetupPayrollComponent extends GenericPage implements OnInit, OnChanges {
  @Input() public payslipStatus: RunPayslipStatusType;
  @Input() public payRollCalculationSetup: IPayrollCalculation;
  @Input() public basicSalaryInput: IPayrollInput;
  @Input() public incomeInputTypes: IPayrollInput[];
  @Input() public allowanceInputTypes: IPayrollInput[];
  @Input() public otherInputTypes: IPayrollInput[];
  @Input() public payrollInputDeductions: IPayrollInput[];
  @ViewChild('pESPDeduction') public pESPDeduction: PayrollEmployeeSetupPayrollDeductionsDialogComponent;
  @ViewChild('pESPAllowance') public pESPAllowance: PayrollEmployeeSetupPayrollAllowancesDialogComponent;
  @ViewChild('pESPIncome') public pESPIncome: PayrollEmployeeSetupPayrollIncomeDialogComponent;
  @ViewChild('pESPNotesPublic') public pESPNotesPublic: PayrollEmployeeSetupPayrollNotesPublicDialogComponent;
  @ViewChild('pESPNotePrivate') public pESPNotePrivate: PayrollEmployeeSetupPayrollNotesPrivateDialogComponent;
  @ViewChild('pESPBenefits') public pESPBenefits: PayrollEmployeeSetupPayrollBenefitsDialogComponent;
  @ViewChild('pESPOther') public pESPOther: PayrollEmployeeSetupPayrollOtherDialogComponent;
  @ViewChild('pESPGoalGetter') public pESPGoalGetter: PayrollEmployeeSetupPayrollGoalGetterDialogComponent;

  public benefitInputTypes: IPayrollInput[];
  public payslipPreview: IPayslipPreview;
  public employeeSetupData: IPayrollEmployeeSetupData;
  public deductionsModalTitle: string = '';
  public deductionType = PayrollDeductionType;
  public deductionInputTypeOptions: IOptionItem[];
  public deductionAllowanceInputs: IPayrollAllowanceInput[] = [];
  public benefitsAllowanceOptions: IPayrollAllowanceInput[] = [];
  public otherAllowanceOptions: IPayrollAllowanceInput[] = [];
  public allowancesOptions: IPayrollAllowanceInput[] = [];
  public deductionOptions: IPayrollAllowanceInput[] = [];
  public incomeAllowanceOptions: IPayrollAllowanceInput[] = [];
  public paymentTypeOptions = GetTypes(PaymentType);
  public baseEarningsForm: FormGroup;
  public deductionInputSetupForm: FormGroup;
  public payslipStatusType = RunPayslipStatusType;
  public paymentType = PaymentType;
  public showProRatePercentageModal: boolean;
  public proRataOverridePercentage: number;
  public showGoalGetterModal: boolean = false;
  public showBaseEarningsModal: boolean = false;
  public downloadedPayslipData = new Map<number, any>();
  public employeeWorkingHour: IEmployeeWorkingHour;
  public employeeDesignation: IDesignation;
  public payrollCalculationSettings: IPayrollCalculationSetting[];
  public payrollcalculations: IPayrollCalculation;
  public hasPaymentAmountOnDesignation: boolean = false;
  public showDeductionsModal: boolean = false;
  public beneficiaryType: BeneficiaryType;
  public loanCalculationOptions: IOptionItem[];
  public showWarningRFINotConfigured: boolean = false;
  public loanCalculationOptionType = LoanCalculationOptionType;
  public customPaytype: ICustomPaytype;
  public inputType = InputType;
  public beneficiaries: IBeneficiary[];
  public publicNotes: IPayrollInputNote;

  constructor(injector: Injector) {
    super(injector);
    this.baseEarningsForm = this.fb.group({
      setAmount: new FormControl(undefined, Validators.required),
      paymentType: new FormControl(undefined),
      overrideFixedPay: new FormControl(undefined),
      paidForAdditionalHours: new FormControl(undefined),
      overrideCalculatedHourlyRate: new FormControl(undefined),
      calculateDailyBreakdownForFixedPay: new FormControl(undefined),
      rateOverride: new FormControl(undefined),
      hourlyRate: new FormControl(undefined),
      dailyRate: new FormControl(undefined),
      daysWorked: new FormControl(undefined),
      dontAutoPayPublicHolidays: new FormControl(undefined),
      additionalHours: new FormControl(0),
      overtimeOverrideHours: new FormControl(0),
      shortHours: new FormControl(0),
      normalHours: new FormControl(0),
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollPayslipPreviewDataSelector)),
      this.store.pipe(select(getPayrollEmployeeSetupDataSelector)),
      this.store.pipe(select(getEmployeeWorkingHourSelector)),
      this.store.pipe(select(getEmployeeDesignationSelector)),
      this.store.pipe(select(getPayrollCalculationSettingsSelector)),
      this.store.pipe(select(getPayrollcalculationsSelector)),
      this.store.pipe(select(getBeneficiariesSelector)),
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([payslipPreview, employeeSetupData, employeeWorkingHour, employeeDesignation,
        payrollCalculationSettings, payrollcalculations, beneficiaries]) => {
        this.payslipPreview = payslipPreview;
        const basicSalaryInput = this.payslipPreview?.payslip?.payrollInputs
          ?.find(input => input?.payrollInputType === PayrollInputType.BasicSalary)
        if (basicSalaryInput) {
          this.baseEarningsForm.patchValue({
            paymentType: basicSalaryInput?.paymentType,
            setAmount: basicSalaryInput?.fixedAmount,
            overrideFixedPay: basicSalaryInput?.overrideFixedPay,
            paidForAdditionalHours: basicSalaryInput?.paidForAdditionalHours,
            overrideCalculatedHourlyRate: basicSalaryInput?.overrideCalculatedHourlyRate,
            calculateDailyBreakdownForFixedPay: basicSalaryInput?.calculateDailyBreakdownForFixedPay,
            rateOverride: basicSalaryInput?.rateOverride,
            hourlyRate: basicSalaryInput?.hourlyRate,
            dailyRate: basicSalaryInput?.dailyRate,
            daysWorked: basicSalaryInput?.daysWorked,
            dontAutoPayPublicHolidays: basicSalaryInput?.dontAutoPayPublicHolidays,
            additionalHours: basicSalaryInput?.additionalHours ?? 0,
            overtimeOverrideHours: basicSalaryInput?.overtimeOverrideHours ?? 0,
            shortHours: basicSalaryInput?.shortHours ?? 0,
            normalHours: basicSalaryInput?.normalHours ?? 0
          });
        }
        this.employeeSetupData = employeeSetupData;
        this.employeeWorkingHour = employeeWorkingHour;
        this.employeeDesignation = employeeDesignation;
        this.payrollCalculationSettings = payrollCalculationSettings;
        this.payrollcalculations = payrollcalculations;
        this.hasPaymentAmountOnDesignation = this.employeeDesignation?.paymentAmount !== null
          && this.employeeDesignation?.paymentAmount > 0
          ? true
          : false;
        this.beneficiaries = beneficiaries;
        this.benefitsAllowanceOptions = employeeSetupData?.payrollBenefitInputs
          ?.sort((a: IPayrollAllowanceInput, b: IPayrollAllowanceInput) => sortByAsc(a, b, 'resource'))
          ?.map(input => Object.assign({}, input, { resource: this.translateService.instant(input?.resource) }))
          ?.filter(input => !this.getBenefitPayrollInputs.find(i => i.resource === input.resource));
        this.otherAllowanceOptions = employeeSetupData?.payrollOtherInputs
          ?.sort((a: IPayrollAllowanceInput, b: IPayrollAllowanceInput) => sortByAsc(a, b, 'resource'))
          ?.map(input => Object.assign({}, input, { resource: this.translateService.instant(input?.resource) }))
          ?.filter(input => !this.getOtherPayrollInputs.find(i => i.resource === input.resource));
        this.allowancesOptions = employeeSetupData?.payrollAllowanceInputs
          ?.sort((a: IPayrollAllowanceInput, b: IPayrollAllowanceInput) => sortByAsc(a, b, 'resource'))
          ?.map(input => Object.assign({}, input, { resource: this.translateService.instant(input?.resource) }))
          ?.filter(input => !this.getAllowancePayrollInputs.find(i => i.resource === input.resource));
        this.incomeAllowanceOptions = employeeSetupData?.payrollIncomeInputs
          ?.sort((a: IPayrollAllowanceInput, b: IPayrollAllowanceInput) => sortByAsc(a, b, 'resource'))
          ?.map(input => Object.assign({}, input, { resource: this.translateService.instant(input?.resource) }))
          ?.filter(input => !this.getIncomeTypePayrollInputs.find(i => i.resource === input.resource));
        this.deductionOptions = employeeSetupData?.payrollDeductionInputs
          ?.sort((a: IPayrollAllowanceInput, b: IPayrollAllowanceInput) => sortByAsc(a, b, 'resource'))
          ?.map(input => Object.assign({}, input, { resource: this.translateService.instant(input?.resource) }))
          ?.filter(input => !this.getDeductionsPayrollInputs.find(i => i.resource === input.resource));
      });
  }

  public onGoalGetter(): void {
    const { payslip } = this.payslipPreview;
    if (payslip) {
      const goalGetterOptions: IOptionItem[] = [];
      const basicSalary = payslip?.payrollInputs
        ?.find(input => input.payrollInputType === PayrollInputType.BasicSalary);
      if (payslip?.isOnceOffPayslip === false
        && basicSalary
        || basicSalary?.paymentType !== PaymentType.Hourly) {
        goalGetterOptions.push({ label: this.translateService.instant('BaseEarnings'), value: 0 })
      }
      if (this.currentCountryISOCode === this.countryISOCodeType.ZA) {
        goalGetterOptions.push({ label: this.translateService.instant('AnnualBonus'), value: 1 })
      }
      goalGetterOptions.push({ label: this.translateService.instant('Commission'), value: 2 });
      this.pESPGoalGetter.goalGetterOptions = goalGetterOptions;
      this.pESPGoalGetter.form.get('payslipId').patchValue(payslip.id);
      this.pESPGoalGetter.showGoalGetterModal = true;
    }
    else
      console.log('Error: "Enumerator failed to MoveNextAsync."') //note: GetPayrollEmployeeSetupData/341/240
  }

  public gotoEmployeeAddHours(): void {
    if (this.employeeSetupData) {
      const { employee, payRun } = this.employeeSetupData;
      if (payRun && employee) {
        this.store.dispatch(getTimeAndAttendanceAction());
        this.store.dispatch(getBasicSalaryPayrollInputAction({ employeeId: employee?.id, payRunId: payRun?.id }));
        this.store.dispatch(getPublicHolidaysByPayRunAction({ payRunId: payRun?.id }));
        this.store.dispatch(getRestDaysForEmployeeAction({ employeeId: employee?.id, payRunId: payRun?.id }));
        this.router.navigateByUrl(`/payroll/payruns/employee-additional-hours/${payRun?.id}`);
      }
    }
    else
      alert('No employee loaded..')
  }

  public get getDeductionsPayrollInputs(): IPayrollInput[] {
    return this.getPayrollInputOptions(this.employeeSetupData?.payrollDeductionInputs, this.getDeductionInputTypes, 'payrollDeductionType');
  }

  public get getAllowancePayrollInputs(): IPayrollInput[] {
    return this.getPayrollInputOptions(this.employeeSetupData?.payrollAllowanceInputs, this.getAllowanceInputTypes, 'payrollAllowanceType');
  }

  public get getOtherPayrollInputs(): IPayrollInput[] {
    return this.getPayrollInputOptions(this.employeeSetupData?.payrollOtherInputs, this.getOtherInputTypes, 'payrollOtherType');
  }

  public get getIncomeTypePayrollInputs(): IPayrollInput[] {
    return this.getPayrollInputOptions(this.employeeSetupData?.payrollIncomeInputs, this.getIncomeInputTypes, 'payrollIncomeType');
  }

  public get getBenefitPayrollInputs(): IPayrollInput[] {
    return this.getPayrollInputOptions(this.employeeSetupData?.payrollBenefitInputs, this.getBenefitInputTypes, 'payrollBenefitType');
  }

  public onChangeOthers(event: any): void {
    if (event?.value === null) return;
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: event?.value }));
    this.pESPOther.otherInputSetupForm.get('otherInputType').patchValue(event?.value);
    this.pESPOther.otherModalTitle = PayrollOtherType[event?.value];
    this.pESPOther.showOtherModal = true;
  }

  public onChangeBenefits(event: any): void {
    if (event?.value === null) return;
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: event?.value }));
    this.pESPBenefits.benefitInputSetupForm.get('benefitInputType').patchValue(event?.value);
    this.pESPBenefits.benefitsModalTitle = PayrollBenefitType[event?.value];
    this.pESPBenefits.showBenefitsModal = true;
  }

  public onDeleteNote(payslip: IPayslip, isPrivateNote: boolean): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this note?`,
      accept: () => {
        this.store.dispatch(deleteNotesAction({
          payload: {
            id: payslip?.id,
            employeeId: this.employeeSetupData?.employee?.id,
            payRunId: this.employeeSetupData?.payRun?.id,
            notes: payslip?.notes,
            isPrivateNote: isPrivateNote,
            copyNoteOver: isPrivateNote
              ? payslip?.copyNotes
              : payslip?.copyPrivateNotes
          }
        }))
      },
      reject: () => {
        try {
          this.cd.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public onEditOther(payrollInput: IPayrollInput): void {
    this.store.dispatch(getSelectedPayrollInputsAction({ payrollInputId: payrollInput?.id, payRunId: this.employeeSetupData.payRun?.id }))
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: payrollInput?.inputType }));
    this.pESPOther.otherInputSetupForm.get('otherInputType').patchValue(payrollInput?.inputType, { emitEvent: false });
    this.pESPOther.otherModalTitle = PayrollOtherType[payrollInput?.inputType];
    this.pESPOther.isEdit = true;
    this.pESPOther.showOtherModal = true;
  }

  public onEditBenefit(payrollInput: IPayrollInput): void {
    this.store.dispatch(getSelectedPayrollInputsAction({ payrollInputId: payrollInput?.id, payRunId: this.employeeSetupData.payRun?.id }))
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: payrollInput?.inputType }));
    this.pESPBenefits.benefitInputSetupForm.get('benefitInputType').patchValue(payrollInput?.inputType);
    this.pESPBenefits.benefitsModalTitle = PayrollBenefitType[payrollInput?.inputType];
    this.pESPBenefits.isEdit = true;
    this.pESPBenefits.showBenefitsModal = true;
  }

  public onChangeAllowances(event: any): void {
    if (event?.value === null) return;
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: event?.value }));
    this.pESPAllowance.allowanceInputSetupForm.get('allowanceInputType').patchValue(event?.value);
    this.pESPAllowance.allowancesModalTitle = PayrollAllowanceType[event?.value];
    this.pESPAllowance.isEdit = false;
    this.pESPAllowance.showAllowancesModal = true;
  }

  public onEditAllowances(payrollInput: IPayrollInput): void {
    this.store.dispatch(getSelectedPayrollInputsAction({ payrollInputId: payrollInput?.id, payRunId: this.employeeSetupData.payRun?.id }))
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: payrollInput?.inputType }));
    this.pESPAllowance.allowanceInputSetupForm.get('allowanceInputType').patchValue(payrollInput?.inputType);
    this.pESPAllowance.allowancesModalTitle = PayrollAllowanceType[payrollInput?.inputType];
    this.pESPAllowance.isEdit = true;
    this.pESPAllowance.showAllowancesModal = true;
  }

  public onEditPublicNote(): void {
    this.pESPNotesPublic.notesPublicForm.patchValue({
      employeeId: this.employeeSetupData?.employee?.id,
      payRunId: this.employeeSetupData?.payRun?.id,
      notes: this.payslipPreview?.payslip?.notes,
      copyNoteOver: this.payslipPreview?.payslip?.copyNotes
    });
    this.pESPNotesPublic.notesPublicModalTitle = this.translateService.instant('PublicNotes');
    this.pESPNotesPublic.showNotesPublicModal = true;
  }

  public onEditPrivateNote(): void {
    this.pESPNotePrivate.notesPrivateForm.patchValue({
      employeeId: this.employeeSetupData?.employee?.id,
      payRunId: this.employeeSetupData?.payRun?.id,
      notes: this.payslipPreview?.payslip?.privateNotes,
      copyNoteOver: this.payslipPreview?.payslip?.copyPrivateNotes
    });
    this.pESPNotePrivate.notesPrivateModalTitle = this.translateService.instant('PrivateNotes');
    this.pESPNotePrivate.showNotesPrivateModal = true;
  }

  public onEditIncome(payrollInput: IPayrollInput): void {
    if (this.currentCountryISOCode === CountryISOCodeType.PHL)
      this.store.dispatch(getRelevantPhilippinesRegulatedSettingAction({ payRunId: payrollInput?.id }));
    this.store.dispatch(getSelectedPayrollInputsAction({ payrollInputId: payrollInput?.id, payRunId: this.employeeSetupData.payRun?.id }))
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: payrollInput?.inputType }));
    this.pESPIncome.incomeInputSetupForm.get('incomeInputType').patchValue(payrollInput?.inputType);
    this.pESPIncome.incomeModalTitle = PayrollIncomeType[payrollInput?.inputType];
    this.pESPIncome.isEdit = true;
    this.pESPIncome.showIncomeModal = true;
  }

  public onChangeIncomes(event: any): void {
    if (event?.value === null) return;
    if (this.currentCountryISOCode === CountryISOCodeType.PHL)
      this.store.dispatch(getRelevantPhilippinesRegulatedSettingAction({ payRunId: event?.value }));
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: event?.value }));
    this.pESPIncome.incomeInputSetupForm.get('incomeInputType').patchValue(event?.value);
    this.pESPIncome.incomeModalTitle = PayrollIncomeType[event?.value];
    this.pESPAllowance.isEdit = false;
    this.pESPIncome.showIncomeModal = true;
  }

  public get getIncomeInputTypes(): IPayrollInput[] {
    return this.payslipPreview?.payslip?.payrollInputs
      ?.filter(input => input?.payrollInputType === PayrollInputType.Income);
  }

  public get getAllowanceInputTypes(): IPayrollInput[] {
    return this.payslipPreview?.payslip?.payrollInputs
      ?.filter(input => input?.payrollInputType === PayrollInputType.Allowance);
  }

  public get getOtherInputTypes(): IPayrollInput[] {
    return this.payslipPreview?.payslip?.payrollInputs
      ?.filter(input => input?.payrollInputType === PayrollInputType.Other);
  }

  public get getBenefitInputTypes(): IPayrollInput[] {
    return this.payslipPreview?.payslip?.payrollInputs
      ?.filter(input => input?.payrollInputType === PayrollInputType.Benefit);
  }

  public get getDeductionInputTypes(): IPayrollInput[] {
    return this.payslipPreview?.payslip?.payrollInputs
      ?.filter(input => input?.payrollInputType === PayrollInputType.Deduction);
  }

  public onDeletePayrollInput(inputType: IPayrollInput): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete?`,
      accept: () => {
        this.store.dispatch(deletePayrollInputAction({
          id: inputType?.id,
          employeeId: this.employeeSetupData?.employee?.id,
          payRunId: this.employeeSetupData?.payRun?.id,
        }))
      },
      reject: () => {
        try {
          this.cd.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public onEditDeductions(payrollInput: IPayrollInput): void {
    this.store.dispatch(getDeductionPayrollInputAction({ payrollInputId: payrollInput?.id, payRunId: this.employeeSetupData.payRun?.id }))
    this.store.dispatch(getPayrollPayTypeAction({ payTypeId: payrollInput?.inputType }));
    this.store.dispatch(getEmployeeRetirementFundingAction({ employeeId: this.employeeSetupData.employee?.id }));
    this.pESPDeduction.deductionInputSetupForm.get('deductionInputType').patchValue(payrollInput?.inputType);
    this.pESPDeduction.deductionsModalTitle = PayrollDeductionType[payrollInput?.inputType];
    this.pESPIncome.isEdit = true;
    this.pESPDeduction.showDeductionsModal = true;
  }

  public get getDeductionOptions(): IPayrollInput[] {
    const addedDeductionInputTypes: IPayrollInput[] = [];
    this.getDeductionInputTypes?.forEach(payrollInput => {
      const match = this.employeeSetupData?.payrollDeductionInputs?.find(input => input.inputType === payrollInput?.payrollDeductionType);
      if (match)
        addedDeductionInputTypes.push(Object.assign(match as any, { amount: payrollInput?.amount, id: payrollInput?.id }));
    });
    return addedDeductionInputTypes;
  }

  public onChangeDeductions(event: any): void {
    if (event?.value === null) return;
    this.getBeneficiaryType(event?.value);
    if (this.beneficiaryType) {
      this.store.dispatch(getBeneficiariesAction({
        payload: {
          beneficiaryType: this.beneficiaryType,
          active: true,
          implementSortingAndPaging: false
        }
      }))
    }
    this.store.dispatch(getEmployeeRetirementFundingAction({ employeeId: this.employeeSetupData.employee?.id }));
    this.pESPDeduction.deductionInputSetupForm.get('deductionInputType').patchValue(event?.value);
    this.pESPDeduction.deductionsModalTitle = PayrollDeductionType[event?.value];
    this.pESPDeduction.showDeductionsModal = true;
  }

  public getLoanReferenceNumber(id: number): void {
    alert('Not Implemented');
    console.log(id);
  }

  public removePayrollInput(id: number): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete?`,
      accept: () => {
        alert('Not Implemented');
        console.log(id)
      },
      reject: () => {
        try {
          this.cd.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public goToRFISetup(): void {
    alert('Not Implemented');
    //this.router.navigateUrl('/employee-retirement-income-funding-setup');
  }

  public onSaveBaseEarnings(): void {
    const value = this.baseEarningsForm.value;
    if (this.baseEarningsForm.valid) {
      const { employee, payRun } = this.employeeSetupData;
      this.store.dispatch(saveBasicSalaryAction({ payload: value, employeeId: employee?.id, payRunId: payRun?.id }));
      this.showBaseEarningsModal = false;
    }
  }

  public onDownloadPayslip(): void {
    const { employee, payRun } = this.employeeSetupData;
    const downloadedPayslip = this.downloadedPayslipData?.get(employee?.id);
    if (downloadedPayslip) {
      const date = new Date(payRun?.payDate ?? payRun?.toDate);
      const fileName = employee.firstName.substring(0, 1) + '_'
        + employee.lastName.replace(' ', '') + '_'
        + date.toLocaleString('default', { month: 'short' }) + '_'
        + date.getDate() + '_'
        + date.getFullYear().toString() + '.pdf';
      try {
        processPayrunDownload(downloadedPayslip?.data, fileName);
      } catch (error) {
        this.showError(error as string);
      }
    }
    else
      this.store.dispatch(generatePDFPaySlipAction({ employeeId: employee?.id, payRunId: payRun?.id }));
  }

  public onEditBaseEarnings(): void {
    const { employee, payRun } = this.employeeSetupData;
    if (employee?.id) {
      this.store.dispatch(getPayrollEmployeeHoursAction({ employeeId: employee?.id, payRunId: payRun?.id }));
      this.showBaseEarningsModal = true;
    }
  }

  public onShowGoalGetterModal(): void {
    alert('Not Implemented');
  }

  public onSaveProRatePercentageOverride(): void {
    const { payslip } = this.payslipPreview;
    if (payslip) {
      this.store.dispatch(updatePayslipProRataPercentageAction({ payload: payslip }));
      setTimeout(() => this.showProRatePercentageModal = false, 1000);
    }
  }

  public isApproved(payslip: IPayslip): boolean {
    return payslip?.payslipStatus === RunPayslipStatusType.Draft;
  }

  private getPayrollInputOptions(payrollAllowanceInput: IPayrollAllowanceInput[], payrollInputTypes: IPayrollInput[], strType: string): IPayrollInput[] {
    const addedInputTypes: IPayrollInput[] = [];
    payrollInputTypes?.forEach((payrollInput: any) => {
      const match = payrollAllowanceInput?.find((input) => input.inputType === payrollInput[strType]); //note: payrollInput property not properly set
      if (match) {
        const item = Object.assign({}, match as any, {
          resource: payrollInput?.customItem?.name ?
            `${payrollInput?.customItem?.name} (${this.translateService.instant(match?.resource)})`
            : this.translateService.instant(match?.resource),
          amount: payrollInput?.customItem?.amount ?? payrollInput?.amount,
          id: payrollInput?.id
        })
        if (addedInputTypes.indexOf(item) <= 0)
          addedInputTypes.push(item);
      }
    });
    return addedInputTypes;
  }

  private getBeneficiaryType(type: number): void {
    switch (type) {
      case PayrollDeductionType.Garnishee:
        this.beneficiaryType = BeneficiaryType.Garnishee;
        break;
      case PayrollDeductionType.MaintenanceOrder:
        this.beneficiaryType = BeneficiaryType.MaintenanceOrder;
        break;
      case PayrollDeductionType.PensionFund:
        this.beneficiaryType = BeneficiaryType.PensionFund;
        break;
      case PayrollDeductionType.ProvidentFund:
        this.beneficiaryType = BeneficiaryType.ProvidentFund;
        break;
      case PayrollDeductionType.RetirementAnnuityFund:
        this.beneficiaryType = BeneficiaryType.RetirementAnnuityFund;
        break;
      case PayrollDeductionType.MedicalAid:
        this.beneficiaryType = BeneficiaryType.MedicalAid;
        break;
    }
  }
}
