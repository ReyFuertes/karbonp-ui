import { createAction, props } from "@ngrx/store";

import { IEtfSetup, IGetPayRunsPerMonthOverview, IGrossSalaryByMonthlyFinancialYear } from "../../payroll.model";

export enum PayrollOverviewTypes {
  getPayrollEftSetupAction = '[Payroll overview] get eft setup',
  getPayrollEftSetupSuccessAction = '[Payroll overview] get ft setup (success)',
  getPayrollAction = '[Payroll overview] get apps',
  getPayrollSuccessAction = '[Payroll overview] get apps (success)',
  getPayRunsPerMonthOverviewAction = '[Payroll overview] get pay runs month overview',
  getPayRunsPerMonthOverviewSuccessAction = '[Payroll overview] get pay runs month overview (success)',
  getGrossSalariesByMonthForFinancialYearAction = '[Payroll overview] get gross salaries month financial year',
  getGrossSalariesByMonthForFinancialYearSuccessAction = '[Payroll overview] get gross salaries month financial year (success)'
}
export const getGrossSalariesByMonthForFinancialYearAction = createAction(
  PayrollOverviewTypes.getGrossSalariesByMonthForFinancialYearAction,
  props<{ payload: { fromDate?: string, toDate?: string } }>()
);
export const getGrossSalariesByMonthForFinancialYearSuccessAction = createAction(
  PayrollOverviewTypes.getGrossSalariesByMonthForFinancialYearSuccessAction,
  props<{ response: IGrossSalaryByMonthlyFinancialYear[] }>()
);
export const getPayRunsPerMonthOverviewAction = createAction(
  PayrollOverviewTypes.getPayRunsPerMonthOverviewAction,
  props<{ payload: IGetPayRunsPerMonthOverview }>()
);
export const getPayRunsPerMonthOverviewSuccessAction = createAction(
  PayrollOverviewTypes.getPayRunsPerMonthOverviewSuccessAction,
  props<{ response: IGetPayRunsPerMonthOverview }>()
);
export const getPayrollEftSetupAction = createAction(
  PayrollOverviewTypes.getPayrollEftSetupAction
);
export const getPayrollEftSetupSuccessAction = createAction(
  PayrollOverviewTypes.getPayrollEftSetupSuccessAction,
  props<{ response: IEtfSetup }>()
);