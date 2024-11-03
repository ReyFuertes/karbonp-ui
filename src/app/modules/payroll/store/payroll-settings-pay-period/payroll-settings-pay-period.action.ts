import { createAction, props } from "@ngrx/store";

import { ICommonResponse, IPayPeriod } from "src/app/models/generic.model";
import { IPayPeriodDateRange, IPayPeriodTypesPayload, IPayrunPayPeriodCalculateRange } from "../../payroll.model";

export enum PayrollSettingsPayPeriodTypes {
  getPayrollSettingsPayPeriodsAction = '[Payroll settings pay periods] get payroll settings pay periods',
  getPayrollSettingsPayPeriodsSuccessAction = '[Payroll settings pay periods] get payroll settings pay periods (success)',
  calculateDateRangesAction = '[Payroll settings pay periods] calculate date ranges',
  calculateDateRangesSuccessAction = '[Payroll settings pay periods] calculate date ranges (success)',
  savePayPeriodAction = '[Payroll settings pay periods] save pay period',
  savePayPeriodSuccessAction = '[Payroll settings pay periods] save pay period (success)',
  
}
export const savePayPeriodAction = createAction(
  PayrollSettingsPayPeriodTypes.savePayPeriodAction,
  props<{ payload: IPayrunPayPeriodCalculateRange }>()
);
export const savePayPeriodSuccessAction = createAction(
  PayrollSettingsPayPeriodTypes.savePayPeriodSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const calculateDateRangesAction = createAction(
  PayrollSettingsPayPeriodTypes.calculateDateRangesAction,
  props<{ payload: IPayrunPayPeriodCalculateRange }>()
);
export const calculateDateRangesSuccessAction = createAction(
  PayrollSettingsPayPeriodTypes.calculateDateRangesSuccessAction,
  props<{ response: IPayPeriodDateRange[] }>()
);
export const getPayrollSettingsPayPeriodsAction = createAction(
  PayrollSettingsPayPeriodTypes.getPayrollSettingsPayPeriodsAction,
  props<{ payload: IPayPeriodTypesPayload }>()
);
export const getPayrollSettingsPayPeriodsSuccessAction = createAction(
  PayrollSettingsPayPeriodTypes.getPayrollSettingsPayPeriodsSuccessAction,
  props<{ response: { items: IPayPeriod[], totalItems: number } }>()
);