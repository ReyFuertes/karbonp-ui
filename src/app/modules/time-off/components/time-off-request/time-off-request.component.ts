import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { Subject, combineLatest, takeUntil } from 'rxjs';

import { EmployeeRequestStatusType, IMultiSelectEmployee, IOptionItem, ITimeOffBooking } from 'src/app/models/generic.model';
import { clearTimeOffBalanceReportDataAction, getTimeOffRequestAction, updateTimeOffRequestAction } from '../../store/time-off.action';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getTimeOffBookingSelector, getTimeOffRequestLoadingSelector } from '../../store/time-off.selector';
import { TimeOffMenuTypes, TimeOffRequestTypes } from '../../time-off.enum';
import { TIMEOFF_PAGE_KEY, TIMEOFF_PAGE_PAYLOAD } from 'src/app/shared/constants/time-off.constant';
import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getMultiSelectEmployeesSelector } from 'src/app/store/app.selector';
import { ITimeOffPaginationPayload } from '../../time-off.model';
import { getInitials } from 'src/app/shared/util/formatting';

@Component({
  selector: 'kp-time-off-request',
  templateUrl: './time-off-request.component.html',
  styleUrls: ['./time-off-request.component.scss']
})
export class TimeOffRequestComponent extends GenericPage implements OnInit {
  public employeesOptions: IMultiSelectEmployee[];
  public loadRequestBookings: boolean = false;
  public employeeRequestStatus = EmployeeRequestStatusType;
  public searchText$ = new Subject();
  public selectedEmployeeIds: number[] = [];
  public searchedEmployees: IOptionItem[] = [];
  public requestStatusId: number;
  public requestBookings: ITimeOffBooking[] = [];
  public showTimeOffRequestDialog: boolean = false;
  public selectedRequest: ITimeOffBooking;
  public requestDeclineNote: string;
  public showMenu: boolean = false;
  public checkedStatuses: number[];
  public checkedRequestTypes: number[];
  public requestTypeOptions = GetTypes(TimeOffRequestTypes);
  public statusesOptions = GetTypes(EmployeeRequestStatusType);
  public timeOffPagePayload: ITimeOffPaginationPayload;
  public getInitials = getInitials;
  public maxSelectedLabels: number = null;
  public selectionLimit: number = null;

  constructor(injector: Injector) {
    super(injector);
    this.timeOffPagePayload = {
      employeeIds: [],
      pageNumber: PAGINATION_VARS.pageNumber,
      pagesize: PAGINATION_VARS.pagesize,
      sortAscending: false,
      sortBy: "TimeOffBooking.ToDate",
      status: EmployeeRequestStatusType.Requested
    }
    //this.checkedStatuses = [EmployeeRequestStatusType.Requested];
    const timeoffPageKey = localStorage.getItem(TIMEOFF_PAGE_KEY);
    const timeOffPagePayload = localStorage.getItem(TIMEOFF_PAGE_PAYLOAD);
    if (timeOffPagePayload && timeoffPageKey) {
      const pageKey = JSON.parse(timeoffPageKey);
      if (pageKey === TimeOffMenuTypes.Requests) {
        this.store.dispatch(getTimeOffRequestAction({
          payload: Object.assign({}, this.timeOffPagePayload, JSON.parse(timeOffPagePayload))
        }));
        const selectedIds = JSON.parse(timeOffPagePayload)?.employeeIds;
        if (selectedIds)
          this.selectedEmployeeIds = selectedIds;
      }
    }
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getTimeOffBookingSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, requestBookings]) => {
        console.log(requestBookings)
        this.requestBookings = requestBookings?.filter(booking => booking?.timeOffBooking?.status === EmployeeRequestStatusType.Requested);
        console.log(this.requestBookings)
        this.employeesOptions = employees;
        if (this.selectedEmployeeIds?.length === 0) {
          this.selectedEmployeeIds = this.employeesOptions
            ?.map(employee => employee?.id)
            ?.filter(id => this.requestBookings?.find(booking => booking?.employee?.id === id));
        }
      });
  }

  public onSearch(): void {
    if (this.selectedEmployeeIds?.length > 0) {
      this.store.dispatch(getTimeOffRequestAction({
        payload: Object.assign({}, this.timeOffPagePayload, {
          employeeIds: this.selectedEmployeeIds,
          status: EmployeeRequestStatusType.Requested //this.checkedStatuses //note: api doesnt support his yet
        })
      }));
    }
  }

  public onEdit(employeeId: number): void {
    this.showTimeOffRequestDialog = true;
    this.selectedRequest = this.requestBookings.find(request => request?.employee?.id === employeeId)
  }

  public isLoadingAsync = () => this.store.pipe(select(getTimeOffRequestLoadingSelector));

  public get isRequestTypesAllChecked(): boolean {
    return this.checkedRequestTypes?.length === this.requestTypeOptions?.length;
  }

  public get isStatusesAllChecked(): boolean {
    return this.checkedStatuses?.length === this.statusesOptions?.length;
  }

  public onCheckAll(name: string): void {
    switch (name) {
      case 'status':
        if (this.isStatusesAllChecked === true)
          this.checkedStatuses = [];
        else
          this.checkedStatuses = this.statusesOptions?.map(status => status?.value);
        break;
      case 'type':
        if (this.isRequestTypesAllChecked === true)
          this.checkedRequestTypes = [];
        else
          this.checkedRequestTypes = this.requestTypeOptions?.map(status => status?.value);
        break;
      default: break;
    }
  }

  public onApproveDeclineRequest(status: boolean): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${status === true ? 'Approve' : 'Decline'}?`,
      accept: () => {
        if (this.selectedRequest?.timeOffBooking?.id) {
          this.store.dispatch(updateTimeOffRequestAction({
            payload: {
              approve: status,
              approveDeclineNote: this.requestDeclineNote,
              timeOffBookingId: this.selectedRequest.timeOffBooking.id
            },
            employeeIds: this.employeesOptions?.map(employee => employee?.id)
          }));
          setTimeout(() => {
            this.showTimeOffRequestDialog = false;
            this.selectedRequest = undefined;
            this.requestDeclineNote = undefined;
          }, 300);
        }
        else {
          this.showError('Invalid booking');
        }
      }
    });
  }

  public onViewEditRequest(request: ITimeOffBooking): void {
    this.showTimeOffRequestDialog = true;
    this.selectedRequest = request;
  }

  public onReset(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('AreYouSureYouWantToClear'),
      accept: () => this.onRefresh()
    });
  }

  public onSaveFilter(): void {
    this.loadRequestBookings = true;
    this.store.dispatch(getTimeOffRequestAction({
      payload: {
        employeeIds: this.selectedEmployeeIds?.length > 0
          ? this.selectedEmployeeIds
          : this.employeesOptions.map(option => Number(option.id)),
        pageNumber: PAGINATION_VARS.pageNumber,
        pagesize: PAGINATION_VARS.pagesize,
        sortAscending: false,
        sortBy: "TimeOffBooking.ToDate",
        status: this.requestStatusId
      }
    }));
  }

  private onRefresh(): void {
    this.requestStatusId = undefined;
    this.requestBookings = [];
    this.selectedEmployeeIds = [];
    this.store.dispatch(clearTimeOffBalanceReportDataAction());
  }
}
