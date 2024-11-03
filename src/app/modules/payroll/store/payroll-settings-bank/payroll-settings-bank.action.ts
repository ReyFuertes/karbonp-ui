import { createAction, props } from "@ngrx/store";
import { IBankSetup, IBankType } from "../../payroll.model";
import { ICommonResponse } from "src/app/models/generic.model";


export enum PayrollSettingsBankTypes {
  getPayrollSettingsBanksAction = '[Payroll settings banks] get payroll settings banks',
  getPayrollSettingsBanksSuccessAction = '[Payroll settings banks] get payroll settings banks (success)',
  getPayrollSettingsBankTypesAction = '[Payroll settings banks] get payroll settings bank types',
  getPayrollSettingsBankTypesSuccessAction = '[Payroll settings banks] get payroll settings bank types (success)',
  savePayrollSettingsBankAction = '[Payroll settings banks] save payroll settings bank',
  savePayrollSettingsBankSuccessAction = '[Payroll settings banks] save payroll settings bank (success)',
}
export const savePayrollSettingsBankAction = createAction(
  PayrollSettingsBankTypes.savePayrollSettingsBankAction,
  props<{
    payload: {
      accountNumber: string,
      accountTypeId: string,
      active: number;
      bankId: string,
      branchCode: string,
      id: number;
      type: number;
    }
  }>()
);
export const savePayrollSettingsBankSuccessAction = createAction(
  PayrollSettingsBankTypes.savePayrollSettingsBankSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayrollSettingsBankTypesAction = createAction(
  PayrollSettingsBankTypes.getPayrollSettingsBankTypesAction,
  props<{ payload: { active: boolean, implementSortingAndPaging: boolean } }>()
);
export const getPayrollSettingsBankTypesSuccessAction = createAction(
  PayrollSettingsBankTypes.getPayrollSettingsBankTypesSuccessAction,
  props<{ response: IBankType[] }>()
);
export const getPayrollSettingsBanksAction = createAction(
  PayrollSettingsBankTypes.getPayrollSettingsBanksAction,
  props<{ payload: { active: boolean, implementSortingAndPaging: boolean } }>()
);
export const getPayrollSettingsBanksSuccessAction = createAction(
  PayrollSettingsBankTypes.getPayrollSettingsBanksSuccessAction,
  props<{ response: IBankSetup[] }>()
);