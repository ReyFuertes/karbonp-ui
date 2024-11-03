import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { CommonService } from "src/app/services/common.service";
import { getpaymentDetailAction, getpaymentDetailSuccessAction } from "./payroll-payment.action";
import { ICommonResponse } from "src/app/models/generic.model";

@Injectable()
export class PayrollPaymentEffect extends GenericEffect {
  getpaymentDetailAction$ = createEffect(() => this.actions$.pipe(
    ofType(getpaymentDetailAction),
    switchMap(({ payRunPaymentId }) => this.commonService.get(`PayRunPayment/GetPaymentDetails/${payRunPaymentId}`)
      .pipe(
        map((response: ICommonResponse) => getpaymentDetailSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private commonService: CommonService) {
    super(injector);
  }
}