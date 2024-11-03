import { Action, createReducer, on } from "@ngrx/store";

import { getGrossSalariesByMonthForFinancialYearSuccessAction, getPayrollEftSetupSuccessAction, getPayRunsPerMonthOverviewAction, getPayRunsPerMonthOverviewSuccessAction } from "./payroll-overview.action";
import { GenericState } from "src/app/store/app.reducer";
import { IEtfSetup, IGetPayRunsPerMonthOverview, IGrossSalaryByMonthlyFinancialYear } from "../../payroll.model";

export interface PayrollOverviewState extends GenericState {
  payRunsPerMonth: IGetPayRunsPerMonthOverview;
  grossSalaryByMonthlyFinancialYear: IGrossSalaryByMonthlyFinancialYear[];
  eftSetup: IEtfSetup;
}
export const initialState: PayrollOverviewState = {
  isLoading: false,
  payRunsPerMonth: undefined,
  grossSalaryByMonthlyFinancialYear: [],
  eftSetup: undefined
};

const payrollOverviewReducer = createReducer(
  initialState,
  on(getGrossSalariesByMonthForFinancialYearSuccessAction, (state, action) => {
    return Object.assign({}, state, { grossSalaryByMonthlyFinancialYear: action.response });
  }),
  on(getPayRunsPerMonthOverviewAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getPayRunsPerMonthOverviewSuccessAction, (state, action) => {
    return Object.assign({}, state, { payRunsPerMonth: action.response, isLoading: false });
  }),
  on(getPayrollEftSetupSuccessAction, (state, action) => {
    return Object.assign({}, state, { eftSetup: action.response });
  }),
);
export function PayrollOverviewReducer(state: PayrollOverviewState, action: Action) {
  return payrollOverviewReducer(state, action);
}
