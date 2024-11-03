import { createAction, props } from "@ngrx/store";

import { ICommonResponse } from "src/app/models/generic.model";

export enum PayrollPaymentTypes {
  getpaymentDetailAction = '[Payroll payment detail] get payment detail',
  getpaymentDetailSuccessAction = '[Payroll payment detail] get payment detail (success)',
}
export const getpaymentDetailAction = createAction(
  PayrollPaymentTypes.getpaymentDetailAction,
  props<{ payRunPaymentId: number }>()
);
export const getpaymentDetailSuccessAction = createAction(
  PayrollPaymentTypes.getpaymentDetailSuccessAction,
  props<{ response: ICommonResponse }>()
);