import { createAction, props } from "@ngrx/store";
import { ICommonResponse } from "src/app/models/generic.model";
import { IPayrollCalculation } from "../../payroll.model";


export enum PayrollSettingsCalculationsTypes {
  savePayrollSettingsCalculationsAction = '[Payroll settings calculations] save payroll settings calculations',
  savePayrollSettingsCalculationsSuccessAction = '[Payroll settings calculations] save payroll settings calculations (success)',
  getPayrollSettingsCalculationsAction = '[Payroll settings calculations] get payroll settings calculations',
  getPayrollSettingsCalculationsSuccessAction = '[Payroll settings calculations] get payroll settings calculations (success)',
}
export const getPayrollSettingsCalculationsAction = createAction(
  PayrollSettingsCalculationsTypes.getPayrollSettingsCalculationsAction
);
export const getPayrollSettingsCalculationsSuccessAction = createAction(
  PayrollSettingsCalculationsTypes.getPayrollSettingsCalculationsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const savePayrollSettingsCalculationsAction = createAction(
  PayrollSettingsCalculationsTypes.savePayrollSettingsCalculationsAction,
  props<{ payload: IPayrollCalculation }>()
);
export const savePayrollSettingsCalculationsSuccessAction = createAction(
  PayrollSettingsCalculationsTypes.savePayrollSettingsCalculationsSuccessAction,
  props<{ response: ICommonResponse }>()
);