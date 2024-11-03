import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { filter, map, switchMap } from "rxjs";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { PeopleService } from "../../people.service";
import { getPeopleByStatusesIdsAction, getPeopleByStatusesIdsSuccessAction } from "./people.action";
import { IEmployee } from "src/app/modules/employee/employee.model";


@Injectable()
export class PeopleEffects extends GenericEffect {
  getPeopleByStatusesIdsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPeopleByStatusesIdsAction),
    switchMap(({ ids }) => this.peopleService.get(`/filterbyStatus?ids=${ids.join(',')}`)
      .pipe(
        filter((response: IEmployee[]) => !!response),
        map((response) => getPeopleByStatusesIdsSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private peopleService: PeopleService) {
    super(injector);
  }
}