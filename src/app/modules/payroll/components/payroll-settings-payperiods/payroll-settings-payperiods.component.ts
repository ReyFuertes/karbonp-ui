import { Component, Injector, OnInit } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayPeriodDateRangeSelector, getPayrollSettingsPayPeriodByIdSelector, getPayrollSettingsPayPeriodsSelector, getPayrollSettingsPayPeriodTotalItemsSelector } from '../../store/payroll-settings-pay-period/payroll-settings-pay-period.selector';
import { IOptionItem, IPayPeriod } from 'src/app/models/generic.model';
import { ContributionBase, DialogStateType, PayFrequencyType } from 'src/app/models/generic.enum';
import { calculateDateRangesAction, getPayrollSettingsPayPeriodsAction, savePayPeriodAction } from '../../store/payroll-settings-pay-period/payroll-settings-pay-period.action';
import { GetTypes } from 'src/app/shared/util/types.util';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PayrollCalculationDaysSettingType } from '../../payroll.enum';
import { IPayPeriodDateRange, IPayPeriodTypesPayload } from '../../payroll.model';
import * as moment from 'moment';
import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';

@Component({
  selector: 'kp-payroll-settings-payperiods',
  templateUrl: './payroll-settings-payperiods.component.html',
  styleUrls: ['./payroll-settings-payperiods.component.scss']
})
export class PayrollSettingsPayperiodsComponent extends GenericPage implements OnInit {
  public formFilter: FormGroup;
  public columns: string[] = ['Name', 'Pay Type', 'Active'];
  public PAGINATION_VARS = PAGINATION_VARS;
  public payrollPayPeriodsTotalItems: number;
  public payPeriods: IPayPeriod[];
  public payFrequencyType = PayFrequencyType;
  public selectedPayFrequencyType: number;
  public statusOptions: IOptionItem[] = [];
  public payFrequencyTypeOptions = GetTypes(PayFrequencyType);
  public dialogTitle: string;
  public selectedPayPeriod: IPayPeriod;
  public payrollCalculationDaysSettingOptions = GetTypes(PayrollCalculationDaysSettingType);
  public contributionBaseOptions: IOptionItem[] = [{
    label: ContributionBase[ContributionBase.Basic],
    value: ContributionBase.Basic
  }, {
    label: PayFrequencyType[ContributionBase.Gross],
    value: ContributionBase.Gross
  }];
  public payPeriodDateRanges: IPayPeriodDateRange[];
  private payload: IPayPeriodTypesPayload = {
    active: null,
    pageNumber: PAGINATION_VARS.pageNumber,
    pagesize: PAGINATION_VARS.pagesize,
    payFrequencyType: null,
    sortAscending: true,
    sortBy: "PayFrequencyType"
  }

