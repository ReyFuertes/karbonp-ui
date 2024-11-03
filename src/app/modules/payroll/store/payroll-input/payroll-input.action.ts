import { createAction, props } from "@ngrx/store";

import { ICommonResponse } from "src/app/models/generic.model";
import { IAllowanceInput, IBenefitInput, IDailyWeeklyBreakdownDetail, IDeductionInput, IIncomeInput, IOtherInput, IPayrollInput, IPayrollInputNote, IPhilippinesRegulatedSetting } from "../../payroll.model";

export enum PayrollPayrunInputTypes {
  getDeductionPayrollInputAction = '[payrun Input] get deduction payroll input',
  getDeductionPayrollInputSuccessAction = '[payrun Input] get deduction payroll input (success)',
  saveNotesAction = '[Payroll payrun Input] save notes',
  saveNotesSuccessAction = '[Payroll payrun Input] save notes (success)',
  deleteNotesAction = '[Payroll payrun Input] delete note',
  deleteNotesSuccessAction = '[Payroll payrun Input] delete note (success)',
  getSelectedPayrollInputsAction = '[payrun Input] get selected payroll input',
  getSelectedPayrollInputSuccessAction = '[payrun Input] get selected payroll input (success)',
  saveRecurringInputAllowanceAction = '[Payroll payrun Input] save recurring input allowance',
  saveRecurringInputAllowanceSuccessAction = '[Payroll payrun Input] save recurring input allowance (success)',
  saveBenefitInputAction = '[Payroll payrun Input] save input benefit',
  saveBenefitInputSuccessAction = '[Payroll payrun Input] save input benefit (success)',
  saveOtherInputAction = '[Payroll payrun Input] save input other',
  saveOtherInputSuccessAction = '[Payroll payrun Input] save input other (success)',
  saveDeductionInputAction = '[Payroll payrun Input] save input deduction',
  saveDeductionInputSuccessAction = '[Payroll payrun Input] save input deduction (success)',
  deletePayrollInputAction = '[Payroll payrun Input] delete payroll input',
  deletePayrollInputSuccessAction = '[Payroll payrun Input] delete payroll input (success)',
  getRelevantPhilippinesRegulatedSettingAction = '[payrun Input] get relevant philippines regulated setting',
  getRelevantPhilippinesRegulatedSettinguccessAction = '[payrun Input]  get relevant philippines regulated setting (success)',
  getPayPointByEmployeeIdAction = '[payrun Input] get pay point by employee id',
  getPayPointByEmployeeIdSuccessAction = '[payrun Input] get pay point by employee id (success)',
  getPayrollCalculationSetupAction = '[payrun Input] get payroll calculation setup',
  getPayrollCalculationSetupSuccessAction = '[payrun Input] get payroll calculation setup (success)',
  saveIncomeInputAction = '[Payroll payrun Input] save input income',
  saveIncomeInputSuccessAction = '[Payroll payrun Input] save input income (success)',
  getBasicSalaryPayrollInputAction = '[Payroll payrun Input] get basic salary payroll input',
  getBasicSalaryPayrollInputSuccessAction = '[Payroll payrun Input] get basic salary payroll input (success)',
  saveDailyWeeklyBreakdownHoursSalaryAction = '[Payroll payrun Input] save daily weekly breakdown hours salary',
  saveDailyWeeklyBreakdownHoursSalarySuccessAction = '[Payroll payrun Input] save daily weekly breakdown hours salary (success)',
}
export const saveDailyWeeklyBreakdownHoursSalaryAction = createAction(
  PayrollPayrunInputTypes.saveDailyWeeklyBreakdownHoursSalaryAction,
  props<{ payload: { DailyWeeklyBreakdownDetails: IDailyWeeklyBreakdownDetail[], id: number, employeeId: number, payRunId: number } }>()
);
export const saveDailyWeeklyBreakdownHoursSalarySuccessAction = createAction(
  PayrollPayrunInputTypes.saveDailyWeeklyBreakdownHoursSalarySuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getBasicSalaryPayrollInputAction = createAction(
  PayrollPayrunInputTypes.getBasicSalaryPayrollInputAction,
  props<{ employeeId: number, payRunId: number }>()
);
export const getBasicSalaryPayrollInputSuccessAction = createAction(
  PayrollPayrunInputTypes.getBasicSalaryPayrollInputSuccessAction,
  props<{ response: { payrollInput: IPayrollInput } }>()
);
export const saveIncomeInputAction = createAction(
  PayrollPayrunInputTypes.saveIncomeInputAction,
  props<{ payload: IIncomeInput }>()
);
export const saveIncomeInputSuccessAction = createAction(
  PayrollPayrunInputTypes.saveIncomeInputSuccessAction,
  props<{ response: IIncomeInput }>()
);
export const getPayrollCalculationSetupAction = createAction(
  PayrollPayrunInputTypes.getPayrollCalculationSetupAction,
);
export const getPayrollCalculationSetupSuccessAction = createAction(
  PayrollPayrunInputTypes.getPayrollCalculationSetupSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayPointByEmployeeIdAction = createAction(
  PayrollPayrunInputTypes.getPayPointByEmployeeIdAction,
  props<{ employeeId: number }>()
);
export const getPayPointByEmployeeIdSuccessAction = createAction(
  PayrollPayrunInputTypes.getPayPointByEmployeeIdSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getRelevantPhilippinesRegulatedSettingAction = createAction(
  PayrollPayrunInputTypes.getRelevantPhilippinesRegulatedSettingAction,
  props<{ payRunId: number }>()
);
export const getRelevantPhilippinesRegulatedSettinguccessAction = createAction(
  PayrollPayrunInputTypes.getRelevantPhilippinesRegulatedSettinguccessAction,
  props<{ response: IPhilippinesRegulatedSetting }>()
);
export const deletePayrollInputAction = createAction(
  PayrollPayrunInputTypes.deletePayrollInputAction,
  props<{ id: number, employeeId: number, payRunId: number }>() //note: add payrunId this for refresh
);
export const deletePayrollInputSuccessAction = createAction(
  PayrollPayrunInputTypes.deletePayrollInputSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const saveDeductionInputAction = createAction(
  PayrollPayrunInputTypes.saveDeductionInputAction,
  props<{ payload: IDeductionInput }>()
);
export const saveDeductionInputSuccessAction = createAction(
  PayrollPayrunInputTypes.saveDeductionInputSuccessAction,
  props<{ response: IDeductionInput }>()
);
export const saveOtherInputAction = createAction(
  PayrollPayrunInputTypes.saveOtherInputAction,
  props<{ payload: IOtherInput }>()
);
export const saveOtherInputSuccessAction = createAction(
  PayrollPayrunInputTypes.saveOtherInputSuccessAction,
  props<{ response: IOtherInput }>()
);
export const saveBenefitInputAction = createAction(
  PayrollPayrunInputTypes.saveBenefitInputAction,
  props<{ payload: IBenefitInput }>()
);
export const saveBenefitInputSuccessAction = createAction(
  PayrollPayrunInputTypes.saveBenefitInputSuccessAction,
  props<{ response: IBenefitInput }>()
);
export const saveRecurringInputAllowanceAction = createAction(
  PayrollPayrunInputTypes.saveRecurringInputAllowanceAction,
  props<{ payload: IAllowanceInput }>() //note: add payrunId this for refresh
);
export const saveRecurringInputAllowanceSuccessAction = createAction(
  PayrollPayrunInputTypes.saveRecurringInputAllowanceSuccessAction,
  props<{ response: IAllowanceInput }>()
);
export const getSelectedPayrollInputsAction = createAction(
  PayrollPayrunInputTypes.getSelectedPayrollInputsAction,
  props<{ payrollInputId: number, payRunId: number }>()
);
export const getSelectedPayrollInputSuccessAction = createAction(
  PayrollPayrunInputTypes.getSelectedPayrollInputSuccessAction,
  props<{ response: { payrollInput: IAllowanceInput } }>()
);
export const deleteNotesAction = createAction(
  PayrollPayrunInputTypes.deleteNotesAction,
  props<{ payload: IPayrollInputNote }>()
);
export const deleteNotesSuccessAction = createAction(
  PayrollPayrunInputTypes.deleteNotesSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const saveNotesAction = createAction(
  PayrollPayrunInputTypes.saveNotesAction,
  props<{ payload: IPayrollInputNote }>()
);
export const saveNotesSuccessAction = createAction(
  PayrollPayrunInputTypes.saveNotesSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getDeductionPayrollInputAction = createAction(
  PayrollPayrunInputTypes.getDeductionPayrollInputAction,
  props<{ payrollInputId: number, payRunId: number }>()
);
export const getDeductionPayrollInputSuccessAction = createAction(
  PayrollPayrunInputTypes.getDeductionPayrollInputSuccessAction,
  props<{ response: { payrollInput: IPayrollInput } }>()
);