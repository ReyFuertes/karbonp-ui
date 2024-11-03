import { createAction, props } from "@ngrx/store";
import { IPayslipSetup } from "../../payroll.model";


export enum PayrollSettingsPayslipTypes {
  getPayrollSettingsPayslipsAction = '[Payroll settings pay slip] get payroll settings pay slip',
  getPayrollSettingsPayslipsSuccessAction = '[Payroll settings pay slip] get payroll settings pay slip (success)',
  savePayrollSettingsPayslipsAction = '[Payroll settings pay slip] save payroll settings pay slip',
  savePayrollSettingsPayslipsSuccessAction = '[Payroll settings pay slip] save payroll settings pay slip (success)',
  
}
export const savePayrollSettingsPayslipsAction = createAction(
  PayrollSettingsPayslipTypes.savePayrollSettingsPayslipsAction,
  props<{ payload: IPayslipSetup }>()
);
export const savePayrollSettingsPayslipsSuccessAction = createAction(
  PayrollSettingsPayslipTypes.savePayrollSettingsPayslipsSuccessAction,
  props<{ response: IPayslipSetup }>()
);
export const getPayrollSettingsPayslipsAction = createAction(
  PayrollSettingsPayslipTypes.getPayrollSettingsPayslipsAction
);
export const getPayrollSettingsPayslipsSuccessAction = createAction(
  PayrollSettingsPayslipTypes.getPayrollSettingsPayslipsSuccessAction,
  props<{ response: IPayslipSetup }>()
);