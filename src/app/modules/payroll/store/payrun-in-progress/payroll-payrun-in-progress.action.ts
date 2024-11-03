import { createAction, props } from "@ngrx/store";

import { ICommonResponse, IDesignation, IEmployeeActivityLog, IPaginationPayload } from "src/app/models/generic.model";
import { IApprovePayslipPayload, IBeneficiary, IBeneficiaryPayload, ICustomPayrunPayload, ICustomPaytype, IDownloadBulkPayslipPayload, ICalculatedGoalGetter, IPayRunEmployeePayload, IPayrollInput, IPayrunEmployee, IPayrunInProgress, IPayslip, IPayslipPreview } from "../../payroll.model";
import { IEmployeeWorkingHour } from "src/app/modules/employee/employee.model";
import { IPublicHoliday } from "src/app/modules/time-off/time-off.model";

export enum PayrollPayrunInProgressTypes {
  getPayrunInProgressAction = '[Payroll payrun in-progress] get pay runs in progress',
  getPayrunInProgressSuccessAction = '[Payroll payrun in-progress] get pay runs in progress (success)',
  getPayrunSetupDataAction = '[Payroll payrun in-progress] get pay runs setup data',
  getPayrunSetupDataSuccessAction = '[Payroll payrun in-progress] get pay runs setup data (success)',
  getPayRunEmployeesAction = '[Payroll payrun in-progress] get pay run employees',
  getPayRunEmployeesSuccessAction = '[Payroll payrun in-progress] get pay run employees (success)',
  approvePayrunPayslipsAction = '[Payroll payrun in-progress] approve payrun payslips',
  approvePayrunPayslipsSuccessAction = '[Payroll payrun in-progress] approve payrun payslips (success)',
  createCustomPayrunAction = '[Payroll payrun] create custom payrun',
  createCustomPayrunSuccessAction = '[Payroll payrun] create custom payrun (success)',
  downloadBulkPayRunsAction = '[Payroll payrun] download bulk payrun',
  downloadBulkPayRunsSuccessAction = '[Payroll payrun] download bulk payrun (success)',
  clearDownloadedBulkPayRunsAction = '[Payroll payrun] clear downloaded bulk payrun',
  generatePDFPaySlipAction = '[Payroll payrun] generate pdf payslip',
  generatePDFPaySlipSuccessAction = '[Payroll payrun] generate pdf payslip (success)',
  validateForInabilityToCompletePayRunAction = '[Payroll payrun in-progress] validate inability to complete payrun',
  validateForInabilityToCompletePayRunSuccessAction = '[Payroll payrun in-progress] validate inability to complete payrun (success)',
  completeInProgressPayRunAction = '[Payroll payrun] complete in progress pay run',
  completeInProgressPayRunSuccessAction = '[Payroll payrun] complete in progress pay run (success)',
  getPayrollEmployeeSetupDataAction = '[Payroll payrun] get payroll employee setup data',
  getPayrollEmployeeSetupDataSuccessAction = '[Payroll payrun] get payroll employee setup data (success)',
  getPayslipPreviewAction = '[Payroll payrun] get payslip preview',
  getPayslipPreviewSuccessAction = '[Payroll payrun] get payslip preview (success)',
  updatePayslipProRataPercentageAction = '[Payroll payrun] update payslip pro rata percentage',
  updatePayslipProRataPercentageSuccessAction = '[Payroll payrun] update payslip pro rata percentage (success)',
  getEmployeeActivityLoggingAction = '[Payroll payrun in-progress] get employee activity logging',
  getEmployeeActivityLoggingSuccessAction = '[Payroll payrun in-progress] get employee activity logging (success)',
  approveRevertPayslipAction = '[Payroll payrun in-progress] approve or revert payrun payslip',
  approveRevertPayslipSuccessAction = '[Payroll payrun in-progress] approve or revert payrun payslip (success)',
  getPayrollEmployeeHoursAction = '[Payroll payrun in-progress] get employee hours',
  getPayrollEmployeeHoursSuccessAction = '[Payroll payrun in-progress] get employee hours (success)',
  saveBasicSalaryAction = '[Payroll payrun in-progress] save basic earnings',
  saveBasicSalarySuccessAction = '[Payroll payrun in-progress] save basic earnings (success)',
  getBeneficiariesAction = '[Payroll payrun in-progress] get beneficiaries',
  getBeneficiariesSuccessAction = '[Payroll payrun in-progress] get beneficiaries (success)',
  getPayrollPayTypeAction = '[Payroll payrun in-progress] get payroll pay type',
  getPayrollPayTypeSuccessAction = '[Payroll payrun in-progress] get payroll pay type (success)',
  getEmployeeRetirementFundingAction = '[Payroll payrun in-progress] get employee retirement funding',
  getEmployeeRetirementFundingActionSuccessAction = '[Payroll payrun in-progress] get employee retirement funding (success)',
  calculateGoalGetterNetAmountAction = '[Payroll payrun in-progress] calculate goal getter net amount',
  calculateGoalGetterNetAmountActionSuccessAction = '[Payroll payrun in-progress] calculate goal getter net amoun (success)',
  generateGoalGetterPaySlipPDFAction = '[Payroll payrun in-progress] generate goal getter payslip pdf',
  generateGoalGetterPaySlipPDFActionSuccessAction = '[Payroll payrun in-progress] generate goal getter payslip pdf (success)',
  applyGoalGetterNetAmountAction = '[Payroll payrun in-progress] apply goal getter net amount',
  applyGoalGetterNetAmountSuccessAction = '[Payroll payrun in-progress] apply goal getter net amount (success)',
  getRestDaysForEmployeeAction = '[Payroll payrun in-progress] get rest days for employee',
  getRestDaysForEmployeeSuccessAction = '[Payroll payrun in-progress] get rest days for employee (success)',
  getPublicHolidaysByPayRunAction = '[Payroll payrun in-progress] get public holidays by payrun',
  getPublicHolidaysByPayRunSuccessAction = '[Payroll payrun in-progress] get public holidays by payrun (success)',
  getTimeAndAttendanceAction = '[Payroll payrun in-progress] get time and attendance',
  getTimeAndAttendanceSuccessAction = '[Payroll payrun in-progress] get time and attendance (success)',
  deletePayRunAction = '[Payroll payrun in-progress] delete payrun',
  deletePayRunSuccessAction = '[Payroll payrun in-progress] delete payrun (success)',
  reCalculatePayRunPayslipsAction = '[Payroll payrun in-progress] recalculate payrun payslips',
  reCalculatePayRunPayslipsSuccessAction = '[Payroll payrun in-progress] recalculate payrun payslips (success)',
  releasePayRunAction = '[Payroll payrun in-progress] release payrun',
  releasePayRunSuccessAction = '[Payroll payrun in-progress] release payrun (success)',
  
}
export const releasePayRunAction = createAction(
  PayrollPayrunInProgressTypes.releasePayRunAction,
  props<{ payRunId: number, cultureLang: string }>()
);
export const releasePayRunSuccessAction = createAction(
  PayrollPayrunInProgressTypes.releasePayRunSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const reCalculatePayRunPayslipsAction = createAction(
  PayrollPayrunInProgressTypes.reCalculatePayRunPayslipsAction,
  props<{ payRunId: number }>()
);
export const reCalculatePayRunPayslipsSuccessAction = createAction(
  PayrollPayrunInProgressTypes.reCalculatePayRunPayslipsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const deletePayRunAction = createAction(
  PayrollPayrunInProgressTypes.deletePayRunAction,
  props<{ payRunId: number }>()
);
export const deletePayRunSuccessAction = createAction(
  PayrollPayrunInProgressTypes.deletePayRunSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getTimeAndAttendanceAction = createAction(
  PayrollPayrunInProgressTypes.getTimeAndAttendanceAction
);
export const getTimeAndAttendanceSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getTimeAndAttendanceSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPublicHolidaysByPayRunAction = createAction(
  PayrollPayrunInProgressTypes.getPublicHolidaysByPayRunAction,
  props<{ payRunId: number }>()
);
export const getPublicHolidaysByPayRunSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPublicHolidaysByPayRunSuccessAction,
  props<{ response: IPublicHoliday[] }>()
);
export const getRestDaysForEmployeeAction = createAction(
  PayrollPayrunInProgressTypes.getRestDaysForEmployeeAction,
  props<{ employeeId: number, payRunId: number }>()
);
export const getRestDaysForEmployeeSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getRestDaysForEmployeeSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const applyGoalGetterNetAmountAction = createAction(
  PayrollPayrunInProgressTypes.applyGoalGetterNetAmountAction,
  props<{ payload: { amount: number, goalGetterType: number, payslipId: number }, employeeId: number, payRunId: number }>()
);
export const applyGoalGetterNetAmountSuccessAction = createAction(
  PayrollPayrunInProgressTypes.applyGoalGetterNetAmountSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const generateGoalGetterPaySlipPDFAction = createAction(
  PayrollPayrunInProgressTypes.generateGoalGetterPaySlipPDFAction,
  props<{ payload: { amount: number, goalGetterType: number, payslipId: number } }>()
);
export const generateGoalGetterPaySlipPDFActionSuccessAction = createAction(
  PayrollPayrunInProgressTypes.generateGoalGetterPaySlipPDFActionSuccessAction,
  props<{ response: ICommonResponse, payslipId: number }>()
);
export const calculateGoalGetterNetAmountAction = createAction(
  PayrollPayrunInProgressTypes.calculateGoalGetterNetAmountAction,
  props<{ payload: { amount: number, goalGetterType: number, payslipId: number } }>()
);
export const calculateGoalGetterNetAmountActionSuccessAction = createAction(
  PayrollPayrunInProgressTypes.calculateGoalGetterNetAmountActionSuccessAction,
  props<{ response: ICalculatedGoalGetter }>()
);
export const getEmployeeRetirementFundingAction = createAction(
  PayrollPayrunInProgressTypes.getEmployeeRetirementFundingAction,
  props<{ employeeId: number }>()
);
export const getEmployeeRetirementFundingActionSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getEmployeeRetirementFundingActionSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayrollPayTypeAction = createAction(
  PayrollPayrunInProgressTypes.getPayrollPayTypeAction,
  props<{ payTypeId: number }>()
);
export const getPayrollPayTypeSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPayrollPayTypeSuccessAction,
  props<{ response: ICustomPaytype }>()
);
export const getBeneficiariesAction = createAction(
  PayrollPayrunInProgressTypes.getBeneficiariesAction,
  props<{ payload: IBeneficiaryPayload }>()
);
export const getBeneficiariesSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getBeneficiariesSuccessAction,
  props<{ response: IBeneficiary[] }>()
);
export const saveBasicSalaryAction = createAction(
  PayrollPayrunInProgressTypes.saveBasicSalaryAction,
  props<{ payload: IPayrollInput, employeeId?: number, payRunId?: number }>()
);
export const saveBasicSalarySuccessAction = createAction(
  PayrollPayrunInProgressTypes.saveBasicSalarySuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayrollEmployeeHoursAction = createAction(
  PayrollPayrunInProgressTypes.getPayrollEmployeeHoursAction,
  props<{ employeeId: number, payRunId: number }>()
);
export const getPayrollEmployeeHoursSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPayrollEmployeeHoursSuccessAction,
  props<{
    employeeWorkingHour: IEmployeeWorkingHour,
    employeeDesignation: IDesignation,
    payrollCalculationSettings: ICommonResponse,
    payrollcalculations: ICommonResponse
  }>()
);
export const approveRevertPayslipAction = createAction(
  PayrollPayrunInProgressTypes.approveRevertPayslipAction,
  props<{
    payload: { payslipId: number, revert: boolean }[], //note: why array? -_-
    employeePayRun?: { employeeId: number, payRunId: number }
  }>()
);
export const approveRevertPayslipSuccessAction = createAction(
  PayrollPayrunInProgressTypes.approveRevertPayslipSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getEmployeeActivityLoggingAction = createAction(
  PayrollPayrunInProgressTypes.getEmployeeActivityLoggingAction,
  props<{ payload: { employeeId: number, payRunId: number } }>()
);
export const getEmployeeActivityLoggingSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getEmployeeActivityLoggingSuccessAction,
  props<{ response: IEmployeeActivityLog[] }>()
);
export const getPayslipPreviewAction = createAction(
  PayrollPayrunInProgressTypes.getPayslipPreviewAction,
  props<{ employeeId: number, payRunId: number }>()
);
export const getPayslipPreviewSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPayslipPreviewSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const updatePayslipProRataPercentageAction = createAction(
  PayrollPayrunInProgressTypes.updatePayslipProRataPercentageAction,
  props<{ payload: IPayslip }>()
);
export const updatePayslipProRataPercentageSuccessAction = createAction(
  PayrollPayrunInProgressTypes.updatePayslipProRataPercentageSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayrollEmployeeSetupDataAction = createAction(
  PayrollPayrunInProgressTypes.getPayrollEmployeeSetupDataAction,
  props<{ employeeId: number, payRunId: number }>()
);
export const getPayrollEmployeeSetupDataSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPayrollEmployeeSetupDataSuccessAction,
  props<{ employeeSetupData: ICommonResponse, payslipPreview: IPayslipPreview }>()
);
export const completeInProgressPayRunAction = createAction(
  PayrollPayrunInProgressTypes.completeInProgressPayRunAction,
  props<{ payload: { payDate: string, payRunId: number } }>()
);
export const completeInProgressPayRunSuccessAction = createAction(
  PayrollPayrunInProgressTypes.completeInProgressPayRunSuccessAction,
  props<{ response: ICommonResponse, selfServiceEnabledCount: number }>()
);
export const validateForInabilityToCompletePayRunAction = createAction(
  PayrollPayrunInProgressTypes.validateForInabilityToCompletePayRunAction,
  props<{ id: number }>()
);
export const validateForInabilityToCompletePayRunSuccessAction = createAction(
  PayrollPayrunInProgressTypes.validateForInabilityToCompletePayRunSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const generatePDFPaySlipAction = createAction(
  PayrollPayrunInProgressTypes.generatePDFPaySlipAction,
  props<{ employeeId: number, payRunId: number }>()
);
export const generatePDFPaySlipSuccessAction = createAction(
  PayrollPayrunInProgressTypes.generatePDFPaySlipSuccessAction,
  props<{ employeeId?: number, response: ICommonResponse }>()
);
export const clearDownloadedBulkPayRunsAction = createAction(
  PayrollPayrunInProgressTypes.clearDownloadedBulkPayRunsAction
);
export const downloadBulkPayRunsAction = createAction(
  PayrollPayrunInProgressTypes.downloadBulkPayRunsAction,
  props<{ payload: IDownloadBulkPayslipPayload }>()
);
export const downloadBulkPayRunsSuccessAction = createAction(
  PayrollPayrunInProgressTypes.downloadBulkPayRunsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const createCustomPayrunAction = createAction(
  PayrollPayrunInProgressTypes.createCustomPayrunAction,
  props<{ payload: ICustomPayrunPayload }>()
);
export const createCustomPayrunSuccessAction = createAction(
  PayrollPayrunInProgressTypes.createCustomPayrunSuccessAction,
  props<{ response: IPayrunInProgress }>()
);
export const approvePayrunPayslipsAction = createAction(
  PayrollPayrunInProgressTypes.approvePayrunPayslipsAction,
  props<{ id: number, payload: IApprovePayslipPayload[] }>()
);
export const approvePayrunPayslipsSuccessAction = createAction(
  PayrollPayrunInProgressTypes.approvePayrunPayslipsSuccessAction,
  props<{ response: IPayrunInProgress[] }>()
);
export const getPayRunEmployeesAction = createAction(
  PayrollPayrunInProgressTypes.getPayRunEmployeesAction,
  props<{ payload: IPayRunEmployeePayload }>()
);
export const getPayRunEmployeesSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPayRunEmployeesSuccessAction,
  props<{ response: IPayrunInProgress[] }>()
);
export const getPayrunSetupDataAction = createAction(
  PayrollPayrunInProgressTypes.getPayrunSetupDataAction,
  props<{ id: number }>()
);
export const getPayrunSetupDataSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPayrunSetupDataSuccessAction,
  props<{ setupData: ICommonResponse, payRunEmployees: IPayrunEmployee[] }>()
);
export const getPayrunInProgressAction = createAction(
  PayrollPayrunInProgressTypes.getPayrunInProgressAction,
  props<{ payload: IPaginationPayload }>()
);
export const getPayrunInProgressSuccessAction = createAction(
  PayrollPayrunInProgressTypes.getPayrunInProgressSuccessAction,
  props<{ response: { items: IPayrunInProgress[], totalItems: number } }>()
);