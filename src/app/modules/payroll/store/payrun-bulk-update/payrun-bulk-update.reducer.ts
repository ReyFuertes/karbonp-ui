import { Action, createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import { IPayrollSetup, IPayrunBulkUpdateOption } from "../../payroll.model";
import { IEmployee } from "src/app/modules/employee/employee.model";
import { downloadBulkHoursUpdateExcelSuccessAction, downloadBulkUpdateExcelSuccessAction, getBulkPayRunUpdateOptionsSuccessAction, getPayrollSetupDataSuccessAction, getPayRunBulkImportViewSuccessAction, getPayRunEmployeeDataAction, getPayRunEmployeeDataSuccessAction } from "./payrun-bulk-update.action";

export interface PayrollPayrunBulkUpdateState extends EntityState<IEmployee> {
  isLoading: boolean;
  totalCount: number;
  payrollSetupData: IPayrollSetup;
  downloadedBulkImportFile: any; //note: no proper modal
  bulkImportView: any;
  bulkPayRunUpdateOption: IPayrunBulkUpdateOption;
  downloadedBulkHoursImportFile: any; //note: no proper modal
  bulkHoursImportView: any;
}
export const adapter: EntityAdapter<IEmployee> = createEntityAdapter<IEmployee>({
});
export const initialState: PayrollPayrunBulkUpdateState = adapter.getInitialState({
  isLoading: false,
  totalCount: 0,
  payrollSetupData: undefined,
  downloadedBulkImportFile: undefined,
  bulkImportView: undefined,
  bulkPayRunUpdateOption: undefined,
  downloadedBulkHoursImportFile: undefined,
  bulkHoursImportView: undefined
})
const payrollPayrunBulkUpdateReducer = createReducer(
  initialState,
  on(getPayRunBulkImportViewSuccessAction, (state, action) => {
    return Object.assign({}, state, { bulkHoursImportView: action.response?.data });
  }),
  on(downloadBulkHoursUpdateExcelSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedBulkHoursImportFile: action.response });
  }),
  on(getBulkPayRunUpdateOptionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { bulkPayRunUpdateOption: action.response?.data });
  }),
  on(getPayRunBulkImportViewSuccessAction, (state, action) => {
    return Object.assign({}, state, { bulkImportView: action.response?.data });
  }),
  on(downloadBulkUpdateExcelSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedBulkImportFile: action.response });
  }),
  on(getPayrollSetupDataSuccessAction, (state, action) => {
    return Object.assign({}, state, { payrollSetupData: action?.response?.data });
  }),
  on(getPayRunEmployeeDataAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getPayRunEmployeeDataSuccessAction, (state, action) => {
    const entities = action?.response.map(entity => Object.assign({}, entity, { id: entity.employeeId }))
    return ({ ...adapter.setAll(entities, state), isLoading: false })
  })
);
export function PayrollPayrunBulkUpdateReducer(state: PayrollPayrunBulkUpdateState, action: Action) {
  return payrollPayrunBulkUpdateReducer(state, action);
}
