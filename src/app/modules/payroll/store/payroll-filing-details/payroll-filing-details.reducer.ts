import { Action, createReducer, on } from "@ngrx/store";

import { getFilingdetailsSetupSuccessAction, getTradeClassificationGroupsSuccessAction } from "./payroll-filing-details.action";
import { IStandardIndustrialClassificationLevel } from "../../payroll.model";

export interface PayrollFilingDetailState {
  isLoading: boolean;
  standardIndustrialClassificationLevels: Map<number, IStandardIndustrialClassificationLevel[]>;
  tradeClassificationGroups: IStandardIndustrialClassificationLevel[];
}
export const initialState: PayrollFilingDetailState = {
  isLoading: false,
  standardIndustrialClassificationLevels: undefined,
  tradeClassificationGroups: []
}
const payrollFilingDetailReducer = createReducer(
  initialState,
  on(getTradeClassificationGroupsSuccessAction, (state, action) => {
    return Object.assign({}, state, { tradeClassificationGroups: action.response });
  }),
  on(getFilingdetailsSetupSuccessAction, (state, action) => {
    return Object.assign({}, state, { standardIndustrialClassificationLevels: action.response });
  })
);
export function PayrollFilingDetailReducer(state: PayrollFilingDetailState, action: Action) {
  return payrollFilingDetailReducer(state, action);
}
