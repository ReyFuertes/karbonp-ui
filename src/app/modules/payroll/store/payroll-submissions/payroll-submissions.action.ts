import { createAction, props } from "@ngrx/store";

import { ICoidaReport, IFillingSetup, IIrp5Summission, IMonthlyEmp201Submission, IMonthlyUifSubmission, IPhilippinesSubmittion1601C, ITaxSeason, IValidateIRP5IT3ASubmission } from "../../payroll.model";
import { ICommonResponse, IPaginationPayload } from "src/app/models/generic.model";
import { IEmployee } from "src/app/modules/employee/employee.model";

export enum PayrollSubmissionsTypes {
  getPayrollMonhtlyEmp201SubmissionsAction = '[Payroll submission] get monthly emp 201 submissions',
  getPayrollMonthlyEmp201SubmissionsSuccessAction = '[Payroll submission] get monthly emp 201 submissions (success)',
  getPayrollMonthlyUIFSubmissionsAction = '[Payroll submission] get monthly uif submissions',
  getPayrollMonthlyUIFSubmissionsSuccessAction = '[Payroll submission] get monthly uif submissions (success)',
  getPayrollTaxSubmissionsAction = '[Payroll submission] get annual tax seasons submissions',
  getPayrollTaxSubmissionsSuccessAction = '[Payroll submission] get annual tax seasons submissions (success)',
  getAnnualIRP5IT3ASubmissionsAction = '[Payroll submission] get annual irp5 it3 submissions',
  getAnnualIRP5IT3ASubmissionsSuccessAction = '[Payroll submission] get annual irp5 it3 submissions (success)',
  getIncomeAndBenefitTypesSubmissionsAction = '[Payroll submission] get income and benefit types submissions',
  getIncomeAndBenefitTypesSubmissionsSuccessAction = '[Payroll submission] get income and benefit types submissions (success)',
  getPhilippinesMonthlySubmissionsAction = '[Payroll submission] get philippines monthly submissions',
  getPhilippinesMonthlySubmissionsSuccessAction = '[Payroll submission] get philippines monthly submissions (success)',
  downloadPhilippinesSubmissionsAction = '[Payroll submission] download philippines monthly submissions',
  downloadPhilippinesSubmissionsSuccessAction = '[Payroll submission] download philippines monthly submissions (success)',
  get1601CDataSubmissionsAction = '[Payroll submission] get 1601C data submissions',
  get1601CDataSubmissionsSuccessAction = '[Payroll submission] get 1601C data submissions (success)',
  generateUser1601CPDFSubmissionsAction = '[Payroll submission] generate user 1601C pdf submissions',
  generateUser1601CPDFSubmissionsSuccessAction = '[Payroll submission] generate user 1601C pdf submissions (success)',
  generateEMP201PdfSubmissionsAction = '[Payroll submission] generate emp 201 pdf submissions',
  generateEMP201PdfSubmissionsSuccessAction = '[Payroll submission] generate emp 201 pdf submissions (success)',
  completeEMP201SubmissionsAction = '[Payroll submission] complete emp201 submissions',
  completeEMP201SubmissionsSuccessAction = '[Payroll submission] complete emp201 submissions (success)',
  submitUIFSubmissionsAction = '[Payroll submission] submit UIF submission submissions',
  submitUIFSubmissionsSuccessAction = '[Payroll submission] submit UIF submission submissions (success)',
  generateUIFPDFSubmissionsAction = '[Payroll submission] generate UIF pdf submissions',
  generateUIFPDFSubmissionsSuccessAction = '[Payroll submission] generate UIF pdf submissions (success)',
  filingDetailsSetupSubmissionsAction = '[Payroll submission] filing details setup submissions',
  filingDetailsSetupSubmissionsSuccessAction = '[Payroll submission] filing details setup submissions (success)',
  generateIRP5IT3ASubmissionsAction = '[Payroll submission] generate IRP5IT3A submissions',
  generateIRP5IT3ASubmissionsSuccessAction = '[Payroll submission] generate IRP5IT3A submissions (success)',
  getEmployeesWithPayRunDataSubmissionsAction = '[Payroll submission] get employees with payRun data submissions',
  getEmployeesWithPayRunDataSubmissionsSuccessAction = '[Payroll submission] get employees with payRun data submissions (success)',
  generateAnnualizationReportSubmissionsAction = '[Payroll submission] generate annualization report submissions',
  generateAnnualizationReportSubmissionsSuccessAction = '[Payroll submission] generate annualization report submissions (success)',
  generateAlphalistSchedule1ReportSubmissionsAction = '[Payroll submission] generate alphalist schedule1 report submissions',
  generateAlphalistSchedule1ReportSubmissionsSuccessAction = '[Payroll submission] generate alphalist schedule1 report submissions (success)',
  generateCOIDAReportSubmissionsAction = '[Payroll submission] generate cOIDA report submissions',
  generateCOIDAReportSubmissionsSuccessAction = '[Payroll submission] generate cOIDA report submissions (success)',
  southAfricaRegulatedSettingsSubmissionsAction = '[Payroll submission] south africa regulated settings submissions',
  southAfricaRegulatedSettingsSubmissionsSuccessAction = '[Payroll submission] submission] south africa regulated settings submissions (success)',
  validateIRP5IT3ASubmissionsAction = '[Payroll submission] validate IRP5IT3A submissions',
  validateIRP5IT3ASubmissionsSuccessAction = '[Payroll submission] submission] validate IRP5IT3A submissions (success)',
  finalizeIRP5IT3ASubmissionsAction = '[Payroll submission] finalize IRP5IT3A submissions',
  finalizeIRP5IT3ASubmissionsSuccessAction = '[Payroll submission] submission] finalize IRP5IT3A submissions (success)',
  generateIRP5EasyfileExportSubmissionsAction = '[Payroll submission] generate IRP5 easyfile export submissions',
  generateIRP5EasyfileExportSubmissionsSuccessAction = '[Payroll submission] generate IRP5 easyfile export submissions (success)',
  generateEMP501PDFSubmissionsAction = '[Payroll submission] generate EMP501 PDF submissions',
  generateEMP501PDFSubmissionsSuccessAction = '[Payroll submission] generate EMP501 PDF submissions (success)',

}
export const generateEMP501PDFSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateEMP501PDFSubmissionsAction,
  props<{ payload: { fromDate: string, toDate: string, language: string } }>()
);
export const generateEMP501PDFSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateEMP501PDFSubmissionsSuccessAction,
  props<{ response: ICommonResponse, keyDates: string }>()
);
export const generateIRP5EasyfileExportSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateIRP5EasyfileExportSubmissionsAction,
  props<{ payload: { fromDate: string, toDate: string } }>()
);
export const generateIRP5EasyfileExportSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateIRP5EasyfileExportSubmissionsSuccessAction,
  props<{ response: ICommonResponse, keyDates: string }>()
);
export const finalizeIRP5IT3ASubmissionsAction = createAction(
  PayrollSubmissionsTypes.finalizeIRP5IT3ASubmissionsAction,
  props<{ payload: { fromDate: string, toDate: string } }>()
);
export const finalizeIRP5IT3ASubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.finalizeIRP5IT3ASubmissionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const validateIRP5IT3ASubmissionsAction = createAction(
  PayrollSubmissionsTypes.validateIRP5IT3ASubmissionsAction,
  props<{ payload: { fromDate: string, toDate: string } }>()
);
export const validateIRP5IT3ASubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.validateIRP5IT3ASubmissionsSuccessAction,
  props<{ response: IValidateIRP5IT3ASubmission[] }>()
);
export const southAfricaRegulatedSettingsSubmissionsAction = createAction(
  PayrollSubmissionsTypes.southAfricaRegulatedSettingsSubmissionsAction,
  props<{ regulatedSettingsId: string }>()
);
export const southAfricaRegulatedSettingsSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.southAfricaRegulatedSettingsSubmissionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const generateCOIDAReportSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateCOIDAReportSubmissionsAction,
  props<{ payload: ICoidaReport }>()
);
export const generateCOIDAReportSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateCOIDAReportSubmissionsSuccessAction,
  props<{ response: ICommonResponse, keyDates: string }>()
);
export const generateAlphalistSchedule1ReportSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateAlphalistSchedule1ReportSubmissionsAction,
  props<{ payload: { fromDate: string, language: string, toDate: string } }>()
);
export const generateAlphalistSchedule1ReportSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateAlphalistSchedule1ReportSubmissionsSuccessAction,
  props<{ response: ICommonResponse, keyDates: string }>()
);
export const generateAnnualizationReportSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateAnnualizationReportSubmissionsAction,
  props<{ payload: { fromDate: string, language: string, toDate: string } }>()
);
export const generateAnnualizationReportSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateAnnualizationReportSubmissionsSuccessAction,
  props<{ response: ICommonResponse, keyDates: string }>()
);
export const getEmployeesWithPayRunDataSubmissionsAction = createAction(
  PayrollSubmissionsTypes.getEmployeesWithPayRunDataSubmissionsAction,
  props<{ payload: IPaginationPayload }>()
);
export const getEmployeesWithPayRunDataSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.getEmployeesWithPayRunDataSubmissionsSuccessAction,
  props<{ response: { items: IEmployee[], totalItems: number } }>()
);
export const generateIRP5IT3ASubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateIRP5IT3ASubmissionsAction,
  props<{ payload: { employeeId: number, fromDate: string, language: string, toDate: string, type: string } }>()
);
export const generateIRP5IT3ASubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateIRP5IT3ASubmissionsSuccessAction,
  props<{ response: ICommonResponse, employeeId: number }>()
);
export const filingDetailsSetupSubmissionsAction = createAction(
  PayrollSubmissionsTypes.filingDetailsSetupSubmissionsAction
);
export const filingDetailsSetupSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.filingDetailsSetupSubmissionsSuccessAction,
  props<{ response: IFillingSetup }>()
);
export const generateUIFPDFSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateUIFPDFSubmissionsAction,
  props<{ submissionId: number, language: string }>()
);
export const generateUIFPDFSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateUIFPDFSubmissionsSuccessAction,
  props<{ response: ICommonResponse, submissionId: number }>()
);
export const submitUIFSubmissionsAction = createAction(
  PayrollSubmissionsTypes.submitUIFSubmissionsAction,
  props<{ submissionId: number }>()
);
export const submitUIFSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.submitUIFSubmissionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const completeEMP201SubmissionsAction = createAction(
  PayrollSubmissionsTypes.completeEMP201SubmissionsAction,
  props<{ submissionId: number }>()
);
export const completeEMP201SubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.completeEMP201SubmissionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const generateEMP201PdfSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateEMP201PdfSubmissionsAction,
  props<{ submissionId: number, language: string }>()
);
export const generateEMP201PdfSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateEMP201PdfSubmissionsSuccessAction,
  props<{ response: ICommonResponse, submissionId: number }>()
);
export const generateUser1601CPDFSubmissionsAction = createAction(
  PayrollSubmissionsTypes.generateUser1601CPDFSubmissionsAction,
  props<{ payload: IPhilippinesSubmittion1601C }>()
);
export const generateUser1601CPDFSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.generateUser1601CPDFSubmissionsSuccessAction,
  props<{ response: ICommonResponse, submissionMonth: string }>()
);
export const get1601CDataSubmissionsAction = createAction(
  PayrollSubmissionsTypes.get1601CDataSubmissionsAction,
  props<{ payload: { reportDate: string, submissionDocumentType: number } }>()
);
export const get1601CDataSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.get1601CDataSubmissionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const downloadPhilippinesSubmissionsAction = createAction(
  PayrollSubmissionsTypes.downloadPhilippinesSubmissionsAction,
  props<{ payload: { employeeId: number, reportDate: string, submissionDocumentType: number } }>()
);
export const downloadPhilippinesSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.downloadPhilippinesSubmissionsSuccessAction,
  props<{ response: ICommonResponse, reportDate: string, submissionDocumentType: number }>()
);
export const getPhilippinesMonthlySubmissionsAction = createAction(
  PayrollSubmissionsTypes.getPhilippinesMonthlySubmissionsAction
);
export const getPhilippinesMonthlySubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.getPhilippinesMonthlySubmissionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getIncomeAndBenefitTypesSubmissionsAction = createAction(
  PayrollSubmissionsTypes.getIncomeAndBenefitTypesSubmissionsAction
);
export const getIncomeAndBenefitTypesSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.getIncomeAndBenefitTypesSubmissionsSuccessAction,
  props<{ response: ICommonResponse }>()
);
export const getAnnualIRP5IT3ASubmissionsAction = createAction(
  PayrollSubmissionsTypes.getAnnualIRP5IT3ASubmissionsAction,
  props<{ payload: { fromDate: string, toDate: string } }>()
);
export const getAnnualIRP5IT3ASubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.getAnnualIRP5IT3ASubmissionsSuccessAction,
  props<{ response: { IIrp5Summission: IIrp5Summission[], validateIRP5IT3A: IValidateIRP5IT3ASubmission[] } }>()
);
export const getPayrollTaxSubmissionsAction = createAction(
  PayrollSubmissionsTypes.getPayrollTaxSubmissionsAction
);
export const getPayrollTaxSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.getPayrollTaxSubmissionsSuccessAction,
  props<{ response: ITaxSeason[] }>()
);
export const getPayrollMonthlyUIFSubmissionsAction = createAction(
  PayrollSubmissionsTypes.getPayrollMonthlyUIFSubmissionsAction
);
export const getPayrollMonthlyUIFSubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.getPayrollMonthlyUIFSubmissionsSuccessAction,
  props<{ response: IMonthlyUifSubmission[] }>()
);
export const getPayrollMonhtlyEmp201SubmissionsAction = createAction(
  PayrollSubmissionsTypes.getPayrollMonhtlyEmp201SubmissionsAction
);
export const getPayrollMonthlyEmp201SubmissionsSuccessAction = createAction(
  PayrollSubmissionsTypes.getPayrollMonthlyEmp201SubmissionsSuccessAction,
  props<{ response: IMonthlyEmp201Submission[] }>()
);