import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayrollSettingsPayTypesByIdSelector, getPayrollSettingsPayTypesSelector, getPayrollSettingsPayTypeTotalItemsSelector } from '../../store/payroll-settings-pay-type/payroll-settings-pay-type.selector';
import { ICustomPaytype, IPayPeriodTypesPayload } from '../../payroll.model';
import { getPayrollSettingsPayTypesAction, saveCustomItemAction } from '../../store/payroll-settings-pay-type/payroll-settings-pay-type.action';
import { CustomItemType, InputType } from '../../payroll.enum';
import { GetTypes } from 'src/app/shared/util/types.util';
import { ILeaveSetup, IOptionItem } from 'src/app/models/generic.model';
import { DialogStateType } from 'src/app/models/generic.enum';
import { getPayrollcalculationSelector } from '../../store/payroll-input/payroll-input.selector';
import { getLeaveSetupsSelector } from 'src/app/store/app.selector';

@Component({
  selector: 'kp-payroll-settings-paytypes',
  templateUrl: './payroll-settings-paytypes.component.html',
  styleUrls: ['./payroll-settings-paytypes.component.scss']
})
export class PayrollSettingsPayTypesComponent extends GenericPage implements OnInit {
  public columns: string[] = ['Name', 'Pay Type', 'Active'];
  public customPaytypes: ICustomPaytype[];
  public payrollPayTypesTotalItems: number;
  public pageNumber: number = 1;
  public pageRows: number = 10;
  public customItemType = CustomItemType;
  public customItemTypeOptions = GetTypes(CustomItemType);
  public statusOptions: IOptionItem[] = [];
  public formFilter: FormGroup;
  private payload: IPayPeriodTypesPayload = {
    active: null,
    pageNumber: this.pageNumber,
    pagesize: this.pageRows,
    customItemType: null,
    sortAscending: true,
    searchText: '',
    sortBy: 'Name'
  }
  public dialogTitle: string;
  public selectedCustomPayTypes: ICustomPaytype;
  public inputTypeOptions: IOptionItem[] = [];
  public inputType = InputType;
  public taxExemptionOptions: IOptionItem[] = [];
  public isBimesterSBCCalculations: boolean = false;
  public selectedPayTypesType: ICustomPaytype;
  public leaveSetups: ILeaveSetup[] = [];

