import { createAction, props } from "@ngrx/store";

import { ICommonResponse } from "src/app/models/generic.model";
import { IFillingSetup, IStandardIndustrialClassificationLevel } from "../../payroll.model";

export enum PayrollFilingDetailTypes {
  getFilingdetailsSetupAction = '[Payroll filing details] get filing details setup',
  getFilingdetailsSetupSuccessAction = '[Payroll filing details] get filing details setup (success)',
  getTradeClassificationGroupsAction = '[Payroll filing details] get trade classification groups',
  getTradeClassificationGroupsSuccessAction = '[Payroll filing details] get trade classification groups (success)',
  getTradeClassificationsAction = '[Payroll filing details] get trade classifications',
  getTradeClassificationsSuccessAction = '[Payroll filing details] get trade classifications (success)',
  saveFilingdetailsSetupAction = '[Payroll filing details] save filing details setup',
  saveFilingdetailsSetupSuccessAction = '[Payroll filing details] save filing details setup (success)',
}
export const saveFilingdetailsSetupAction = createAction(
  PayrollFilingDetailTypes.saveFilingdetailsSetupAction,
  props<{ payload: IFillingSetup }>()
);
export const saveFilingdetailsSetupSuccessAction = createAction(
  PayrollFilingDetailTypes.saveFilingdetailsSetupSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getTradeClassificationsAction = createAction(
  PayrollFilingDetailTypes.getTradeClassificationsAction,
  props<{ payload: { implementSortingAndPaging: false, tradeClassificationGroupId: 25, tradeClassificationId: null } }>()
);
export const getTradeClassificationsSuccessAction = createAction(
  PayrollFilingDetailTypes.getTradeClassificationsSuccessAction,
  props<{ response: IStandardIndustrialClassificationLevel[] }>()
);
export const getTradeClassificationGroupsAction = createAction(
  PayrollFilingDetailTypes.getTradeClassificationGroupsAction,
  props<{ payload: { implementSortingAndPaging: boolean } }>()
);
export const getTradeClassificationGroupsSuccessAction = createAction(
  PayrollFilingDetailTypes.getTradeClassificationGroupsSuccessAction,
  props<{ response: IStandardIndustrialClassificationLevel[] }>()
);
export const getFilingdetailsSetupAction = createAction(
  PayrollFilingDetailTypes.getFilingdetailsSetupAction
);
export const getFilingdetailsSetupSuccessAction = createAction(
  PayrollFilingDetailTypes.getFilingdetailsSetupSuccessAction,
  props<{ response: Map<number, IStandardIndustrialClassificationLevel> }>()
);