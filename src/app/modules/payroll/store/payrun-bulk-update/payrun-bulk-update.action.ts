import { createAction, props } from "@ngrx/store";

import { ICommonResponse } from "src/app/models/generic.model";
import { IEmployee } from "src/app/modules/employee/employee.model";

export enum PayrunBulkUpdateypes {
  getPayrollSetupDataAction = '[Payroll payrun bulk-update] get payroll setup data',
  getPayrollSetupDataSuccessAction = '[Payroll payrun bulk-update] get payroll setup data (success)',
  getPayRunEmployeeDataAction = '[Payroll payrun bulk-update] get payrun employee data',
  getPayRunEmployeeDataSuccessAction = '[Payroll payrun bulk-update] get payrun employee data (success)',
  applyBulkPayRunUpdateAction = '[Payroll payrun bulk-update] apply bulk payrun update',
  applyBulkPayRunUpdateSuccessAction = '[Payroll payrun bulk-update] apply bulk payrun update (success)',
  downloadBulkUpdateExcelAction = '[Payroll payrun bulk-update] download bulk update excel',
  downloadBulkUpdateExcelSuccessAction = '[Payroll payrun bulk-update] download bulk update excel (success)',
  uploadPayrollBulkImportUpdateAction = '[Payroll payrun bulk-update] bulk import payroll payRun update',
  uploadPayrollBulkImportUpdateSuccessAction = '[Payroll payrun bulk-update] bulk import payroll payRun update (success)',
  getPayRunBulkImportViewAction = '[Payroll payrun bulk-update] get pay run bulk import view',
  getPayRunBulkImportViewSuccessAction = '[Payroll payrun bulk-update] get pay run bulk import view (success)',
  getBulkPayRunUpdateOptionsAction = '[Payroll payrun bulk-update] get bulk payrun update options',
  getBulkPayRunUpdateOptionsSuccessAction = '[Payroll payrun bulk-update] get bulk payrun update options (success)',
  downloadBulkHoursUpdateExcelAction = '[Payroll payrun bulk-update] download bulk hours update excel',
  downloadBulkHoursUpdateExcelSuccessAction = '[Payroll payrun bulk-update] download bulk hours update excel (success)',
  getPayRunBulkHoursImportViewAction = '[Payroll payrun bulk-update] get pay run bulk hours import view',
  getPayRunBulkHoursImportViewSuccessAction = '[Payroll payrun bulk-update] get pay run bulk hours import view (success)',
}
export const getPayRunBulkHoursImportViewAction = createAction(
  PayrunBulkUpdateypes.getPayRunBulkHoursImportViewAction,
  props<{ payRunId: number }>()
);
export const getPayRunBulkHoursImportViewSuccessAction = createAction(
  PayrunBulkUpdateypes.getPayRunBulkHoursImportViewSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const downloadBulkHoursUpdateExcelAction = createAction(
  PayrunBulkUpdateypes.downloadBulkHoursUpdateExcelAction,
  props<{ payload: { employeeIds: number[], language: string, payPointIds: number[], payRunId: number } }>()
);
export const downloadBulkHoursUpdateExcelSuccessAction = createAction(
  PayrunBulkUpdateypes.downloadBulkHoursUpdateExcelSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getBulkPayRunUpdateOptionsAction = createAction(
  PayrunBulkUpdateypes.getBulkPayRunUpdateOptionsAction,
  props<{ payRunId: number }>()
);
export const getBulkPayRunUpdateOptionsSuccessAction = createAction(
  PayrunBulkUpdateypes.getBulkPayRunUpdateOptionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayRunBulkImportViewAction = createAction(
  PayrunBulkUpdateypes.getPayRunBulkImportViewAction,
  props<{ payRunId: number }>()
);
export const getPayRunBulkImportViewSuccessAction = createAction(
  PayrunBulkUpdateypes.getPayRunBulkImportViewSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const uploadPayrollBulkImportUpdateAction = createAction(
  PayrunBulkUpdateypes.uploadPayrollBulkImportUpdateAction,
  props<{ payload: { file: string, reCalculatePayslips: boolean, isHoursImport: boolean }, payRunId: number }>()
);
export const uploadPayrollBulkImportUpdateSuccessAction = createAction(
  PayrunBulkUpdateypes.uploadPayrollBulkImportUpdateSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const downloadBulkUpdateExcelAction = createAction(
  PayrunBulkUpdateypes.downloadBulkUpdateExcelAction,
  props<{ payload: { employeeIds: number[], language: string, payPointIds: number[], payRunId: number } }>()
);
export const downloadBulkUpdateExcelSuccessAction = createAction(
  PayrunBulkUpdateypes.downloadBulkUpdateExcelSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const applyBulkPayRunUpdateAction = createAction(
  PayrunBulkUpdateypes.applyBulkPayRunUpdateAction,
  props<{ payload: IEmployee[], payRunId: number }>()
);
export const applyBulkPayRunUpdateSuccessAction = createAction(
  PayrunBulkUpdateypes.applyBulkPayRunUpdateSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getPayRunEmployeeDataAction = createAction(
  PayrunBulkUpdateypes.getPayRunEmployeeDataAction,
  props<{ payload: { employeeIds: number[], language: string, payPointIds: number[], payRunId: number } }>()
);
export const getPayRunEmployeeDataSuccessAction = createAction(
  PayrunBulkUpdateypes.getPayRunEmployeeDataSuccessAction,
  props<{ response: IEmployee[] }>()
);
export const getPayrollSetupDataAction = createAction(
  PayrunBulkUpdateypes.getPayrollSetupDataAction,
  props<{ payRunId: number }>()
);
export const getPayrollSetupDataSuccessAction = createAction(
  PayrunBulkUpdateypes.getPayrollSetupDataSuccessAction,
  props<{ response: ICommonResponse }>()
);