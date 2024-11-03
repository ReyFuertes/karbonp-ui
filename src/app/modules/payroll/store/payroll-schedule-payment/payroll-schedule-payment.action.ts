import { createAction, props } from "@ngrx/store";

import { ICommonResponse } from "src/app/models/generic.model";

export enum PayrollSchedulePaymentTypes {
  getSchedulePaymentSetupDataAction = '[Payroll SchedulePayment] get schedule payment setup data',
  getSchedulePaymentSetupDataSuccessAction = '[Payroll SchedulePayment] get schedule payment setup data (success)',
  saveSchedulePaymentAction = '[Payroll SchedulePayment] save schedule payment',
  saveSchedulePaymentSuccessAction = '[Payroll SchedulePayment] save schedule payment (success)',
}
export const saveSchedulePaymentAction = createAction(
  PayrollSchedulePaymentTypes.saveSchedulePaymentAction,
  props<{
    payload: {
      payRunId: number, paymentDate: string, paymentTotal: number,
      reference: string, bank: string, paymentMethod: string,
      schedulePayment: boolean, sendNow: boolean, employeePayments: {
        employeeId: number,
        payslipId: number,
        amount: number
      }[]
    }
  }>()
);
export const saveSchedulePaymentSuccessAction = createAction(
  PayrollSchedulePaymentTypes.saveSchedulePaymentSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getSchedulePaymentSetupDataAction = createAction(
  PayrollSchedulePaymentTypes.getSchedulePaymentSetupDataAction,
  props<{ payRunId: number }>()
);
export const getSchedulePaymentSetupDataSuccessAction = createAction(
  PayrollSchedulePaymentTypes.getSchedulePaymentSetupDataSuccessAction,
  props<{ response: ICommonResponse }>()
);