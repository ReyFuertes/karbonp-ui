import { createAction, props } from "@ngrx/store";

import { IMonthlySettingReport, IPayloadReport, IReportDataResponse, IReportResponse, ISaveTemplateReportPayload, ISaveTemplateReportReponse } from "../reports.model";
import { ICommonResponse } from "src/app/models/generic.model";
import { IEmployeeSkillsEquity } from "../../employee/employee.model";

export enum ReportsTypes {
  getBalancesReportsAction = '[Reports] get balances report',
  getBalancesReportsSuccessAction = '[Reports] get balances report (success)',
  downloadBalanceReportsAction = '[Reports] download balances report',
  downloadBalanceReportsSuccessAction = '[Reports] download balances report (success)',
  clearDownloadedBalanceReportsAction = '[Reports] clear downloaded balances report',
  getSkillsEquityReportReportsAction = '[Reports] get skills equity report',
  getSkillsEquityReportReportsSuccessAction = '[Reports] get skills equity report (success)',
  downloadSkillsEquityReportReportsAction = '[Reports] downloaded skills equity report',
  downloadSkillsEquityReportReportsSuccessAction = '[Reports] downloaded skills equity report (success)',
  getInformationReportsAction = '[Reports] get information report',
  getInformationReportsSuccessAction = '[Reports] get information report (success)',
  clearDownloadedInformationReportsAction = '[Reports] clear downloaded information report',
  downloadInformationReportsAction = '[Reports] download information report',
  downloadInformationReportsSuccessAction = '[Reports] download information report (success)',
  getETIReportsAction = '[Reports] get ETI report',
  getETIReportsSuccessAction = '[Reports] get ETI report (success)',
  clearDownloadedETIReportsAction = '[Reports] clear downloaded eti report',
  downloadETIReportsAction = '[Reports] download ETI report',
  downloadETIReportsSuccessAction = '[Reports] download ETI report (success)',
  getCurrentTaxPeriodAction = '[Reports] get current tax period',
  getCurrentTaxPeriodSuccessAction = '[Reports] get current tax period (success)',
  getReportsColumnAction = '[Reports] get reports column',
  getReportsColumnSuccessAction = '[Reports] get reports column (success)',
  getReportsDetailedPayrollTemplatesAction = '[Reports] get reports detailed payroll templates',
  getReportsDetailedPayrollTemplatesSuccessAction = '[Reports] get reports detailed payroll templates (success)',
  getReportsDataAction = '[Reports] get reports data',
  getReportsDataSuccessAction = '[Reports] get reports data (success)',
  downloadDetailedReportsAction = '[Reports] download detailed report',
  downloadDetailedReportsSuccessAction = '[Reports] download detailed report (success)',
  clearDownloadedDetailedReportsAction = '[Reports] clear downloaded detailed report',
  saveTemplateReportsAction = '[Reports] get template reports',
  saveTemplateReportsSuccessAction = '[Reports] get template reports (success)',
  getMonthlySettingReportsAction = '[Reports] get monthly settings reports',
  getMonthlySettingReportsSuccessAction = '[Reports] get monthly settings reports (success)',
  saveMonthlySettingReportsAction = '[Reports] save monthly settings reports',
  saveMonthlySettingReportsSuccessAction = '[Reports] save monthly settings reports (success)',
}
export const saveMonthlySettingReportsAction = createAction(
  ReportsTypes.saveMonthlySettingReportsAction,
  props<{ payload: IMonthlySettingReport }>()
);
export const saveMonthlySettingReportsSuccessAction = createAction(
  ReportsTypes.saveMonthlySettingReportsSuccessAction,
  props<{ response: IMonthlySettingReport }>()
);
export const getMonthlySettingReportsAction = createAction(
  ReportsTypes.getMonthlySettingReportsAction
);
export const getMonthlySettingReportsSuccessAction = createAction(
  ReportsTypes.getMonthlySettingReportsSuccessAction,
  props<{ response: IMonthlySettingReport }>()
);
export const saveTemplateReportsAction = createAction(
  ReportsTypes.saveTemplateReportsAction,
  props<{ payload: ISaveTemplateReportPayload }>()
);
export const saveTemplateReportsSuccessAction = createAction(
  ReportsTypes.saveTemplateReportsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const clearDownloadedDetailedReportsAction = createAction(
  ReportsTypes.clearDownloadedDetailedReportsAction
);
export const downloadDetailedReportsAction = createAction(
  ReportsTypes.downloadDetailedReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const downloadDetailedReportsSuccessAction = createAction(
  ReportsTypes.downloadDetailedReportsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getReportsDataAction = createAction(
  ReportsTypes.getReportsDataAction,
  props<{ payload: IPayloadReport }>()
);
export const getReportsDataSuccessAction = createAction(
  ReportsTypes.getReportsDataSuccessAction,
  props<{ response: IReportDataResponse }>()
);
export const getReportsDetailedPayrollTemplatesAction = createAction(
  ReportsTypes.getReportsDetailedPayrollTemplatesAction
);
export const getReportsDetailedPayrollTemplatesSuccessAction = createAction(
  ReportsTypes.getReportsDetailedPayrollTemplatesSuccessAction,
  props<{ response: ISaveTemplateReportReponse[] }>()
);
export const getReportsColumnAction = createAction(
  ReportsTypes.getReportsColumnAction
);
export const getReportsColumnSuccessAction = createAction(
  ReportsTypes.getReportsColumnSuccessAction,
  props<{ response: string[] }>()
);
export const getCurrentTaxPeriodAction = createAction(
  ReportsTypes.getCurrentTaxPeriodAction
);
export const getCurrentTaxPeriodSuccessAction = createAction(
  ReportsTypes.getCurrentTaxPeriodSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const downloadETIReportsAction = createAction(
  ReportsTypes.downloadETIReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const downloadETIReportsSuccessAction = createAction(
  ReportsTypes.downloadETIReportsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const clearDownloadedETIReportsAction = createAction(
  ReportsTypes.clearDownloadedETIReportsAction
);
export const getETIReportsAction = createAction(
  ReportsTypes.getETIReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const getETIReportsSuccessAction = createAction(
  ReportsTypes.getETIReportsSuccessAction,
  props<{ response: IReportResponse }>()
);
export const downloadInformationReportsAction = createAction(
  ReportsTypes.downloadInformationReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const downloadInformationReportsSuccessAction = createAction(
  ReportsTypes.downloadInformationReportsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const clearDownloadedInformationReportsAction = createAction(
  ReportsTypes.clearDownloadedInformationReportsAction
);
export const getInformationReportsAction = createAction(
  ReportsTypes.getInformationReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const getInformationReportsSuccessAction = createAction(
  ReportsTypes.getInformationReportsSuccessAction,
  props<{ response: IReportResponse[] }>()
);
export const getSkillsEquityReportReportsAction = createAction(
  ReportsTypes.getSkillsEquityReportReportsAction,
  props<{ payload: any }>()
);
export const getSkillsEquityReportReportsSuccessAction = createAction(
  ReportsTypes.getSkillsEquityReportReportsSuccessAction,
  props<{ response: IEmployeeSkillsEquity[] }>()
);
export const downloadSkillsEquityReportReportsAction = createAction(
  ReportsTypes.downloadSkillsEquityReportReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const downloadSkillsEquityReportReportsSuccessAction = createAction(
  ReportsTypes.downloadSkillsEquityReportReportsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const clearDownloadedBalanceReportsAction = createAction(
  ReportsTypes.clearDownloadedBalanceReportsAction
);
export const downloadBalanceReportsAction = createAction(
  ReportsTypes.downloadBalanceReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const downloadBalanceReportsSuccessAction = createAction(
  ReportsTypes.downloadBalanceReportsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getBalancesReportsAction = createAction(
  ReportsTypes.getBalancesReportsAction,
  props<{ payload: IPayloadReport }>()
);
export const getBalancesReportsSuccessAction = createAction(
  ReportsTypes.getBalancesReportsSuccessAction,
  props<{ response: IReportResponse }>()
);