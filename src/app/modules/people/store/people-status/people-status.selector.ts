import { createFeatureSelector, createSelector } from "@ngrx/store";

import { IPeopleStatus } from "../../people.model";
import { sortByDesc } from "src/app/shared/util/sort";
import { PeopleStateModule } from "..";

export const selectPeopleModuleState = createFeatureSelector<PeopleStateModule>('peopleModule');
export const getHasErrorSelector = createSelector(
  selectPeopleModuleState,
  state => state?.peopleStatusState?.hasError)
export const getPeopleStatusByIdSelector = (id: number) => createSelector(
  selectPeopleModuleState,
  state => state?.peopleStatusState?.entities[id])
export const getPeopleStatusesSelector = createSelector(
  selectPeopleModuleState, state => Object.values(state?.peopleStatusState?.entities || [])
    .sort((a: IPeopleStatus, b: IPeopleStatus) => sortByDesc(a, b, 'id'))
);
export const isPeopleStatusLoadingSelector = createSelector(
  selectPeopleModuleState,
  state => state?.peopleStatusState?.isLoading || false)