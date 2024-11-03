import { Action, createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { IPayrunCompleted } from "../../payroll.model";
import { generatePayRunExcelExportSuccessAction, getPayrunCompletedAction, getPayrunCompletedSuccessAction } from "./payroll-payruns-completed.action";

export interface PayrollPayrunCompletedState extends EntityState<IPayrunCompleted> {
  isLoading: boolean;
  payRunCompletetotalCount: number;
  downloadedPayRunExcelExport: any; //no proper model
  downloadedPayRunPdfExport: any; //no proper model
}
export const adapter: EntityAdapter<IPayrunCompleted> = createEntityAdapter<IPayrunCompleted>({
});
export const initialState: PayrollPayrunCompletedState = adapter.getInitialState({
  isLoading: false,
  payRunCompletetotalCount: 0,
  downloadedPayRunExcelExport: undefined,
  downloadedPayRunPdfExport: undefined
})
const payrollPayrunCompletedReducer = createReducer(
  initialState,
  on(generatePayRunExcelExportSuccessAction, (state, action) => {
    const downloadedPayRunPdfExport = new Map<number, any>();
    downloadedPayRunPdfExport.set(action.payRunId, { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedPayRunPdfExport });
  }),
  on(generatePayRunExcelExportSuccessAction, (state, action) => {
    const downloadedPayRunExcelExport = new Map<number, any>();
    downloadedPayRunExcelExport.set(action.payRunId, { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedPayRunExcelExport });
  }),
  on(getPayrunCompletedAction, (state) => {
    if (state.isLoading)
      return Object.assign({}, state, { isLoading: true });
    else
      return state;
  }),
  on(getPayrunCompletedSuccessAction, (state, action) => {
    return Object.assign({
      ...adapter.setAll(action.response?.items || [], state),
      isFilterLoading: false,
      payRunCompletetotalCount: action.response?.totalItems
    })
  })
);
export function PayrollPayrunCompletedReducer(state: PayrollPayrunCompletedState, action: Action) {
  return payrollPayrunCompletedReducer(state, action);
}