  constructor(injector: Injector) {
    super(injector);
    this.formFilter = this.fb.group({
      active: new FormControl(undefined),
      payPeriodType: new FormControl(undefined),
      payFrequencyType: new FormControl(undefined),
    });
    this.form = this.fb.group({
      active: new FormControl(true),
      payPeriodType: new FormControl(undefined),
      name: new FormControl(null),
      payFrequencyType: new FormControl(null, Validators.required),
      firstPayPeriodEndDate: new FormControl(new Date(), Validators.required),
      payOnLastDayOfMonth: new FormControl(true),
      secondPayOnLastDayOfMonth: new FormControl(true),
      lastDayOfMonth: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(31)]),
      interimDayOfMonth: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(31)]),
      twiceMonthlyStartingOnSecondPayDate: new FormControl(false),
      payrollCalculationDaysSetting: new FormControl(null, Validators.required),
      sssContributionBase: new FormControl(ContributionBase.Gross),
      sssFirstWeek: new FormControl(false),
      sssSecondWeek: new FormControl(false),
      sssThirdWeek: new FormControl(false),
      sssFourthWeek: new FormControl(false),
      sssFirstPeriod: new FormControl(false),
      sssSecondPeriod: new FormControl(false),
      sssLastPeriod: new FormControl(false),
      phicContributionBase: new FormControl(ContributionBase.Gross),
      phicFirstWeek: new FormControl(false),
      phicSecondWeek: new FormControl(false),
      phicThirdWeek: new FormControl(false),
      phicFourthWeek: new FormControl(false),
      phicFirstPeriod: new FormControl(false),
      phicSecondPeriod: new FormControl(false),
      phicLastPeriod: new FormControl(false),
      hdmfContributionBase: new FormControl(ContributionBase.Gross),
      hdmfFirstWeek: new FormControl(false),
      hdmfSecondWeek: new FormControl(false),
      hdmfThirdWeek: new FormControl(false),
      hdmfFourthWeek: new FormControl(false),
      hdmfFirstPeriod: new FormControl(false),
      hdmfSecondPeriod: new FormControl(false),
      hdmfLastPeriod: new FormControl(false),
      sssEvenSplitOnDeduction: new FormControl(false),
      phicEvenSplitOnDeduction: new FormControl(false),
      hdmfEvenSplitOnDeduction: new FormControl(false),
      autoMergeCompletedPayRuns: this.currentCountryISOCode === this.countryISOCodeType.PHL
        ? new FormControl(true)
        : new FormControl(false),
    });
    this.statusOptions = [{
      label: this.translateService.instant('ActiveOnly'),
      value: true
    }, {
      label: this.translateService.instant('InactiveOnly'),
      value: false
    }];
    this.form.get('lastDayOfMonth').valueChanges
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(value => this.calculateDateRanges(value))
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollSettingsPayPeriodsSelector)),
      this.store.pipe(select(getPayrollSettingsPayPeriodTotalItemsSelector)),
      this.store.pipe(select(getPayPeriodDateRangeSelector)),
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([payPeriods, payrollPayPeriodsTotalItems, payPeriodDateRanges]) => {
        this.payPeriods = payPeriods;
        this.payrollPayPeriodsTotalItems = payrollPayPeriodsTotalItems;
        this.payPeriodDateRanges = payPeriodDateRanges;
      })
  }

  public onSave(): void {
    let payFrequencyValid: boolean = true;
    const form = this.form.value;
    //note: i dont understand this payFrequencyValid -_-
    if (form.payFrequencyType === PayFrequencyType.Monthly && form.firstPayPeriodEndDate === null
      || (!form.payOnLastDayOfMonth && (form.lastDayOfMonth === null))
      || form.lastDayOfMonth < 1
      || form.lastDayOfMonth > 31) { //Monthly
      payFrequencyValid = false;
    }
    if (form.payFrequencyType === PayFrequencyType.Weekly && form.firstPayPeriodEndDate === null) //Weekly
      payFrequencyValid = false;
    if (form.payFrequencyType === PayFrequencyType.EveryTwoWeeks && form.firstPayPeriodEndDate === null) //Every two weeks
      payFrequencyValid = false;
    if (form.payFrequencyType === PayFrequencyType.TwiceMonthly
      && (form.interimDayOfMonth === null
        || (!form.secondPayOnLastDayOfMonth
          && (form.lastDayOfMonth < form.interimDayOfMonth || form.lastDayOfMonth == null)))) { //TwiceMonthly
      payFrequencyValid = false;
    }
    if (form.payFrequencyType == 5 && form.firstPayPeriodEndDate == null) //Daily
      payFrequencyValid = false;
    if (form.payFrequencyType == 6 && form.firstPayPeriodEndDate == null) //Ten-Daily
      payFrequencyValid = false;
    if (this.currentCountryISOCode === this.countryISOCodeType.MEX) {
      if (form.payrollCalculationDaysSetting === null) {
        this.form.get('payrollCalculationDaysSetting').setErrors({ required: true });
        payFrequencyValid = false;
      }
      else
        this.form.get('payrollCalculationDaysSetting').setErrors(null);
    }
    else
      this.form.get('payrollCalculationDaysSetting').setErrors(null);
    //note: we need to refactor his structure in the reactive forms binding
    //note: do we need to check form valid? this.form.valid && 
    if (payFrequencyValid === true) {
      const firstPayrollPeriodEndDate = moment(new Date(form.firstPayPeriodEndDate)).format('DD/MM/YYYY') ?? undefined;
      const payload = {
        id: this.selectedPayPeriod?.id ?? 0,
        payFrequencyType: form.payFrequencyType,
        firstPayrollPeriodEndDate: firstPayrollPeriodEndDate,
        payOnLastDayOfMonth: form.payOnLastDayOfMonth,
        secondPayOnLastDayOfMonth: form.secondPayOnLastDayOfMonth,
        lastDayOfMonth: form.lastDayOfMonth,
        interimDayOfMonth: form.interimDayOfMonth,
        active: form.active,
        payrollCalculationDaysSetting: form.payrollCalculationDaysSetting,
        name: form.name,
        twiceMonthlyStartingOnSecondPayDate: form.twiceMonthlyStartingOnSecondPayDate,
        socialSecuritySettings: {
          contributionBase: form.sssContributionBase,
          firstWeek: form.sssFirstWeek,
          secondWeek: form.sssSecondWeek,
          thirdWeek: form.sssThirdWeek,
          fourthWeek: form.sssFourthWeek,
          firstPeriod: form.sssFirstPeriod,
          secondPeriod: form.sssSecondPeriod,
          lastPeriod: form.sssLastPeriod,
          evenSplitOnDeduction: form.sssEvenSplitOnDeduction,
        },
        hdmfSettings: {
          contributionBase: form.hdmfContributionBase,
          firstWeek: form.hdmfFirstWeek,
          secondWeek: form.hdmfSecondWeek,
          thirdWeek: form.hdmfThirdWeek,
          fourthWeek: form.hdmfFourthWeek,
          firstPeriod: form.hdmfFirstPeriod,
          secondPeriod: form.hdmfSecondPeriod,
          lastPeriod: form.hdmfLastPeriod,
          evenSplitOnDeduction: form.hdmfEvenSplitOnDeduction,
        },
        phicSettings: {
          contributionBase: form.phicContributionBase,
          firstWeek: form.phicFirstWeek,
          secondWeek: form.phicSecondWeek,
          thirdWeek: form.phicThirdWeek,
          fourthWeek: form.phicFourthWeek,
          firstPeriod: form.phicFirstPeriod,
          secondPeriod: form.phicSecondPeriod,
          lastPeriod: form.phicLastPeriod,
          evenSplitOnDeduction: form.phicEvenSplitOnDeduction,
        },
        autoMergeCompletedPayRuns: form.autoMergeCompletedPayRuns,
      };
      this.store.dispatch(savePayPeriodAction({ payload }));
    }
  }

  public onChangeFrequencyType(event: any): void {
    if (event?.value !== PayFrequencyType.TwiceMonthly)
      this.calculateDateRanges();
    else
      this.payPeriodDateRanges = [];
  }

  public onAdd(): void {
    this.selectedPayPeriod = undefined;
    this.dialogTitle = DialogStateType[DialogStateType.Add];
    this.showModal = true;
  }

  public onFilter(): void {
    this.store.dispatch(getPayrollSettingsPayPeriodsAction({
      payload: Object.assign({}, this.payload, {
        active: this.formFilter.get('active')?.value,
        payFrequencyType: this.formFilter.get('payFrequencyType')?.value,
      })
    }))
  }

  public onReset(): void {
    this.formFilter.reset();
    this.formFilter.updateValueAndValidity();
    setTimeout(() => this.onFilter(), 1000);
  }

  public onPaginatePayPeriods(event: any): void {
    this.store.dispatch(getPayrollSettingsPayPeriodsAction({
      payload: Object.assign({}, this.payload, {
        active: this.formFilter.get('active')?.value,
        payFrequencyType: this.formFilter.get('payFrequencyType')?.value,
        pageNumber: event?.page + 1,
        pagesize: event?.rows
      })
    }))
  }

  public onEdit(id: number, payFrequencyType: number): void {
    if (id && payFrequencyType) {
      this.selectedPayFrequencyType = payFrequencyType;
      this.dialogTitle = DialogStateType[DialogStateType.Edit];
      this.store.pipe(select(getPayrollSettingsPayPeriodByIdSelector(id)))
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe((payPeriod) => {
          this.selectedPayPeriod = payPeriod;
          if (this.selectedPayPeriod) {
            this.form.patchValue(this.selectedPayPeriod)
            this.showModal = true;
          }
        });
    }
  }

  private calculateDateRanges(lastDayOfMonth?: number): void {
    const form = this.form.value;
    const firstPayrollPeriodEndDate = (form?.firstPayPeriodEndDate !== null)
      ? moment(new Date(form?.firstPayPeriodEndDate)).format('DD/MM/YYYY')
      : null;
    const payload = {
      id: this.selectedPayPeriod?.id ?? 0,
      payFrequencyType: form?.payFrequencyType,
      firstPayrollPeriodEndDate: firstPayrollPeriodEndDate,
      payOnLastDayOfMonth: form?.payOnLastDayOfMonth,
      secondPayOnLastDayOfMonth: form?.secondPayOnLastDayOfMonth,
      lastDayOfMonth: lastDayOfMonth ?? form?.lastDayOfMonth,
      interimDayOfMonth: form?.interimDayOfMonth,
      active: form?.active,
      payrollCalculationDaysSetting: form?.payrollCalculationDaysSetting,
      name: form?.name,
      twiceMonthlyStartingOnSecondPayDate: form?.twiceMonthlyStartingOnSecondPayDate
    };
    this.store.dispatch(calculateDateRangesAction({ payload }));
  }
}
