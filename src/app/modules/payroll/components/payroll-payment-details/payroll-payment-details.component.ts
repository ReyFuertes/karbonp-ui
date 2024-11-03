import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayrollPaymentIsloadingSelector, getPayrollPaymentSelector } from '../../store/payroll-payment/payroll-payment.selector';
import { IPaymentDetail } from '../../payroll.model';
import { ActivatedRoute } from '@angular/router';
import { getpaymentDetailAction } from '../../store/payroll-payment/payroll-payment.action';
import { PaymentStatusType } from '../../payroll.enum';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-payment-details',
  templateUrl: './payroll-payment-details.component.html',
  styleUrls: ['./payroll-payment-details.component.scss']
})
export class PayrollPaymentDetailsComponent extends GenericPage implements OnInit {
  public paymentDetail: IPaymentDetail;
  public paymentTotal: number = 0;
  public paymentStatusType = PaymentStatusType;
  public succeededPaymentsCount: number = 0;
  public totalPaymentsCount: number = 0;

  constructor(injector: Injector, private route: ActivatedRoute) {
    super(injector);
    this.route.paramMap
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(params => {
        const payRunPaymentId = Number(params.get('payRunPaymentId'));
        this.store.dispatch(getpaymentDetailAction({ payRunPaymentId }));
      })

  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollPaymentSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([paymentDetail]) => {
        this.paymentDetail = paymentDetail;
        this.paymentTotal = this.paymentDetail?.employees
          ?.filter(employee => employee?.status !== 3)
          ?.reduce((sum, current) => sum + current?.amount, 0);
        this.totalPaymentsCount = this.paymentDetail?.employees?.length;
        this.succeededPaymentsCount = this.getTotalSuccessfulPayments;
      })
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrollPaymentIsloadingSelector));

  public get getTotalSuccessfulPayments(): number {
    let successCount = 0;
    for (let index = 0; index < this.paymentDetail?.employees.length; index++) {
      if (this.paymentDetail?.employees[index].status === PaymentStatusType.Completed) {
        successCount += 1;
      }
    }
    return successCount;
  }

  public onBack(): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, '/payroll/payruns');
  }
}
