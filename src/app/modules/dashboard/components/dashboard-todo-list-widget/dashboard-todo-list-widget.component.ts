import { Component, Injector } from '@angular/core';
import { select } from '@ngrx/store';
import { Observable, shareReplay, takeUntil } from 'rxjs';

import { ITodoListWidgetData } from 'src/app/models/dashboard.model';
import { TimeOffMenuTypes } from 'src/app/modules/time-off/time-off.enum';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';
import { TIMEOFF_PAGE_KEY, TIMEOFF_PAGE_PAYLOAD } from 'src/app/shared/constants/time-off.constant';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getTodoListWidgetDataSelector } from 'src/app/store/app.selector';

@Component({
  selector: 'kp-dashboard-todo-list-widget',
  templateUrl: './dashboard-todo-list-widget.component.html',
  styleUrls: ['./dashboard-todo-list-widget.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class DashboardTodoListWidgetComponent extends GenericPage {
  constructor(injector: Injector) {
    super(injector);
  }

  public getTodoListWidgetData = (): Observable<ITodoListWidgetData> =>
    this.store.pipe(select(getTodoListWidgetDataSelector))
      .pipe(takeUntil(this.$unsubscribe),
        shareReplay(1))

  public gotoPaymentPage(payRunPaymentId: number): void {
    if (payRunPaymentId)
      this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, `/payroll/payruns/payment-details/${payRunPaymentId}`);
    else
      console.log('Error: invalid payRunPaymentId')
  }

  public gotoToPayRunPage(payRunId: number): void {
    if (payRunId)
      this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, `/payroll/payruns/edit/${payRunId}`);
    else
      console.log('Error: invalid payRunId');
  }

  public gotoToEmployee(id: number): void {
    console.log('gotoToEmployee: ', id)
  }

  public gotoTimeOffRequests(id: number): void {
    const timeOffPagePayload = {
      employeeIds: [id],
      pageNumber: 1,
      pagesize: 10,
      sortAscending: false,
      sortBy: "TimeOffBooking.ToDate",
      status: 2
    }
    localStorage.setItem(TIMEOFF_PAGE_KEY, JSON.stringify(TimeOffMenuTypes.Requests));
    localStorage.setItem(TIMEOFF_PAGE_PAYLOAD, JSON.stringify(timeOffPagePayload));
    this.router.navigateByUrl(`/time-off`);
  }

  public gotoEmployeeRequests(): void {
    alert('gotoEmployeeRequests: ')
  }
}
