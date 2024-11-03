import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, first, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { getLeaveTimeOffHolidaysSelector, getTimeOffBookingSelector, getTimeOffRequestLoadingSelector } from '../../store/time-off.selector';
import { EmployeeRequestStatusType, IMultiSelectEmployee, ITimeOffBooking } from 'src/app/models/generic.model';
import { IPublicHoliday, ITimeOffPaginationPayload } from '../../time-off.model';
import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { AppState } from 'src/app/store';
import { getMultiSelectEmployeesSelector } from 'src/app/store/app.selector';
import { getInitials } from 'src/app/shared/util/formatting';
import { getTimeOffRequestAction } from '../../store/time-off.action';
import { TIMEOFF_PAGE_PAYLOAD } from 'src/app/shared/constants/time-off.constant';
import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';

@Component({
  selector: 'kp-time-off-overview',
  templateUrl: './time-off-overview.component.html',
  styleUrls: ['./time-off-overview.component.scss']
})
export class TimeoffOverviewComponent extends GenericDestroy implements OnInit {
  public employees: IMultiSelectEmployee[];
  public peopleOutOffice: ITimeOffBooking[] = [];
  public timeOffRequests: ITimeOffBooking[] = [];
  public peopleUpcomingOffice: ITimeOffBooking[] = [];
  public timeOffImportantDates: IPublicHoliday[] = [];
  public getInitials = getInitials;
  public timeOffPagePayload: ITimeOffPaginationPayload;
  public timeOffPagesize: number = 100;

  constructor(private store: Store<AppState>) {
    super();
    this.store.pipe(select(getMultiSelectEmployeesSelector))
      .pipe(first())
      .subscribe(employees => {
        this.employees = employees;
        localStorage.removeItem(TIMEOFF_PAGE_PAYLOAD);
        if (this.employees?.length > 0) {
          this.store.dispatch(getTimeOffRequestAction({
            payload: Object.assign({}, this.timeOffPagePayload, {
              employeeIds: this.employees?.map(employee => employee?.id),
              pageNumber: PAGINATION_VARS.pageNumber,
              pagesize: this.timeOffPagesize,
              sortAscending: false,
              sortBy: "TimeOffBooking.ToDate",
              status: null
            })
          }));
        }
      })
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getTimeOffBookingSelector)),
      this.store.pipe(select(getLeaveTimeOffHolidaysSelector)),
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([timeOffBookings, timeOffImportantDates]) => {
        this.peopleOutOffice = [];
        this.peopleUpcomingOffice = [];
        const today = moment().startOf('day');
        const currentWeek = moment().week();
        const fromNextWeekDay = moment().week(currentWeek).add(1, 'week').day(1).startOf('day').toDate();
        const toNextWeekDay = moment().week(currentWeek).add(1, 'week').day(5).endOf('day').toDate();
        timeOffBookings?.forEach(booking => {
          const isFromBetween = today.isBetween(booking.timeOffBooking.fromDate, booking.timeOffBooking.toDate, null, '[]');
          const isToBetween = today.isBetween(booking.timeOffBooking.fromDate, booking.timeOffBooking.toDate, null, '[]');
          if ((isFromBetween || isToBetween) && booking.timeOffBooking.status === EmployeeRequestStatusType.Approved)
            this.peopleOutOffice.push(booking);

          const isFromOutOffice = moment(booking.timeOffBooking.fromDate).isBetween(fromNextWeekDay, toNextWeekDay, null, '[]');
          const isToOutOffice = moment(booking.timeOffBooking.toDate).isBetween(fromNextWeekDay, toNextWeekDay, null, '[]');
          if ((isFromOutOffice || isToOutOffice) && booking.timeOffBooking.status === EmployeeRequestStatusType.Approved) {
            this.peopleUpcomingOffice.push(booking);
          }
          if (booking.timeOffBooking?.status === EmployeeRequestStatusType.Requested) {
            const requests = this.timeOffRequests?.find(request => request?.timeOffBooking?.id === booking?.timeOffBooking?.id);
            if (!requests)
              this.timeOffRequests.push(booking);
          }
        });
        this.timeOffImportantDates = timeOffImportantDates;
      });
  }

  public isBackTomorrow(toDate: string): boolean {
    return moment().day(1).format('MM/DD/YYYY') === moment(toDate).format('MM/DD/YYYY');
  }

  public isLoadingAsync = () => this.store.pipe(select(getTimeOffRequestLoadingSelector));
}
