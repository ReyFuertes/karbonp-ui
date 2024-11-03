import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";
import { IPayrunInProgress } from "../../payroll.model";
import { sortByDesc } from "src/app/shared/util/sort";

export const payrollInProgressModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getIsReleasePayRunSuccessSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.isReleasePayRunSuccess || undefined);
export const getSelfServiceEnabledCountSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.selfServiceEnabledCount || undefined);
export const getIsRequestedPayslipCompletedSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.isRequestedPayslipCompleted || undefined);
export const getTimeAttendanceSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.timeAttendance || undefined);
export const getPayrunPublicHolidaySelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.publicHoliday || undefined);
export const getRestDaysForEmployeeSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.restDaysForEmployee || undefined);
export const getDownloadedGoalGetterPaySlipPdfSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.downloadedGoalGetterPaySlipPdf || undefined);
export const getGoalGetterSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.calculatedGoalGetter || undefined);
export const getCustomPaytypeSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.customPaytype || undefined);
export const getBeneficiariesSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.beneficiaries || undefined);
export const getBasicSalaryInputSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.basicSalaryInput || undefined);
export const getPayrollcalculationsSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.payrollcalculation || undefined);
export const getPayrollCalculationSettingsSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.payrollCalculationSettings || []);
export const getEmployeeDesignationSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.employeeDesignation || undefined);
export const getEmployeeWorkingHourSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.employeeWorkingHour || undefined);
export const getEmployeeActivityLogsSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.activityLogs || undefined);
export const getPayrollPayslipPreviewDataSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.payslipPreview || undefined);
export const getPayrollEmployeeSetupDataSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.payrollEmployeeSetupData || undefined);
export const getAbilityToCompletePayRunSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.abilityToCompletePayRun || undefined);
export const getDownloadedPayslipSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.downloadedPayslip || undefined);
export const getDownloadedBulkPayrunSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.downloadedBulkPayrun || undefined);
export const getPayrollPayrunEmployeesSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.payrunEmployees || []);
export const getPayrollPayrunSelectedPayRunSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.selectedPayRun || undefined);
export const getPayrollPayrunInProgressSelector = createSelector(
  payrollInProgressModuleState,
  state => state
    ? Object.values(state?.payrollPayrunsInProgress?.entities)
      .sort((a: IPayrunInProgress, b: IPayrunInProgress) => sortByDesc(a, b, 'fromDate'))
    : []);
export const getPayrollPayrunInProgressLoadingSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.isLoading || false);
export const getPayrollPayrunInProgressFilterLoadingSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.isFilterLoading || false);
export const getPayrollPayrunsInProgressTotalItemsSelector = createSelector(
  payrollInProgressModuleState,
  state => state?.payrollPayrunsInProgress?.payRunInProgresstotalCount || 0);