import { createAction, props } from "@ngrx/store";

import { ICommonResponse, IPaginationPayload } from "src/app/models/generic.model";
import { IPayrunCompleted } from "../../payroll.model";

export enum PayrollPayrunCompletedTypes {
  getPayrunCompletedAction = '[Payroll payrun completed] get pay runs in completed',
  getPayrunCompletedSuccessAction = '[Payroll payrun completed] get pay runs in completed (success)',
  generatePayRunExcelExportAction = '[Payroll payrun completed] generate payrun excel export',
  generatePayRunExcelExportSuccessAction = '[Payroll payrun completed] generate payrun excel export (success)',
  generatePayRunPDFExportAction = '[Payroll payrun completed] generate payrun pdf export',
  generatePayRunPDFExportSuccessAction = '[Payroll payrun completed] generate payrun pdf export (success)',
  undoPayRunCompletePayrunAction = '[Payroll payrun completed] undo pay run complete payrun',
  undoPayRunCompletePayrunSuccessAction = '[Payroll payrun completed] undo pay run complete payrun (success)',
  
}
export const undoPayRunCompletePayrunAction = createAction(
  PayrollPayrunCompletedTypes.undoPayRunCompletePayrunAction,
  props<{ payRunId: number }>()
);
export const undoPayRunCompletePayrunSuccessAction = createAction(
  PayrollPayrunCompletedTypes.undoPayRunCompletePayrunSuccessAction,
  props<{ response: ICommonResponse, payRunId: number }>()
);
export const generatePayRunPDFExportAction = createAction(
  PayrollPayrunCompletedTypes.generatePayRunPDFExportAction,
  props<{ payRunId: number, cultureLang: string, methodType: string }>()
);
export const generatePayRunPDFExportSuccessAction = createAction(
  PayrollPayrunCompletedTypes.generatePayRunPDFExportSuccessAction,
  props<{ response: ICommonResponse, payRunId: number }>()
);
export const generatePayRunExcelExportAction = createAction(
  PayrollPayrunCompletedTypes.generatePayRunExcelExportAction,
  props<{ payRunId: number, cultureLang: string, methodType: string }>()
);
export const generatePayRunExcelExportSuccessAction = createAction(
  PayrollPayrunCompletedTypes.generatePayRunExcelExportSuccessAction,
  props<{ response: ICommonResponse, payRunId: number }>()
);
export const getPayrunCompletedAction = createAction(
  PayrollPayrunCompletedTypes.getPayrunCompletedAction,
  props<{ payload: IPaginationPayload }>()
);
export const getPayrunCompletedSuccessAction = createAction(
  PayrollPayrunCompletedTypes.getPayrunCompletedSuccessAction,
  props<{ response: { items: IPayrunCompleted[], totalItems: number } }>()
);