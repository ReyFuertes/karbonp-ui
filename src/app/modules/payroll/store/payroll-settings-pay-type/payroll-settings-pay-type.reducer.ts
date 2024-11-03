import { Action, createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { getPayrollSettingsPayTypesSuccessAction } from "./payroll-settings-pay-type.action";
import { ICustomPaytype } from "../../payroll.model";

export interface PayrollSettingsPayTypeState extends EntityState<ICustomPaytype> {
  isLoading: boolean;
  payRunPayTypetotalCount: number;
}
export const adapter: EntityAdapter<ICustomPaytype> = createEntityAdapter<ICustomPaytype>({
});
export const initialState: PayrollSettingsPayTypeState = adapter.getInitialState({
  isLoading: false,
  payRunPayTypetotalCount: 0,
})
const payrollSettingsPayTypeReducer = createReducer(
  initialState,
  on(getPayrollSettingsPayTypesSuccessAction, (state, action) => {
    return Object.assign({
      ...adapter.setAll(action.response?.items || [], state),
      payRunPayTypetotalCount: action.response?.totalItems
    })
  })
);
export function PayrollSettingsPayTypeReducer(state: PayrollSettingsPayTypeState, action: Action) {
  return payrollSettingsPayTypeReducer(state, action);
}
