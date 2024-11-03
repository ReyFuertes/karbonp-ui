import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { finalize, map, switchMap, tap } from "rxjs";
import { Store } from "@ngrx/store";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { CustomItemService } from "../../payroll.service";
import { getPayrollSettingsPayTypesAction, getPayrollSettingsPayTypesSuccessAction, saveCustomItemAction, saveCustomItemSuccessAction } from "./payroll-settings-pay-type.action";
import { AppState } from "..";

@Injectable()
export class PayrollPayrunPayTypeEffect extends GenericEffect {
  saveCustomItemAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveCustomItemAction),
    switchMap(({ payload }) => this.customItemService.post(payload)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => {
          return saveCustomItemSuccessAction({ response });
        }),
        finalize(() => { //note: need to refresh to get recent data where it shouldnt be
          this.store.dispatch(getPayrollSettingsPayTypesAction({
            payload: {
              active: true, customItemType: null, pageNumber: 1, pagesize: 10,
              searchText: '', sortAscending: true, sortBy: 'Name'
            }
          }));
        })
      ))
  ));

  getPayrollSettingsPayTypesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrollSettingsPayTypesAction),
    switchMap(({ payload }) => this.customItemService.postObservePagination(payload, '/GetCustomItems')
      .pipe(
        map((response) => this.getPagination(response)),
        map((response) => {
          return getPayrollSettingsPayTypesSuccessAction({ response });
        })
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private store: Store<AppState>,
    private customItemService: CustomItemService) {
    super(injector);
  }
}