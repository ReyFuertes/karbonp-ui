import { createFeatureSelector, createSelector } from "@ngrx/store";

import { ReportsModuleState } from ".";
export const reportsModuleState = createFeatureSelector<ReportsModuleState>('reportsModule');
export const getMonthlySettingReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.monthlySettings || undefined);
export const getDetailedReportTemplatesSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.detailedReportTemplates || []);
export const getDownloadedDetailedReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.downloadedDetailedReport || undefined);
export const getReportDataSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.reportData || undefined);
export const getDetailedReportColumnsSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.detailedReportColumns || []);
export const getTaxPeriodDateSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.taxPeriodDate || undefined);
export const getETIReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.eTIReport || undefined);
export const getDownloadedETIReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.downloadedETIReport || undefined);
export const getInformationReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.informationReport || undefined);
export const getDownloadedInformationReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.downloadedInformationReport || undefined);
export const getDownloadedSkillsEquityReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.downloadedSkillsEquityReport || undefined);
export const getSkillsEquityReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.skillsEquityReport || []);
export const getDownloadedBalancesReportSelector = createSelector(
  reportsModuleState,
  state => state?.reports?.downloadedBalancesReport || undefined);
export const getBalancesReportsSelector = createSelector(
  reportsModuleState,
  state => state?.reports.balancesReports || []);
export const getReportsLoadingSelector = createSelector(
  reportsModuleState,
  state => state?.reports.isLoading);

