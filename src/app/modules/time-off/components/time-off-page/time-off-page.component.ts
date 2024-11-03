import { Component, Injector, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { ILeaveSetup, IOptionItem, ITimeOffRequestPayload } from 'src/app/models/generic.model';
import { environment } from 'src/environments/environment';
import { getTimeOffBulkImportViewAction, getTimeOffLeaveApproverUsersAction, getTimeOffLeaveApproversAction, getTimeOffPublicHolidaysAction } from '../../store/time-off.action';
import { getEmployeesTimeOffRequestBookingsOverviewAction } from 'src/app/modules/employee/store/time-off/time-off.action';
import { getLeaveTimeOffSetupsPoliciesAction, getPayPointsForCurrentUserAction } from 'src/app/store/app.action';
import { IEmployee } from 'src/app/modules/employee/employee.model';
import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';
import { getLeaveTimeOffSetupPoliciesSelector, getMultiSelectEmployeesSelector } from 'src/app/store/app.selector';
import { AppMenuType } from 'src/app/models/generic.enum';
import { AppState } from 'src/app/store';
import { GetTypes } from 'src/app/shared/util/types.util';
import { TimeOffMenuTypes } from '../../time-off.enum';
import { TIMEOFF_PAGE_KEY } from 'src/app/shared/constants/time-off.constant';
import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';

@Component({
  selector: 'kp-time-off-page',
  templateUrl: './time-off-page.component.html',
  styleUrls: ['./time-off-page.component.scss']
})
export class TimeOffPageComponent extends GenericMenuPage implements OnInit {
  public avatarPath: string = '';
  public svgPath: string = environment.svgPath;
  public menusOptions = GetTypes(TimeOffMenuTypes, 0);
  public employees: IEmployee[];
  public timeOffActivePolicies: ILeaveSetup[];

  constructor(injector: Injector, private store: Store<AppState>) {
    super(injector);
    this.avatarPath = this.svgPath + 'mcdo-logo.svg';
    this.setActiveMenu(AppMenuType.TimeOff);
    this.store.dispatch(getPayPointsForCurrentUserAction()); //note: do we need this here?
    this.store.dispatch(getTimeOffPublicHolidaysAction({
      payload: {
        employeeIds: [],
        fromDate: moment().startOf('month').format('DD/MM/YYYY'),
        leaveTypeIds: [],
        toDate: moment().endOf('month').format('DD/MM/YYYY')
      }
    }));
    //this.store.dispatch(getTimeOffBulkImportViewAction()); //note: do we need this?
    const timeOffSelectedMenu = localStorage.getItem(TIMEOFF_PAGE_KEY);
    if (timeOffSelectedMenu)
      this.activeMenuOption = JSON.parse(timeOffSelectedMenu);
    else
      this.activeMenuOption = this.activeMenuOption ?? TimeOffMenuTypes.Overview;
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getLeaveTimeOffSetupPoliciesSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, timeOffActivePolicies]) => {
        this.employees = employees;
        this.timeOffActivePolicies = timeOffActivePolicies;

      })
    this.getApprovers();
  }

  public triggerChanges(compName: string): void {
    switch (compName) {
      case 'settings':
        this.store.dispatch(getLeaveTimeOffSetupsPoliciesAction());
        this.store.dispatch(getTimeOffBulkImportViewAction());
        break;
      case 'leave-approvers':
        this.getApprovers();
        break;
      default:break;
    }
  }

  public handlePayloadRequestChanges(payload: ITimeOffRequestPayload): void {
    this.store.dispatch(getEmployeesTimeOffRequestBookingsOverviewAction({ payload }));
  }

  public gotoMenu(selectedMenu: any): void {
    this.activeMenuOption = selectedMenu.value;
    localStorage.setItem(TIMEOFF_PAGE_KEY, JSON.stringify(this.activeMenuOption));
  }

  public getCurrentMenu(menuItem: IOptionItem): boolean {
    return menuItem.value === this.activeMenuOption;
  }

  private getApprovers(): void {
    this.store.dispatch(getTimeOffLeaveApproverUsersAction({
      payload: {
        active: true,
        implementSortingAndPaging: false
      }
    }))
    this.store.dispatch(getTimeOffLeaveApproversAction({
      payload: {
        pageNumber: PAGINATION_VARS.pageNumber,
        pagesize: PAGINATION_VARS.pagesize,
        payPointId: null,
        sortAscending: true,
        sortBy: "PayPointName",
        userId: null
      }
    }));
  }
}
