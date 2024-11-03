import { Action, createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { IBeneficiary, ICustomPaytype, ICalculatedGoalGetter, IPayrollCalculation, IPayrollCalculationSetting, IPayrollEmployeeSetupData, IPayrollInput, IPayrunEmployee, IPayrunInProgress, IPayslipPreview, ISelectedPayrun } from "../../payroll.model";
import { approvePayrunPayslipsAction, approvePayrunPayslipsSuccessAction, calculateGoalGetterNetAmountAction, calculateGoalGetterNetAmountActionSuccessAction, clearDownloadedBulkPayRunsAction, completeInProgressPayRunSuccessAction, createCustomPayrunSuccessAction, downloadBulkPayRunsSuccessAction, generateGoalGetterPaySlipPDFActionSuccessAction, generatePDFPaySlipSuccessAction, getBeneficiariesSuccessAction, getEmployeeActivityLoggingAction, getEmployeeActivityLoggingSuccessAction, getPayrollEmployeeHoursSuccessAction, getPayrollEmployeeSetupDataSuccessAction, getPayrollPayTypeSuccessAction, getPayRunEmployeesAction, getPayRunEmployeesSuccessAction, getPayrunInProgressAction, getPayrunInProgressSuccessAction, getPayrunSetupDataSuccessAction, getPayslipPreviewSuccessAction, getPublicHolidaysByPayRunSuccessAction, getRestDaysForEmployeeSuccessAction, getTimeAndAttendanceSuccessAction, releasePayRunSuccessAction, validateForInabilityToCompletePayRunSuccessAction } from "./payroll-payrun-in-progress.action";
import { IDesignation, IEmployeeActivityLog } from "src/app/models/generic.model";
import { IEmployeeWorkingHour } from "src/app/modules/employee/employee.model";
import { IPublicHoliday } from "src/app/modules/time-off/time-off.model";

export interface PayrollPayrunInProgressState extends EntityState<IPayrunInProgress> {
  isLoading: boolean;
  payRunInProgresstotalCount: number;
  isFilterLoading: boolean;
  selectedPayRun: ISelectedPayrun;
  payrunEmployees: IPayrunEmployee[];
  downloadedBulkPayrun: any;
  downloadedPayslip: Map<number, any>;
  abilityToCompletePayRun: any;
  payrollEmployeeSetupData: IPayrollEmployeeSetupData;
  payslipPreview: IPayslipPreview;
  activityLogs: IEmployeeActivityLog[];
  basicSalaryInput: IPayrollInput; //note: review this if needed
  employeeWorkingHour: IEmployeeWorkingHour
  employeeDesignation: IDesignation,
  payrollCalculationSettings: IPayrollCalculationSetting[],
  payrollcalculation: IPayrollCalculation;
  beneficiaries: IBeneficiary[];
  customPaytype: ICustomPaytype;
  calculatedGoalGetter: ICalculatedGoalGetter;
  downloadedGoalGetterPaySlipPdf: any; // note: no proper model
  restDaysForEmployee: string[];
  publicHoliday: IPublicHoliday[];
  timeAttendance: any; // note: no proper model
  isRequestedPayslipCompleted: boolean;
  selfServiceEnabledCount: number;
  isReleasePayRunSuccess: boolean;
}
export const adapter: EntityAdapter<IPayrunInProgress> = createEntityAdapter<IPayrunInProgress>({
});
export const initialState: PayrollPayrunInProgressState = adapter.getInitialState({
  isLoading: false,
  payRunInProgresstotalCount: 0,
  isFilterLoading: false,
  selectedPayRun: undefined,
  payrunEmployees: [],
  downloadedBulkPayrun: undefined,
  downloadedPayslip: undefined,
  abilityToCompletePayRun: undefined,
  payrollEmployeeSetupData: undefined,
  payslipPreview: undefined,
  activityLogs: [],
  basicSalaryInput: undefined,
  employeeWorkingHour: undefined,
  employeeDesignation: undefined,
  payrollCalculationSettings: [],
  payrollcalculation: undefined,
  beneficiaries: undefined,
  customPaytype: undefined,
  calculatedGoalGetter: undefined,
  downloadedGoalGetterPaySlipPdf: undefined,
  restDaysForEmployee: [],
  publicHoliday: [],
  timeAttendance: undefined,
  isRequestedPayslipCompleted: undefined,
  selfServiceEnabledCount: undefined,
  isReleasePayRunSuccess: false,
})
const payrollPayrunInProgressReducer = createReducer(
  initialState,
  on(releasePayRunSuccessAction, (state, action) => {
    return Object.assign({}, state, { isReleasePayRunSuccess: action?.response?.errors?.length === 0 });
  }),
  on(completeInProgressPayRunSuccessAction, (state, action) => {
    return Object.assign({}, state, {
      isRequestedPayslipCompleted: action?.response?.errors?.length === 0,
      selfServiceEnabledCount: action?.selfServiceEnabledCount
    });
  }),
  on(getTimeAndAttendanceSuccessAction, (state, action) => {
    return Object.assign({}, state, { timeAttendance: action.response });
  }),
  on(getPublicHolidaysByPayRunSuccessAction, (state, action) => {
    return Object.assign({}, state, { publicHoliday: action.response });
  }),
  on(getRestDaysForEmployeeSuccessAction, (state, action) => {
    return Object.assign({}, state, { restDaysForEmployee: action.response?.data });
  }),
  on(generateGoalGetterPaySlipPDFActionSuccessAction, (state, action) => {
    const downloadedGoalGetterPaySlipPdf = new Map<number, any>();
    downloadedGoalGetterPaySlipPdf.set(action.payslipId, { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedGoalGetterPaySlipPdf });
  }),
  on(calculateGoalGetterNetAmountAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(calculateGoalGetterNetAmountActionSuccessAction, (state, action) => {
    return Object.assign({}, state, { calculatedGoalGetter: action?.response, isLoading: false });
  }),
  on(getPayrollPayTypeSuccessAction, (state, action) => {
    return Object.assign({}, state, { customPaytype: action?.response });
  }),
  on(getBeneficiariesSuccessAction, (state, action) => {
    return Object.assign({}, state, { beneficiaries: action?.response });
  }),
  on(getPayrollEmployeeHoursSuccessAction, (state, action) => {
    return Object.assign({}, state, {
      employeeWorkingHour: action?.employeeWorkingHour,
      employeeDesignation: action?.employeeDesignation,
      payrollCalculationSettings: action.payrollCalculationSettings?.data,
      payrollcalculation: action?.payrollcalculations?.data?.payrollCalculation
    });
  }),
  on(getPayslipPreviewSuccessAction, (state, action) => {
    return Object.assign({}, state, { payslipPreview: action?.response });
  }),
  on(getEmployeeActivityLoggingAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getEmployeeActivityLoggingSuccessAction, (state, action) => {
    return Object.assign({}, state, { activityLogs: action?.response, isLoading: false });
  }),
  on(getPayrollEmployeeSetupDataSuccessAction, (state, action) => {
    if (action?.employeeSetupData?.data)
      state = Object.assign({}, state, { payrollEmployeeSetupData: action?.employeeSetupData?.data });
    if (action?.payslipPreview)
      state = Object.assign({}, state, { payslipPreview: action?.payslipPreview });
    return state;
  }),
  on(validateForInabilityToCompletePayRunSuccessAction, (state) => {
    return Object.assign({}, state, { abilityToCompletePayRun: undefined });
  }),
  on(generatePDFPaySlipSuccessAction, (state, action) => {
    const downloadedPayslip = new Map<number, any>();
    downloadedPayslip.set(action.employeeId, { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedPayslip });
  }),
  on(clearDownloadedBulkPayRunsAction, (state) => {
    return Object.assign({}, state, { downloadedBulkPayrun: undefined });
  }),
  on(downloadBulkPayRunsSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedBulkPayrun: action.response });
  }),
  on(createCustomPayrunSuccessAction, (state, action) => {
    return Object.assign({ ...adapter.addOne(action.response, state) })
  }),
  on(approvePayrunPayslipsAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(approvePayrunPayslipsSuccessAction, (state) => {
    return Object.assign({}, state, { isLoading: false });
  }),
  on(getPayRunEmployeesAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getPayRunEmployeesSuccessAction, (state, action) => {
    return Object.assign({}, state, { payrunEmployees: action.response, isLoading: false });
  }),
  on(getPayrunSetupDataSuccessAction, (state, action) => {
    return Object.assign({}, state, { selectedPayRun: action?.setupData?.data, payrunEmployees: action?.payRunEmployees });
  }),
  on(getPayrunInProgressAction, (state) => {
    return Object.assign({}, state, { isFilterLoading: true });
  }),
  on(getPayrunInProgressSuccessAction, (state, action) => {
    return Object.assign({
      ...adapter.setAll(action.response?.items || [], state),
      isFilterLoading: false,
      payRunInProgresstotalCount: action.response?.totalItems
    })
  })
);
export function PayrollPayrunInProgressReducer(state: PayrollPayrunInProgressState, action: Action) {
  return payrollPayrunInProgressReducer(state, action);
}
