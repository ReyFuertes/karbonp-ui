import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { IPayrunTimeAttendance, ITimeTrackingIntegration } from "../../payroll.model";
import { getPayrunTimeAttendanceAction, getPayrunTimeAttendanceSuccessAction, getPayrunTimeTrackingIntegrationAction, getPayrunTimeTrackingIntegrationSuccessAction } from "./payroll-timetracking.action";
import { TimeTrackingService } from "src/app/services/time-tracking.service";
import { TimeAndAttendanceService } from "src/app/services/time-attendance.service";

@Injectable()
export class PayrollPayrunTimetrackingIntegrationEffect extends GenericEffect {
  getPayrunTimeAttendanceAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrunTimeAttendanceAction),
    switchMap(() => this.timeAndAttendanceService.get('')
      .pipe(
        map((response: IPayrunTimeAttendance) => getPayrunTimeAttendanceSuccessAction({ response }))
      ))
  ));

  getPayrunTimeTrackingIntegrationAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayrunTimeTrackingIntegrationAction),
    switchMap(() => this.timeTrackingService.get('/TimeTrackingIntegration')
      .pipe(
        map((response: ITimeTrackingIntegration) => getPayrunTimeTrackingIntegrationSuccessAction({ response }))
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private timeTrackingService: TimeTrackingService,
    private timeAndAttendanceService: TimeAndAttendanceService) {
    super(injector);
  }
}