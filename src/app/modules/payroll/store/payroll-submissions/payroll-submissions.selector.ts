import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";

export const payrollModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getDownloadedEMP501PDFSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedEMP501PDF);
export const getDownloadedIRP5EasyfileExportSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedIRP5EasyfileExport);
export const getSouthAfricaRegulatedSettingSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.southAfricaRegulatedSetting);
export const getDownloadedCOIDAReportSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedCOIDAReport);
export const getdDownloadedAlphalistSchedule1ReportSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.alphalistSchedule1Report);
export const getdDownloadedAnnualizationReportSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedAnnualizationReport);
export const getEmployeesWithPayRunDataSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.employeesWithPayRunData);
export const getEmployeestotalCountSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.employeestotalCount);
export const getDownloadedIRP5IT3ASubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedIRP5IT3ASubmission);
export const getFilingDetailsSetupSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.filingDetailsSetup);
export const getDownloadedUIFPDFSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedUIFPDFSubmission);
export const getDownloadedEMP201PdfSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedEMP201PdfSubmission);
export const getdownloadedUser1601CPDFSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedUser1601CPDFSubmission);
export const getPhilippines1601CSubmissionsSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.philippinesSubmittion1601C);
export const getPayrollDownloadedPdfPHSubmissionsSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.downloadedMonthlyPhilippinesPdf);
export const getPayrollPhilippinesSubmissionsSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.philippinesSubmissions);
export const getPayrollIncomeAndBenefitTypesSubmissionsSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.incomeAndBenefitTypes);
export const getPayrollAnnualIrp5It3SubmissionsSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.irp5It3a);
export const getPayrollTaxSeasonsSubmissionsSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.taxSeasons);
export const getPayrollMonthlyUifSubmissionsSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.monthlyUifSubmissions);
export const getPayrollMonthlyEmp201SubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.monthlyEmp201Submissions);
export const getPayrollLoadingSubmissionSelector = createSelector(
  payrollModuleState,
  state => state?.payrollSubmissions?.isLoading);