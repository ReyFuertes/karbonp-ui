import { createFeatureSelector, createSelector } from "@ngrx/store";

import { PayrollModuleState } from "..";
import { sortByDesc } from "src/app/shared/util/sort";
import { ICustomPaytype } from "../../payroll.model";

export const payrollPayRunModuleState = createFeatureSelector<PayrollModuleState>('payrollModule');
export const getPayrollSettingsPayTypesByIdSelector = (id: number) => createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsPayType?.entities[id] || undefined)
export const getPayrollSettingsPayTypesSelector = createSelector(
  payrollPayRunModuleState,
  state => state
    ? Object.values(state?.payrollSettingsPayType?.entities)
      ?.sort((a: ICustomPaytype, b: ICustomPaytype) => sortByDesc(a, b, 'id'))
    : []);
export const getPayrollSettingsPayTypeTotalItemsSelector = createSelector(
  payrollPayRunModuleState,
  state => state?.payrollSettingsPayType?.payRunPayTypetotalCount || 0);