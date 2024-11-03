import { Action, createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { IPayPeriod } from "src/app/models/generic.model";
import { calculateDateRangesSuccessAction, getPayrollSettingsPayPeriodsSuccessAction } from "./payroll-settings-pay-period.action";
import { IPayPeriodDateRange } from "../../payroll.model";

export interface PayrollSettingsPayPeriodState extends EntityState<IPayPeriod> {
  isLoading: boolean;
  payRunPayPeriodtotalCount: number;
  payPeriodDateRange: IPayPeriodDateRange[];
}
export const adapter: EntityAdapter<IPayPeriod> = createEntityAdapter<IPayPeriod>({
});
export const initialState: PayrollSettingsPayPeriodState = adapter.getInitialState({
  isLoading: false,
  payRunPayPeriodtotalCount: 0,
  payPeriodDateRange: [],
})
const payrollSettingsPayPeriodReducer = createReducer(
  initialState,
  on(calculateDateRangesSuccessAction, (state, action) => {
    return Object.assign({}, state, { payPeriodDateRange: action.response });
  }),
  on(getPayrollSettingsPayPeriodsSuccessAction, (state, action) => {
    return Object.assign({
      ...adapter.setAll(action.response?.items || [], state),
      payRunPayPeriodtotalCount: action.response?.totalItems
    })
  })
);
export function PayrollSettingsPayPeriodReducer(state: PayrollSettingsPayPeriodState, action: Action) {
  return payrollSettingsPayPeriodReducer(state, action);
}
