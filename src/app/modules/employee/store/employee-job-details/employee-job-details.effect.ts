import { Injectable, Injector } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { updateEmployeeAccountStatusAction, updateEmployeeAccountStatusSuccessAction } from './employee-job-details.action';
import { IEmployee } from '../../employee.model';
import { EmployeeAccountStatusService } from '../../employee.service';
import { GenericEffect } from 'src/app/shared/generics/notification.generic';

@Injectable()
export class EmployeeJobDetailsEffects extends GenericEffect {
  updateEmployeeAccountStatusAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateEmployeeAccountStatusAction),
    switchMap(({ payload }) => this.employeeAccountStatusService.patch(payload)
      .pipe(
        filter((response: IEmployee) => !Object.prototype.hasOwnProperty.call(response, 'errors')),
        tap((response: IEmployee) => this.getNotificationMessage(response || {})),
        map((response) => updateEmployeeAccountStatusSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private employeeAccountStatusService: EmployeeAccountStatusService) { 
      super(injector);
    }
}
