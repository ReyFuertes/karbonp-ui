import { Injectable, Injector } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { PeopleService, PeopleStatusService } from '../../people.service';
import { IPeopleStatus } from '../../people.model';
import { addPeopleStatusAction, addPeopleStatusSuccessAction, deletePeopleStatusAction, deletePeopleStatusSuccessAction, getPeopleByStatusesIdsAction, getPeopleByStatusesIdsSuccessAction, getPeopleStatusesAction, getPeopleStatusesSuccessAction, updatePeopleStatusAction, updatePeopleStatusSuccessAction } from './people-status.action';
import { GenericEffect } from 'src/app/shared/generics/notification.generic';
import { IEmployee } from '../../../employee/employee.model';

@Injectable()
export class PeopleStatusEffects extends GenericEffect {
  getPeopleByStatusesIdsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPeopleByStatusesIdsAction),
    switchMap(({ ids }) => this.peopleService.get(`/filterbyStatus?ids=${ids.join(',')}`)
      .pipe(
        filter((response: IEmployee[]) => !!response),
        map((response) => {
          return getPeopleByStatusesIdsSuccessAction({ response });
        })
      ))
  ));

  deletePeopleStatusAction$ = createEffect(() => this.actions$.pipe(
    ofType(deletePeopleStatusAction),
    switchMap(({ id }) => this.peopleStatusService.delete(`/${id}`)
      .pipe(
        filter((response: IPeopleStatus) => !!response),
        tap((response) => this.getNotificationMessage(response || {}, 'Successfully Deleted')),
        map((response) => deletePeopleStatusSuccessAction({ response: <IPeopleStatus>response }))
      ))
  ));

  updatePeopleStatusAction$ = createEffect(() => this.actions$.pipe(
    ofType(updatePeopleStatusAction),
    switchMap(({ payload }) => this.peopleStatusService.patch(payload)
      .pipe(
        filter((response: IPeopleStatus) => !!response),
        tap((response) => this.getNotificationMessage(response || {}, 'Updated Successfully')),
        map((response) => updatePeopleStatusSuccessAction({ response: <IPeopleStatus>response }))
      ))
  ));

  addPeopleStatusAction$ = createEffect(() => this.actions$.pipe(
    ofType(addPeopleStatusAction),
    switchMap(({ payload }) => this.peopleStatusService.post(payload)
      .pipe(
        filter((response: IPeopleStatus) => !!response),
        tap((response) => this.getNotificationMessage(response || {})),
        map((response) => addPeopleStatusSuccessAction({ response }))
      ))
  ));

  getPeopleStatusesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPeopleStatusesAction),
    switchMap(() => this.peopleStatusService.get()
      .pipe(
        filter((response) => !!response),
        map((response) => {
          return getPeopleStatusesSuccessAction({ response });
        })
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private peopleService: PeopleService,
    private peopleStatusService: PeopleStatusService) {
    super(injector);
  }
}
