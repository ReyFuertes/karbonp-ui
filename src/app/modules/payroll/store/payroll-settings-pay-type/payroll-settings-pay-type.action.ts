import { createAction, props } from "@ngrx/store";
import { ICustomItem, ICustomPaytype, IPayPeriodTypesPayload } from "../../payroll.model";
import { ICommonResponse } from "src/app/models/generic.model";


export enum PayrollSettingsPayTypeTypes {
  getPayrollSettingsPayTypesAction = '[Payroll settings pay types] get payroll settings pay types',
  getPayrollSettingsPayTypesSuccessAction = '[Payroll settings pay types] get payroll settings pay types (success)',
  saveCustomItemAction = '[Payroll settings pay types] save custom item',
  saveCustomItemSuccessAction = '[Payroll settings pay types] save custom item (success)',
}
export const saveCustomItemAction = createAction(
  PayrollSettingsPayTypeTypes.saveCustomItemAction,
  props<{ payload: ICustomItem }>()
);
export const saveCustomItemSuccessAction = createAction(
  PayrollSettingsPayTypeTypes.saveCustomItemSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayrollSettingsPayTypesAction = createAction(
  PayrollSettingsPayTypeTypes.getPayrollSettingsPayTypesAction,
  props<{ payload: IPayPeriodTypesPayload }>()
);
export const getPayrollSettingsPayTypesSuccessAction = createAction(
  PayrollSettingsPayTypeTypes.getPayrollSettingsPayTypesSuccessAction,
  props<{ response: { items: ICustomPaytype[], totalItems: number } }>()
);