import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { combineLatest, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getSchedulePaymentSetupDataSelector, isSchedulePaymenthasErrorSelector } from '../../store/payroll-schedule-payment/payroll-schedule-payment.selector';
import { IBankingDetail, IDirectPayment, IPaymentAuthorizer, IPaymentTransactionFee, IPayRunPaymentEmployee } from '../../payroll.model';
import { getSchedulePaymentSetupDataAction, saveSchedulePaymentAction } from '../../store/payroll-schedule-payment/payroll-schedule-payment.action';
import { BANKING_DETAIL_LIST, CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';
import { environment } from 'src/environments/environment';
import { GetTypes } from 'src/app/shared/util/types.util';
import { BankingType } from '../../payroll.enum';


@Component({
  selector: 'kp-payroll-payruns-schedule-payment',
  templateUrl: './payroll-payruns-schedule-payment.component.html',
  styleUrls: ['./payroll-payruns-schedule-payment.component.scss']
})
export class PayrollPayrunsSchedulePaymentComponent extends GenericPage implements OnInit {
  public payRunId: number;
  public imagePath: string = environment.imgPath;
  public activeIndex: number = 0;
  public steps: MenuItem[] = [
    { label: this.translateService.instant('Employees') },
    { label: this.translateService.instant('PaymentDetails') },
    { label: this.translateService.instant('BankDetails') },
    { label: this.translateService.instant('Confirmation') }];
  public stepCount: number = this.steps?.length - 1;
  public transactionFee: IPaymentTransactionFee;
  public payRunPaymentEmployees: IPayRunPaymentEmployee[];
  public payRunPaymentEmployeesExcluded: IPayRunPaymentEmployee[];
  public directPayment: IDirectPayment;
  public paymentAuthorizers: IPaymentAuthorizer[];
  public disabledDates: string[];
  public checkAllEmployees: any;
  public bankingTypes = GetTypes(BankingType, 0);
  public bankingDetailTypes = new Map<string, IBankingDetail>();
  public bankingDetailList = BANKING_DETAIL_LIST;
  public paymentMethods: string[] = ['OnlineBanking', 'TelephoneBanking', 'BankAtLocalBranch'];
  public submitted: boolean = false;

  constructor(injector: Injector, private route: ActivatedRoute) {
    super(injector);
    this.route.paramMap
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(params => {
        this.payRunId = Number(params?.get('payRunId'));
        if (this.payRunId)
          this.store.dispatch(getSchedulePaymentSetupDataAction({ payRunId: this.payRunId }));
      })
    this.form = new FormGroup({
      selectedBank: new FormControl(undefined),
      paymentMethod: new FormControl(undefined),
      sendNow: new FormControl(false),
      payByDate: new FormControl(this.setDateTomorrow, Validators.required),
      reference: new FormControl(null, [Validators.required, Validators.pattern(/[\S]/g)]),
      absaOnlineBanking: new FormControl(false),
      absaTelephoneBanking: new FormControl(false),
      absaBankAtLocalBranch: new FormControl(false),
      fnbOnlineBanking: new FormControl(false),
      fnbTelephoneBanking: new FormControl(false),
      fnbBankAtLocalBranch: new FormControl(false),
      nedbankOnlineBanking: new FormControl(false),
      nedbankTelephoneBanking: new FormControl(false),
      nedbankBankAtLocalBranch: new FormControl(false),
      standardBankOnlineBanking: new FormControl(false),
      standardBankTelephoneBanking: new FormControl(false),
      standardBankBankAtLocalBranch: new FormControl(false),
    });
    BANKING_DETAIL_LIST.forEach(detail => {
      this.bankingDetailTypes.set(detail.name, detail);
    });
  }
  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSchedulePaymentSetupDataSelector)),
      this.store.pipe(select(isSchedulePaymenthasErrorSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([schedulePaymentSetupData, hasError]) => {
        this.transactionFee = schedulePaymentSetupData?.paymentTransactionFee;
        this.payRunPaymentEmployees = schedulePaymentSetupData?.payRunPaymentEmployees
          ?.filter(employee => !employee?.excluded);
        this.checkAllEmployees = this.payRunPaymentEmployees
          ?.some(employee => employee?.payEmployee === true);
        this.payRunPaymentEmployeesExcluded = schedulePaymentSetupData?.payRunPaymentEmployees
          ?.filter(employee => employee?.excluded);
        this.directPayment = schedulePaymentSetupData?.directPayment;
        this.paymentAuthorizers = schedulePaymentSetupData?.paymentAuthorizers;
        this.disabledDates = schedulePaymentSetupData?.publicHolidays?.map(ph => moment(ph?.date).format('DD/MM/YYYY'));
        if (hasError === false && this.submitted === true)
          this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, '/payroll/payruns');
      })
  }

  public onConfirm(): void {
    this.submitted = true;
    const hasPaymentAuthorizer = this.paymentAuthorizers.some(p => p.userId === Number(this.userId));
    let authorized: boolean = false;
    if (hasPaymentAuthorizer) {
      this.confirmationService.confirm({
        message: this.translateService.instant('DoYouWantToAuthorizeThePayment'),
        accept: () => authorized = true,
        reject: () => authorized = false
      });
    }
    else
      authorized = false
    const payload = {
      payRunId: this.payRunId,
      paymentDate: this.form.get('payByDate').value,
      paymentTotal: this.getTotalPayAmount,
      reference: this.form.get('reference').value,
      bank: this.form.get('selectedBank').value?.name,
      paymentMethod: this.form.get('paymentMethod').value,
      schedulePayment: authorized,
      sendNow: this.form.get('sendNow').value,
      employeePayments: this.payRunPaymentEmployees
        ?.filter(payrun => payrun?.payEmployee).map(function (employee) {
          return {
            employeeId: employee.employeeId,
            payslipId: employee.payslipId,
            amount: employee.netPay
          };
        })
    }
    if (this.payRunId)
      this.store.dispatch(saveSchedulePaymentAction({ payload }));
  }

  public onChangeBanking(bankingType: IBankingDetail, index: number): void {
    this.bankingTypes.forEach(type => {
      this.form.get(type.value).patchValue(type.value === bankingType.toggles[index]);
    });
    this.form.get('selectedBank').patchValue(bankingType);
    this.form.get('paymentMethod').patchValue(this.paymentMethods[index]);
  }

  public get isDisabled(): boolean {
    if (this.activeIndex === 0) {
      return this.payRunPaymentEmployees
        ?.filter(employee => employee.payEmployee === true)?.length === 0;
    }
    else if (this.activeIndex === 2) {
      return !this.form.get('selectedBank').value;
    }
    else if (this.activeIndex === 3) {
      return !this.form.get('selectedBank').value
        || this.payRunPaymentEmployees?.filter(employee => employee.payEmployee === true)?.length === 0;
    }
    return false;
  }

  public payEmployeeChange(): void {
    const selectedEmployees = this.payRunPaymentEmployees
      ?.filter(employee => employee.payEmployee === true);
    this.checkAllEmployees = selectedEmployees?.length === this.payRunPaymentEmployees?.length;
  }

  public onCheckAll(event: any): void {
    this.payRunPaymentEmployees?.forEach(employee => {
      employee.payEmployee = event?.checked;
    });
  }

  public get setDateTomorrow(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }

  public get getTotalPayAmount(): number {
    if (this.payRunPaymentEmployees?.length === 0)
      return 0;
    let total = this.payRunPaymentEmployees
      ?.filter(p => p.payEmployee)
      ?.reduce((sum, current) => sum + current.netPay, 0);
    if (this.transactionFee != null)
      total += this.getTotalTransactionFees;
    return total;
  }

  public get getSelectedEmployees(): boolean {
    return this.payRunPaymentEmployees?.some(employee => employee?.payEmployee);
  }

  public get getTotalEmployeesToPay(): number {
    return this.payRunPaymentEmployees?.filter(employee => employee?.payEmployee)?.length;
  }

  public get getTotalTransactionFees(): number {
    if (!this.payRunPaymentEmployees || !this.transactionFee)
      return 0;
    const isRTC = this.form.get('sendNow')?.value;
    const relevantFee = isRTC ? this.transactionFee?.rtcFee : this.transactionFee?.fee;
    const employeeCount = this.payRunPaymentEmployees?.filter(p => p.payEmployee)?.length || 0;
    return employeeCount * relevantFee;
  }

  public onBackPrevious(): void {
    if (this.activeIndex === 0)
      this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, '/payroll/payruns');
    else
      this.activeIndex = this.activeIndex - 1;
  }

  public onNext(): void {
    if (this.stepCount === this.activeIndex)
      this.activeIndex = this.stepCount;
    else
      this.activeIndex = this.activeIndex + 1;
    this.validatePage();
  }

  public sendNowUpdated(event: any): void {
    const date = event?.checked
      ? new Date()
      : this.setDateTomorrow;
    this.form.get('payByDate').patchValue(date);
  }

  public get isSelectedDateTomorrow(): boolean {
    const tomorrow = moment().add(1, 'days');
    return moment(this.form.get("payByDate").value).isSame(tomorrow, 'day');
  }

  public get isSelectedDateSaturday(): boolean {
    const selectedDate = moment(this.form.get('payByDate').value);
    if (selectedDate.isoWeekday() === 6)
      return true;
    return false;
  }

  public get isSelectedDateMonday(): boolean {
    const selectedDate = moment(this.form.get('payByDate').value);
    if (selectedDate.isoWeekday() === 1)
      return true;
    return false;
  }

  public get selectedDateComesAfterPublicHoliday(): boolean {
    const selectedDate = moment(this.form.controls['payByDate'].value);
    if (this.disabledDates?.find(d => moment(d).add(1, 'days').isSame(selectedDate, 'day') === true))
      return true;
    return false;
  }

  public onActiveIndexChange(event: number): void {
    this.activeIndex = event;
  }

  private validatePage(): void {
    if (this.activeIndex === 2) {
      if (this.form.get('sendNow').value) {
        this.form.get('payByDate').setErrors({ dateInPast: false });
        return;
      }
      const selectedDate = moment(this.form.get('payByDate').value);
      const tomorrow = moment().add(1, 'days');
      if (selectedDate.isBefore(tomorrow, 'date'))
        this.form.get('payByDate').setErrors({ dateInPast: true });
      else if (this.disabledDates.find(date => moment(date).isSame(selectedDate, 'day') === true))
        this.form.get('payByDate').setErrors({ dateOnPublicHoliday: true });
      else if (selectedDate.isoWeekday() === 7)
        this.form.get('payByDate').setErrors({ dateOnSunday: true });
      if (!this.form.get('payByDate')?.hasError('required')
        && !this.form.get('payByDate')?.hasError('dateInPast')
        && !this.form.get('payByDate')?.hasError('dateOnPublicHoliday')
        && !this.form.get('payByDate')?.hasError('dateAfterPublicHoliday')
        && !this.form.get('payByDate')?.hasError('dateOnSunday')
        && !this.form.get('payByDate')?.hasError('dateOnMonday')) {
        this.form.get('payByDate')?.setErrors(null);
      }
    }
  }

}
