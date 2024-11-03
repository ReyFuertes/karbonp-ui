import { Action, createReducer, on } from "@ngrx/store";

import { clearDownloadedBalanceReportsAction, downloadBalanceReportsSuccessAction, getBalancesReportsSuccessAction, downloadSkillsEquityReportReportsSuccessAction, getSkillsEquityReportReportsSuccessAction, getSkillsEquityReportReportsAction, clearDownloadedInformationReportsAction, getInformationReportsSuccessAction, getInformationReportsAction, downloadInformationReportsSuccessAction, getBalancesReportsAction, clearDownloadedETIReportsAction, getETIReportsAction, getETIReportsSuccessAction, getCurrentTaxPeriodSuccessAction, getReportsColumnSuccessAction, getReportsDetailedPayrollTemplatesSuccessAction, getReportsDataSuccessAction, getReportsDataAction, downloadDetailedReportsSuccessAction, clearDownloadedDetailedReportsAction, getMonthlySettingReportsSuccessAction, saveMonthlySettingReportsAction, saveMonthlySettingReportsSuccessAction } from "./reports.action";
import { IMonthlySettingReport, IPayloadReport, IReportDataResponse, IReportResponse, ISaveTemplateReportReponse } from "../reports.model";
import { IEmployeeSkillsEquity } from "../../employee/employee.model";
import { GenericState } from "src/app/store/app.reducer";
import { ITaxPeriodDate } from "src/app/models/generic.model";

export interface ReportsState extends GenericState {
  balancesReports: IPayloadReport[];
  downloadedBalancesReport: any;
  skillsEquityReport: IEmployeeSkillsEquity[];
  downloadedSkillsEquityReport: any;
  downloadedInformationReport: any;
  informationReport: IReportResponse[];
  downloadedETIReport: any;
  eTIReport: IReportResponse[];
  taxPeriodDate: ITaxPeriodDate;
  detailedReportColumns: string[];
  reportData: IReportDataResponse;
  downloadedDetailedReport: any;
  detailedReportTemplates: ISaveTemplateReportReponse[];
  monthlySettings: IMonthlySettingReport
}
export const initialState: ReportsState = {
  isLoading: false,
  balancesReports: [],
  downloadedBalancesReport: undefined,
  skillsEquityReport: [],
  downloadedSkillsEquityReport: undefined,
  downloadedInformationReport: undefined,
  informationReport: [],
  downloadedETIReport: undefined,
  eTIReport: [],
  taxPeriodDate: undefined,
  detailedReportColumns: [],
  reportData: undefined,
  downloadedDetailedReport: undefined,
  detailedReportTemplates: [],
  monthlySettings: undefined
};

const reportsReducer = createReducer(
  initialState,
  on(saveMonthlySettingReportsAction, (state) => {
    return Object.assign({}, state, { isLoading: true })
  }),
  on(saveMonthlySettingReportsSuccessAction, (state) => {
    return Object.assign({}, state, { isLoading: false })
  }),
  on(getMonthlySettingReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { monthlySettings: action.response })
  }),
  on(clearDownloadedDetailedReportsAction, (state) => {
    return Object.assign({}, state, { downloadedDetailedReport: undefined })
  }),
  on(downloadDetailedReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedDetailedReport: action.response })
  }),
  on(getReportsDataAction, (state) => {
    return Object.assign({}, state, { isLoading: true })
  }),
  on(getReportsDataSuccessAction, (state, action) => {
    return Object.assign({}, state, { reportData: action.response, isLoading: false })
  }),
  on(getReportsDetailedPayrollTemplatesSuccessAction, (state, action) => {
    return Object.assign({}, state, { detailedReportTemplates: action.response })
  }),
  on(getReportsColumnSuccessAction, (state, action) => {
    return Object.assign({}, state, { detailedReportColumns: action.response })
  }),
  on(getCurrentTaxPeriodSuccessAction, (state, action) => {
    return Object.assign({}, state, { taxPeriodDate: action.response })
  }),
  on(getETIReportsAction, (state) => {
    return Object.assign({}, state, { isLoading: true })
  }),
  on(getETIReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { eTIReport: action.response, isLoading: false })
  }),
  on(clearDownloadedETIReportsAction, (state) => {
    return Object.assign({}, state, { downloadedETIReport: undefined })
  }),
  on(downloadInformationReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedInformationReport: action.response })
  }),
  on(getInformationReportsAction, (state) => {
    return Object.assign({}, state, { isLoading: true })
  }),
  on(getInformationReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { informationReport: action.response, isLoading: false })
  }),
  on(clearDownloadedInformationReportsAction, (state) => {
    return Object.assign({}, state, { downloadedBalancesReport: undefined })
  }),
  on(downloadSkillsEquityReportReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedSkillsEquityReport: action.response })
  }),
  on(getSkillsEquityReportReportsAction, (state) => {
    return Object.assign({}, state, { isLoading: true })
  }),
  on(getSkillsEquityReportReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { skillsEquityReport: action.response, isLoading: false })
  }),
  on(clearDownloadedBalanceReportsAction, (state) => {
    return Object.assign({}, state, { downloadedBalancesReport: undefined })
  }),
  on(downloadBalanceReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { downloadedBalancesReport: action.response })
  }),
  on(getBalancesReportsAction, (state) => {
    return Object.assign({}, state, { isLoading: true })
  }),
  on(getBalancesReportsSuccessAction, (state, action) => {
    return Object.assign({}, state, { balancesReports: action.response, isLoading: false })
  })
);
export function ReportsReducer(state: ReportsState, action: Action) {
  return reportsReducer(state, action);
}