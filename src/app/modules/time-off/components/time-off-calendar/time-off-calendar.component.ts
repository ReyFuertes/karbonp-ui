import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import * as moment from 'moment';
import { Store, select } from '@ngrx/store';
import { Subject, combineLatest, debounceTime, filter, map, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { getLeaveTimeOffHolidaysSelector, getTimeOffRequestLoadingSelector } from '../../store/time-off.selector';
import { IOptionItem, ITimeOffRequestPayload } from 'src/app/models/generic.model';
import { getEmployeesTimeOffBookingsOverviewSelector } from 'src/app/modules/employee/store/time-off/time-off.selector';
import { getSearchedEmployeesSelector, isEmployeeLoadingSelector } from 'src/app/modules/employee/store/employee/employee.selector';
import { IEmployee } from 'src/app/modules/employee/employee.model';
import { getLeaveTimeOffSetupPoliciesSelector } from 'src/app/store/app.selector';
import { performSearchEmployeesAction } from 'src/app/modules/employee/store/employee/employee.action';
import { InputMultipleSelectChipComponent } from 'src/app/shared/components/input-multiple-select-chip/input-multiple-select-chip.component';
import { clearTimeOffBalanceReportDataAction } from '../../store/time-off.action';
import { AppState } from 'src/app/store';


@Component({
  selector: 'kp-time-off-calendar',
  templateUrl: './time-off-calendar.component.html',
  styleUrls: ['./time-off-calendar.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class TimeOffCalendarComponent extends GenericDestroy implements OnInit, OnChanges {
  @Input() public employees: IEmployee[];
  @Output() public payloadRequestChanges = new EventEmitter<ITimeOffRequestPayload>();
  @ViewChild('overlayFilterTarget') public overlayFilterTarget: ElementRef;
  @ViewChild('inputMultipleSelectChipComponent') public inputMultipleSelectChipComponent: InputMultipleSelectChipComponent;

  public calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    initialView: 'dayGridMonth',
    displayEventTime: false,
    weekends: true,
    datesSet: this.handleEvents.bind(this),
    eventMouseEnter: function () { },
    eventClick: (info: any) => {
      if (info?.event?.id)
        this.router.navigateByUrl(`employee/detail/${info?.event?.employeeId}`);
      alert('Not supported by api..');
    }
  };
  public isOverlayShowing: boolean = false;
  public timeOffPolicies: IOptionItem[] = [];
  public employeeFilterText$ = new Subject();
  public options: IOptionItem[] = [];
  public payloadRequest: ITimeOffRequestPayload;
  public timeOffPolicy: IOptionItem[] = [];
  public searchedEmployees: IOptionItem[] = [];
  public selectedEmployeeIds: number[] = [];

  constructor(public router: Router, public translate: TranslateService, private store: Store<AppState>) {
    super();
    this.employeeFilterText$
      .pipe(
        filter((keyword) => keyword !== ''),
        map((keyword: any) => keyword),
        debounceTime(300),
        takeUntil(this.$unsubscribe),
      ).subscribe((searchText: string) => {
        this.store.dispatch(performSearchEmployeesAction({
          payload: { sortBy: "LastName", searchText, sortAscending: true, pageNumber: 1, pagesize: 30 }
        }));
      });
  }

  ngOnInit(): void {
    this.store.pipe(select(getSearchedEmployeesSelector)).subscribe((searchedEmployees) => {
      this.searchedEmployees = searchedEmployees?.map(employee => ({ value: employee.id.toString(), label: employee.fullName }));
    })
    combineLatest([
      this.store.pipe(select(getLeaveTimeOffHolidaysSelector)),
      this.store.pipe(select(getEmployeesTimeOffBookingsOverviewSelector)),
      this.store.pipe(select(getLeaveTimeOffSetupPoliciesSelector))
    ]).pipe(
      takeUntil(this.$unsubscribe))
      .subscribe(([holidays, employeeBookings, timeOffPolicies]) => {
        const events: any[] = [];
        holidays.forEach((holiday) => events.push({ title: `${holiday.name}`, start: holiday.date }));
        employeeBookings?.forEach(booking => {
          if (booking.middleName != null && booking.middleName != '') {
            events.push({
              // id: booking.employeeId,
              title: `${booking.firstName} ${booking.middleName} - ${booking.lastName} ${booking.leaveType}`,
              start: booking.fromDate,
              end: booking.toDate
            });
          }
          else {
            events.push({
              // id: booking.employeeId,
              title: `${booking.firstName} ${booking.lastName} - ${booking.leaveType}`,
              start: booking.fromDate,
              end: booking.toDate
            });
          }
        });
        this.timeOffPolicies = timeOffPolicies?.map(policy => ({ label: policy?.name, value: policy?.id.toString() }));
        this.calendarOptions.events = events;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employees']?.currentValue?.length > 0)
      this.employees = changes['employees']?.currentValue;
    else
      this.employees = [];
  }

  public isLoadingAsync = () => this.store.pipe(select(isEmployeeLoadingSelector));

  public isRequestLoading = () => this.store.pipe(select(getTimeOffRequestLoadingSelector));

  public handleInputTextChange(event: string): void {
    this.inputMultipleSelectChipComponent.isLoading = true;
    this.employeeFilterText$.next(event);
  }

  public onSaveFilter(): void {
    this.payloadRequest = Object.assign({}, this.payloadRequest, {
      employeeIds: this.selectedEmployeeIds?.length > 0
        ? this.selectedEmployeeIds
        : this.employees.map(option => Number(option.id)),
      leaveTypeIds: this.timeOffPolicy?.map((policy: IOptionItem) => Number(policy.value)) || []
    });
    this.payloadRequestChanges.emit(this.payloadRequest);
  }

  public onFilter(op: any, event: any): void {
    op.show(event, this.overlayFilterTarget.nativeElement);
    this.isOverlayShowing = !this.isOverlayShowing;
  }

  public onClear(): void {
    this.payloadRequest = Object.assign({}, this.payloadRequest, {
      employeeIds: [],
      leaveTypeIds: []
    });
    this.searchedEmployees = [];
    this.selectedEmployeeIds = [];
    this.timeOffPolicy = [];
    this.inputMultipleSelectChipComponent.reset();
    this.payloadRequestChanges.emit(this.payloadRequest);
    this.store.dispatch(clearTimeOffBalanceReportDataAction());
  }

  public handleSelectedValuesChange(event: IOptionItem[]): void {
    this.selectedEmployeeIds = event?.map(option => Number(option.value));
  }

  public handleEvents(event: EventApi | any): void {
    this.payloadRequest = {
      employeeIds: this.selectedEmployeeIds?.length > 0
        ? this.selectedEmployeeIds
        : this.employees.map(option => Number(option.id)),
      leaveTypeIds: [],
      fromDate: moment(event.startStr).format('DD/MM/YYYY'),
      toDate: moment(event.endStr).format('DD/MM/YYYY')
    }
    this.payloadRequestChanges.emit(this.payloadRequest);
  }
}
