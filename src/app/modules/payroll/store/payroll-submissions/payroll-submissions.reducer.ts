import { Action, createReducer, on } from "@ngrx/store";

import { GenericState } from "src/app/store/app.reducer";
import { IFillingSetup, IIncomeAndBenefitTypes, IIrp5Summission, IMonthlyEmp201Submission, IMonthlyUifSubmission, IPhilippinesSubmission, IPhilippinesSubmittion1601C, ITaxSeason, IValidateIRP5IT3ASubmission } from "../../payroll.model";
import { getPayrollTaxSubmissionsSuccessAction, getPayrollMonthlyEmp201SubmissionsSuccessAction, getPayrollMonthlyUIFSubmissionsSuccessAction, getAnnualIRP5IT3ASubmissionsSuccessAction, getIncomeAndBenefitTypesSubmissionsSuccessAction, getPhilippinesMonthlySubmissionsSuccessAction, downloadPhilippinesSubmissionsSuccessAction, get1601CDataSubmissionsSuccessAction, generateUser1601CPDFSubmissionsSuccessAction, generateEMP201PdfSubmissionsSuccessAction, generateUIFPDFSubmissionsSuccessAction, filingDetailsSetupSubmissionsSuccessAction, generateIRP5IT3ASubmissionsSuccessAction, getEmployeesWithPayRunDataSubmissionsSuccessAction, generateAnnualizationReportSubmissionsSuccessAction, generateAlphalistSchedule1ReportSubmissionsSuccessAction, generateCOIDAReportSubmissionsSuccessAction, southAfricaRegulatedSettingsSubmissionsSuccessAction, getAnnualIRP5IT3ASubmissionsAction, generateIRP5EasyfileExportSubmissionsSuccessAction, generateEMP501PDFSubmissionsSuccessAction } from "./payroll-submissions.action";
import { IEmployee } from "src/app/modules/employee/employee.model";
import { ISouthAfricaRegulatedSetting } from "src/app/models/generic.model";

export interface PayrollSubmissionsState extends GenericState {
  monthlyEmp201Submissions: Map<number, IMonthlyEmp201Submission>;
  monthlyUifSubmissions: Map<number, IMonthlyUifSubmission>;
  taxSeasons: ITaxSeason[];
  irp5It3a: { IIrp5Summission: IIrp5Summission[], validateIRP5IT3A: IValidateIRP5IT3ASubmission[] };
  incomeAndBenefitTypes: IIncomeAndBenefitTypes;
  philippinesSubmissions: IPhilippinesSubmission[];
  downloadedMonthlyPhilippinesPdf: any;
  philippinesSubmittion1601C: IPhilippinesSubmittion1601C;
  downloadedUser1601CPDFSubmission: any;
  downloadedEMP201PdfSubmission: any;
  downloadedUIFPDFSubmission: any;
  filingDetailsSetup: IFillingSetup;
  downloadedIRP5IT3ASubmission: any;
  employeesWithPayRunData: IEmployee[];
  employeestotalCount: number;
  downloadedAnnualizationReport: any;
  alphalistSchedule1Report: any;
  downloadedCOIDAReport: any;
  southAfricaRegulatedSetting: ISouthAfricaRegulatedSetting;
  downloadedIRP5EasyfileExport: any;
  downloadedEMP501PDF: any;
}
export const initialState: PayrollSubmissionsState = {
  isLoading: false,
  monthlyEmp201Submissions: undefined,
  monthlyUifSubmissions: undefined,
  taxSeasons: [],
  irp5It3a: undefined,
  incomeAndBenefitTypes: undefined,
  philippinesSubmissions: [],
  downloadedMonthlyPhilippinesPdf: undefined,
  philippinesSubmittion1601C: undefined,
  downloadedUser1601CPDFSubmission: undefined,
  downloadedEMP201PdfSubmission: undefined,
  downloadedUIFPDFSubmission: undefined,
  filingDetailsSetup: undefined,
  downloadedIRP5IT3ASubmission: undefined,
  employeesWithPayRunData: [],
  employeestotalCount: undefined,
  downloadedAnnualizationReport: undefined,
  alphalistSchedule1Report: undefined,
  downloadedCOIDAReport: undefined,
  southAfricaRegulatedSetting: undefined,
  downloadedIRP5EasyfileExport: undefined,
  downloadedEMP501PDF: undefined
};

