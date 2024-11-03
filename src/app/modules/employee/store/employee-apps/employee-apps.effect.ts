import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { delay, finalize, map, of, pipe, switchMap } from "rxjs";
import { Router } from "@angular/router";

import { getEmployeeAppsAction, getEmployeeAppsSuccessAction, updateEmployeeAppAction, updateEmployeeAppSuccessAction } from "./employee-apps.action";
import { IApplication } from "../../employee.model";
import { advanceTier } from "src/app/shared/mock/employee-apps.mock";
import { formatToJson } from "src/app/shared/util/formatting";


@Injectable()
export class EmployeeAppsEffect {
  updateEmployeeAppAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeAppAction),
    switchMap(({ payload }) => of(payload)
      .pipe(
        map((response: IApplication) => updateEmployeeAppSuccessAction({ response })),
        finalize(() => {
          const options = formatToJson(payload.options) as any;
          this.router.navigateByUrl(options?.route);
        })
      ))
  ));

  getEmployeeAppsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeAppsAction),
    pipe(delay(300)),
    switchMap(() => of(advanceTier) //note: we need to make this configurable via api, advanceTier
      .pipe(
        map((response: IApplication[]) => getEmployeeAppsSuccessAction({ response }))
      ))
  ));

  constructor(
    private actions$: Actions,
    private router: Router) { }
}