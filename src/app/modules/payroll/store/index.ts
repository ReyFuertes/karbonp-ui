import { ActionReducerMap } from '@ngrx/store';

import * as fromRoot from 'src/app/store';
import { PayrollOverviewReducer, PayrollOverviewState } from './overview/payroll-overview.reducer';
import { PayrollPayrunInProgressReducer, PayrollPayrunInProgressState } from './payrun-in-progress/payroll-payrun-in-progress.reducer';
import { PayrollPayrunCompletedReducer, PayrollPayrunCompletedState } from './payrun-completed/payroll-payruns-completed.reducer';
import { PayrollPayrunTimetrackingIntegrationReducer, PayrollPayrunTimetrackingIntegrationState } from './payroll-timetracking/payroll-timetracking.reducer';
import { PayrollPayrunInputReducer, PayrollPayrunInputState } from './payroll-input/payroll-input.reducer';
import { PayrollPayrunBulkUpdateReducer, PayrollPayrunBulkUpdateState } from './payrun-bulk-update/payrun-bulk-update.reducer';
import { PayrollSettingsPayPeriodReducer, PayrollSettingsPayPeriodState } from './payroll-settings-pay-period/payroll-settings-pay-period.reducer';
import { PayrollSettingsPayTypeReducer, PayrollSettingsPayTypeState } from './payroll-settings-pay-type/payroll-settings-pay-type.reducer';
import { PayrollSettingsPayslipSetupReducer, PayrollSettingsPayslipSetupState } from './payroll-settings-payslip/payroll-settings-payslip.reducer';
import { PayrollSettingsBanksSetupReducer, PayrollSettingsBanksSetupState } from './payroll-settings-bank/payroll-settings-bank.reducer';
import { PayrollSettingsCalculationReducer, PayrollSettingsCalculationState } from './payroll-settings-calculations/payroll-settings-calculations.reducer';
import { PayrollSubmissionsReducer, PayrollSubmissionsState } from './payroll-submissions/payroll-submissions.reducer';
import { PayrollFilingDetailReducer, PayrollFilingDetailState } from './payroll-filing-details/payroll-filing-details.reducer';
import { PayrollPaymentReducer, PayrollPaymentState } from './payroll-payment/payroll-payment.reducer';
import { PayrollPaymentScheduleReducer, PayrollPaymentScheduleState } from './payroll-schedule-payment/payroll-schedule-payment.reducer';

export interface PayrollModuleState {
  payrollOverview: PayrollOverviewState;
  payrollPayrunsInProgress: PayrollPayrunInProgressState;
  payrollPayrunsCompleted: PayrollPayrunCompletedState;
  payrollPayrunsTimetrackingIntegration: PayrollPayrunTimetrackingIntegrationState;
  payrollPayrunInput: PayrollPayrunInputState;
  payrollPayrunBulkUpdate: PayrollPayrunBulkUpdateState,
  payrollSettingsPayPeriod: PayrollSettingsPayPeriodState,
  payrollSettingsPayType: PayrollSettingsPayTypeState,
  payrollSettingsPayslipSetup: PayrollSettingsPayslipSetupState,
  payrollSettingsBanksSetup: PayrollSettingsBanksSetupState,
  payrollSettingsCalculations: PayrollSettingsCalculationState,
  payrollSubmissions: PayrollSubmissionsState,
  payrollFilingDetail: PayrollFilingDetailState,
  payrollPayment: PayrollPaymentState,
  payrollPaymentSchedule: PayrollPaymentScheduleState
}
export const payrollReducers: ActionReducerMap<PayrollModuleState> = {
  payrollOverview: PayrollOverviewReducer,
  payrollPayrunsInProgress: PayrollPayrunInProgressReducer,
  payrollPayrunsCompleted: PayrollPayrunCompletedReducer,
  payrollPayrunsTimetrackingIntegration: PayrollPayrunTimetrackingIntegrationReducer,
  payrollPayrunInput: PayrollPayrunInputReducer,
  payrollPayrunBulkUpdate: PayrollPayrunBulkUpdateReducer,
  payrollSettingsPayPeriod: PayrollSettingsPayPeriodReducer,
  payrollSettingsPayType: PayrollSettingsPayTypeReducer,
  payrollSettingsPayslipSetup: PayrollSettingsPayslipSetupReducer,
  payrollSettingsBanksSetup: PayrollSettingsBanksSetupReducer,
  payrollSettingsCalculations: PayrollSettingsCalculationReducer,
  payrollSubmissions: PayrollSubmissionsReducer,
  payrollFilingDetail: PayrollFilingDetailReducer,
  payrollPayment: PayrollPaymentReducer,
  payrollPaymentSchedule: PayrollPaymentScheduleReducer
};

export interface AppState extends fromRoot.AppState {
  payrollModule: PayrollModuleState;
}