  constructor(injector: Injector) {
    super(injector);
    this.formFilter = this.fb.group({
      active: new FormControl(undefined),
      searchText: new FormControl(''),
      customItemType: new FormControl(undefined),
    });
    this.statusOptions = [{
      label: this.translateService.instant('ActiveOnly'),
      value: true
    }, {
      label: this.translateService.instant('InactiveOnly'),
      value: false
    }];
    this.customItemTypeOptions = this.customItemTypeOptions?.map(option => {
      if (this.currentCountryISOCode !== this.countryISOCodeType.PHL && option?.value === CustomItemType.Benefit)
        return undefined;
      return option;
    })?.filter(option => option);
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      payType: new FormControl(null, Validators.required),
      inputType: new FormControl(null),
      amount: new FormControl(null),
      factor: new FormControl(null),
      hoursWorkedFactor: new FormControl(null),
      variedRatePerEmployee: new FormControl(false),
      customRate: new FormControl(null),
      percentage: new FormControl(null),
      baseEarnings: new FormControl(false),
      baseHourlyPay: new FormControl(false),
      shortTime: new FormControl(false),
      sunday: new FormControl(false),
      sundayOvertime: new FormControl(false),
      publicHolidayWorked: new FormControl(false),
      publicHolidayNotWorked: new FormControl(false),
      annualLeavePayExtra: new FormControl(false),
      formula: new FormControl(null),
      taxedAnnually: new FormControl(false),
      includeInFluctuatingLeaveRate: new FormControl(false),
      affectsWageForETIPurposes: new FormControl(false),
      excludeFromAccounting: new FormControl(false),
      bargainingCouncilItem: new FormControl(false),
      overtime: new FormControl(false),
      active: new FormControl(true),
      timeOffItems: new FormArray([]),
      isSocialWelfareBenefit: new FormControl(false),
      overrideTaxablePercentageOption: new FormControl(null),
      taxExemptOptionAmount: new FormControl(null),
      includeInSBCCalculation: new FormControl(false),
      isDeminimis: new FormControl(false),
      addToBaseYTDTotal: new FormControl(false),
      reportAsLostHours: new FormControl(false),
      deductFromTaxableIncome: new FormControl(false),
    });
    this.setOptionCustomInputTypes();
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollSettingsPayTypesSelector)),
      this.store.pipe(select(getPayrollSettingsPayTypeTotalItemsSelector)),
      this.store.pipe(select(getPayrollcalculationSelector)),
      this.store.pipe(select(getLeaveSetupsSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([customPaytypes, payrollPayTypesTotalItems, payrollCalculation, leaveSetups]) => {
        this.customPaytypes = customPaytypes;
        this.payrollPayTypesTotalItems = payrollPayTypesTotalItems;
        this.isBimesterSBCCalculations = payrollCalculation?.additionalSettings != null
          && payrollCalculation?.additionalSettings?.sBCCalculationType === 0
          ? false
          : true;
        this.leaveSetups = leaveSetups;
      })
  }

  public onChangeTypes(): void {

  }

  public onFilter(): void {
    const formValues = this.formFilter.value;
    this.store.dispatch(getPayrollSettingsPayTypesAction({
      payload: Object.assign({}, this.payload, {
        active: formValues?.active,
        searchText: formValues?.searchText || '',
        customItemType: formValues?.customItemType
      })
    }))
  }

  public onAdd(): void {
    this.selectedCustomPayTypes = undefined;
    this.dialogTitle = DialogStateType[DialogStateType.Add];
    this.showModal = true;
  }

  public onSave(): void {
    const payload = this.form.value;
    for (let index = 0; index < this.form.value?.timeOffItems?.length; index++) {
      const timeOffItemControls = this.form.value?.timeOffItems[index];
      if (timeOffItemControls?.selected && timeOffItemControls?.timeOffSettingId)
        payload.selectedLeaveSetupIds.push(timeOffItemControls?.timeOffSettingId);
    }
    this.validateForm(payload);
    if (this.form.valid) {
      this.store.dispatch(saveCustomItemAction({ payload }));
      setTimeout(() => this.showModal = false, 350);
    }
  }

  public onReset(): void {
    this.formFilter.reset();
    this.onFilter();
  }

  public onPaginatePayTypes(event: any): void {
    const formValues = this.formFilter.value;
    this.store.dispatch(getPayrollSettingsPayTypesAction({
      payload: Object.assign({}, this.payload, {
        active: formValues?.active,
        searchText: formValues?.searchText,
        pageNumber: event?.page + 1,
        pagesize: event?.rows,
        payFrequencyType: formValues?.payFrequencyType
      })
    }))
  }

  public onEdit(id: number): void {
    if (id) {
      this.dialogTitle = DialogStateType[DialogStateType.Edit];
      this.store.pipe(select(getPayrollSettingsPayTypesByIdSelector(id)))
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe((payTypesType) => {
          this.selectedPayTypesType = payTypesType;
          if (this.selectedPayTypesType) {
            this.form.patchValue(Object.assign({}, this.selectedPayTypesType, {
              payType: this.selectedPayTypesType?.type //note: mismatching fields from the api
            }))
            this.showModal = true;
            for (let i = 0; i < this.leaveSetups.length; i++) {
              const timeOffSetting = this.leaveSetups[i];
              const selected = this.selectedPayTypesType?.leaveSetups
                ?.filter(leave => leave?.id === timeOffSetting?.id).length > 0;
              const timeOffSettingGroup = new FormGroup({
                leaveSetupid: new FormControl(timeOffSetting.id),
                name: new FormControl(timeOffSetting.name),
                selected: new FormControl(selected),
              });
              if (timeOffSettingGroup?.get('leaveSetupid').value)
                (this.form.get('timeOffItems') as FormArray).push(timeOffSettingGroup);
            }
          }
        });
    }
  }
  //note: not sure why these are reworded -_-
  public setOptionCustomInputTypes(): void {
    if (this.form.get('payType').value !== CustomItemType.Reimbursement)
      this.inputTypeOptions.push({ label: this.translateService.instant('SetAmount'), value: 1 });
    if (this.form.get('payType').value !== CustomItemType.Reimbursement)
      this.inputTypeOptions.push({ label: this.translateService.instant('AmountPerEmployee'), value: 2 });
    this.inputTypeOptions.push({ label: this.translateService.instant('VariesEachTime'), value: 3 });
    this.inputTypeOptions.push({ label: this.translateService.instant('OnceOffForSpecifiedPayslips'), value: 4 });
    if (this.form.get('payType').value !== CustomItemType.Reimbursement)
      this.inputTypeOptions.push({ label: this.translateService.instant('HourlyRateHoursWorkedFactor'), value: 5 });
    this.inputTypeOptions.push({ label: this.translateService.instant('CustomRateQuantity'), value: 6 });
    if (this.form.get('payType').value === CustomItemType.Deduction
      || this.form.get('payType').value === CustomItemType.Benefit
      || this.form.get('payType').value === CustomItemType.EmployerContribution)
      this.inputTypeOptions.push({ label: this.translateService.instant('CustomRateQuantity'), value: 7 });
    if ((this.form.get('payType').value === CustomItemType.Deduction
      || this.form.get('payType').value === CustomItemType.Benefit
      || this.form.get('payType').value === CustomItemType.EmployerContribution))
      this.inputTypeOptions.push({ label: this.translateService.instant('Formula'), value: 8 });
    if (this.form.get('payType').value !== InputType.CustomRateQuantity)
      this.inputTypeOptions.push({ label: this.translateService.instant('MonthlyForNonMonthlyEmployees'), value: 9 });
    if (this.form.get('payType').value !== CustomItemType.Income
      && this.currentCountryISOCode == this.countryISOCodeType.MEX)
      this.inputTypeOptions.push({ label: this.translateService.instant('PercentageOfGross'), value: 10 });
    this.taxExemptionOptions.push({ label: this.translateService.instant('Percentage'), value: 1 });
    if (this.currentCountryISOCode === this.countryISOCodeType.MEX)
      this.taxExemptionOptions.push({ label: this.translateService.instant('UMA'), value: 2 });
  }
  //note: we need to validate this actually work -_-
  public validateForm(payType: ICustomPaytype): void {
    if (payType?.name === null || payType?.name === '')
      this.form.controls['inputType'].setErrors({ required: true });
    else if (payType?.name.length > 60)
      this.form.controls['name'].setErrors({ nameLengthLimitReached: true });
    else
      this.form.controls['name'].setErrors(null);
    if (payType?.inputType === null)
      this.form.controls['inputType'].setErrors({ inputTypeIsRequired: true });
    else
      this.form.controls['inputType'].setErrors(null);
    if (payType?.customItemType === CustomItemType.Income || payType?.customItemType === CustomItemType.Allowance) { //note: this field/property doesnt exist in the response -_-
      if ((payType?.inputType === InputType.FixedAmount || payType?.inputType === InputType.MonthlyForNonMonthlyEmployees || payType?.inputType == InputType.PercentageOfGross)
        && payType?.amount === null)
        this.form.controls['amount'].setErrors({ amountIsRequired: true });
      else
        this.form.controls['amount'].setErrors(null);
      if (payType?.inputType === InputType.HourlyRateFactorHours && payType?.rateFactor == null)
        this.form.controls['factor'].setErrors({ rateFactorIsRequired: true });
      else
        this.form.controls['factor'].setErrors(null);
      if (payType?.inputType === InputType.HourlyRateFactorHours && payType?.hoursWorkedFactor === null)
        this.form.controls['hoursWorkedFactor'].setErrors({ hoursWorkedFactorIsRequired: true });
      else
        this.form.controls['hoursWorkedFactor'].setErrors(null);
      if (payType?.inputType === InputType.CustomRateQuantity && !payType?.differentRateForEachEmployee && payType?.customRate == null)
        this.form.controls['customRate'].setErrors({ customRateIsRequired: true });
      else
        this.form.controls['customRate'].setErrors(null);
    }
    else if (payType?.customItemType === CustomItemType.Deduction || payType?.customItemType === CustomItemType.Benefit || payType?.customItemType === CustomItemType.EmployerContribution) {
      if ((payType?.inputType === InputType.FixedAmount || payType?.inputType === InputType.MonthlyForNonMonthlyEmployees) && payType?.amount === null)
        this.form.controls['amount'].setErrors({ amountIsRequired: true });
      else
        this.form.controls['amount'].setErrors(null);
      if (payType?.inputType === InputType.HourlyRateFactorHours && payType?.rateFactor === null)
        this.form.controls['factor'].setErrors({ rateFactorIsRequired: true });
      else
        this.form.controls['factor'].setErrors(null);
      if (payType?.inputType === InputType.CustomRateQuantity && !payType?.differentRateForEachEmployee && payType?.customRate === null)
        this.form.controls['customRate'].setErrors({ customRateIsRequired: true });
      else
        this.form.controls['customRate'].setErrors(null);
      if (payType?.inputType === InputType.PercentageOfIncome && payType?.percentage === null)
        this.form.controls['percentage'].setErrors({ percentageIsRequired: true });
      else
        this.form.controls['percentage'].setErrors(null);
      if (payType?.inputType === InputType.Formula && (payType?.formula === null || !payType?.formula))
        this.form.controls['formula'].setErrors({ formulaIsRequired: true });
      else
        this.form.controls['formula'].setErrors(null);
    }
    else if (payType?.customItemType === CustomItemType.Reimbursement) {
      if (payType?.inputType === InputType.CustomRateQuantity && !payType?.differentRateForEachEmployee && payType?.customRate === null)
        this.form.controls['customRate'].setErrors({ customRateIsRequired: true });
      else
        this.form.controls['customRate'].setErrors(null);
    }
    if (payType?.overrideTaxablePercentageOption !== null
      && (payType?.overrideTaxablePercentageOption === 1
        || payType?.overrideTaxablePercentageOption === 2)
      && (payType?.taxExemptOptionAmount === null
        || payType?.taxExemptOptionAmount === undefined)) {
      this.form.controls['taxExemptOptionAmount'].setErrors({ taxExemptOptionAmountIsRequired: true });
    }
    else if (payType?.overrideTaxablePercentageOption !== null
      && payType?.overrideTaxablePercentageOption === 1
      && (payType?.taxExemptOptionAmount < 0
        || payType?.taxExemptOptionAmount > 100))
      this.form.controls['taxExemptOptionAmount'].setErrors({ taxExemptOptionAmountOutOfRange: true });
    else
      this.form.controls['taxExemptOptionAmount'].setErrors(null);
  }
}