const payrollSubmissionsReducer = createReducer(
  initialState,
  on(generateEMP501PDFSubmissionsSuccessAction, (state, action) => {
    const downloadedEMP501PDF = new Map<string, any>();
    downloadedEMP501PDF.set(action?.keyDates,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedEMP501PDF });
  }),
  on(generateIRP5EasyfileExportSubmissionsSuccessAction, (state, action) => {
    const downloadedIRP5EasyfileExport = new Map<string, any>();
    downloadedIRP5EasyfileExport.set(action?.keyDates,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedIRP5EasyfileExport });
  }),
  on(southAfricaRegulatedSettingsSubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { southAfricaRegulatedSetting: action?.response });
  }),
  on(generateCOIDAReportSubmissionsSuccessAction, (state, action) => {
    const downloadedCOIDAReport = new Map<string, any>();
    downloadedCOIDAReport.set(action?.keyDates,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedCOIDAReport });
  }),
  on(generateAlphalistSchedule1ReportSubmissionsSuccessAction, (state, action) => {
    const alphalistSchedule1Report = new Map<string, any>();
    alphalistSchedule1Report.set(action?.keyDates,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { alphalistSchedule1Report });
  }),
  on(generateAnnualizationReportSubmissionsSuccessAction, (state, action) => {
    const downloadedAnnualizationReport = new Map<string, any>();
    downloadedAnnualizationReport.set(action?.keyDates,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedAnnualizationReport });
  }),
  on(getEmployeesWithPayRunDataSubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, {
      employeesWithPayRunData: action.response?.items || [],
      employeestotalCount: action.response?.totalItems,
    })
  }),
  on(generateIRP5IT3ASubmissionsSuccessAction, (state, action) => {
    const downloadedIRP5IT3ASubmission = new Map<number, any>();
    downloadedIRP5IT3ASubmission.set(action.employeeId,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedIRP5IT3ASubmission });
  }),
  on(filingDetailsSetupSubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { filingDetailsSetup: action?.response });
  }),
  on(generateUIFPDFSubmissionsSuccessAction, (state, action) => {
    const downloadedUIFPDFSubmission = new Map<number, any>();
    downloadedUIFPDFSubmission.set(action.submissionId,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedUIFPDFSubmission });
  }),
  on(generateEMP201PdfSubmissionsSuccessAction, (state, action) => {
    const downloadedEMP201PdfSubmission = new Map<number, any>();
    downloadedEMP201PdfSubmission.set(action.submissionId,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedEMP201PdfSubmission });
  }),
  on(generateUser1601CPDFSubmissionsSuccessAction, (state, action) => {
    const downloadedUser1601CPDFSubmission = new Map<string, any>();
    downloadedUser1601CPDFSubmission.set(action.submissionMonth,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedUser1601CPDFSubmission });
  }),
  on(get1601CDataSubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { philippinesSubmittion1601C: action?.response?.data });
  }),
  on(get1601CDataSubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { philippinesSubmittion1601C: action?.response?.data });
  }),
  on(downloadPhilippinesSubmissionsSuccessAction, (state, action) => {
    const downloadedMonthlyPhilippinesPdf = new Map<string, any>();
    downloadedMonthlyPhilippinesPdf.set(`${action?.submissionDocumentType}_${action.reportDate}`,
      { data: { file: action.response?.data } })
    return Object.assign({}, state, { downloadedMonthlyPhilippinesPdf });
  }),
  on(getPhilippinesMonthlySubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { philippinesSubmissions: action?.response?.data });
  }),
  on(getIncomeAndBenefitTypesSubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { incomeAndBenefitTypes: action?.response?.data });
  }),
  on(getAnnualIRP5IT3ASubmissionsAction, (state) => {
    return Object.assign({}, state, { isLoading: true });
  }),
  on(getAnnualIRP5IT3ASubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { irp5It3a: action?.response, isLoading: false });
  }),
  on(getPayrollTaxSubmissionsSuccessAction, (state, action) => {
    return Object.assign({}, state, { taxSeasons: action?.response });
  }),
  on(getPayrollMonthlyUIFSubmissionsSuccessAction, (state, action) => {
    const monthlyUifSubmissions = new Map<number, IMonthlyUifSubmission>();
    action.response?.forEach(response => {
      monthlyUifSubmissions.set(response.uifSubmission?.id, response)
    });
    return Object.assign({}, state, { monthlyUifSubmissions });
  }),
  on(getPayrollMonthlyEmp201SubmissionsSuccessAction, (state, action) => {
    const monthlyEmp201Submissions = new Map<number, IMonthlyEmp201Submission>();
    action.response?.forEach(response => {
      monthlyEmp201Submissions.set(response.emP201Submission?.id, response)
    });
    return Object.assign({}, state, { monthlyEmp201Submissions });
  }),
);
export function PayrollSubmissionsReducer(state: PayrollSubmissionsState, action: Action) {
  return payrollSubmissionsReducer(state, action);
}
