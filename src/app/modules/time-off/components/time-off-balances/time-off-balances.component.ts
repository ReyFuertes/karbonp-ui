import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import * as moment from 'moment';
import { Subject, combineLatest, takeUntil } from 'rxjs';

import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { IOptionItem } from 'src/app/models/generic.model';
import { getMultiSelectEmployeesSelector, getPayPointsCurrentUserSelector } from 'src/app/store/app.selector';
import { IEmployee } from 'src/app/modules/employee/employee.model';
import { getIsLoadingEmployeesSelector, getTimeOffBalanceReportDataSelector } from '../../store/time-off.selector';
import { clearTimeOffBalanceReportDataAction, getTimeOffBalanceReportDataAction } from '../../store/time-off.action';
import { EmployeeSelectStatusType } from 'src/app/models/generic.enum';
import { GenericPage } from 'src/app/shared/generics/page.generic';

@Component({
  selector: 'kp-time-off-balances',
  templateUrl: './time-off-balances.component.html',
  styleUrls: ['./time-off-balances.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class TimeOffBalancesComponent extends GenericPage implements OnInit, OnChanges {
  public employees: IEmployee[];
  public employeeFilterText$ = new Subject();
  public employeeSelectStatustype: IOptionItem[] = [];
  public currentUserPaypoints: IOptionItem[] = [];
  public selectedStatusTypes: any;
  public selectedCurrentUserPaypoints: IOptionItem[] = [];
  public pageNumber: number = 1;
  public pagesize: number = 25;
  public filterDate: Date;
  public timeOffSetupPolicies: IOptionItem[] = [];
  public balanceReportDatatable: any[] = [];
  public selectedEmployeeIds: number[] = [];
  public selectedFilterEmployees: IOptionItem[] = [];
  public maxSelectedLabels: number = null;
  public selectionLimit: number = null;

  constructor(injector: Injector) {
    super(injector);
    this.store.pipe(select(getTimeOffBalanceReportDataSelector),
      takeUntil(this.$unsubscribe)).subscribe(balanceReport => {
        this.balanceReportDatatable = balanceReport.map(balance => {
          return {
            employeeName: balance?.employeeName,
            number: balance?.number,
            organizationalUnit: balance?.organizationalUnit,
            leaveTypeSIV: balance.balances.find(value => value.leaveType === 'Service Incentive Leave')?.balance, //note: refactor use unique identifier
            leaveTypeLWP: balance.balances.find(value => value.leaveType === 'Leave without Pay')?.balance, //note: refactor use unique identifier
            leaveTypeML: balance.balances.find(value => value.leaveType === 'Maternity Leave')?.balance, //note: refactor use unique identifier
            leaveTypeIOD: balance.balances.find(value => value.leaveType === 'IOD')?.balance //note: refactor use unique identifier
          }
        })
      });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getPayPointsCurrentUserSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, payPoint]) => {
        this.employees = employees;
        this.currentUserPaypoints = payPoint?.map(value => ({ value: value.id.toString(), label: value.name }));
      });
    this.employeeSelectStatustype = Object.keys(EmployeeSelectStatusType).map(type => {
      if (type === EmployeeSelectStatusType.All)
        return { label: this.translateService.instant('AllEmployees') };
      if (type === EmployeeSelectStatusType.Active)
        return { label: this.translateService.instant('AllActiveEmployees') };
      if (type === EmployeeSelectStatusType.Inactive)
        return { label: this.translateService.instant('AllInactiveEmployees') };
      return { label: '' };
    });
  }

  public isLoadingEmployeesSelectorAsync = () => this.store.pipe(select(getIsLoadingEmployeesSelector));

  public onSaveFilter(): void {
    this.store.dispatch(getTimeOffBalanceReportDataAction({
      payload: {
        date: moment(this.filterDate).format('DD/MM/YYYY'),
        employeeIds: [],
        pageNumber: this.pageNumber,
        pagesize: this.pagesize,
        payPointIds: this.selectedCurrentUserPaypoints?.map((payPoint: IOptionItem) => Number(payPoint.value)) || [],
        sortAscending: true,
        sortBy: "EmployeeName"
      }
    }));
  }

  public onClear(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('AreYouSureYouWantToClear'),
      accept: () => {
        this.selectedCurrentUserPaypoints = [];
        this.filterDate = undefined;
        this.selectedEmployeeIds = [];
        this.selectedStatusTypes = [];
        this.balanceReportDatatable = [];
        this.store.dispatch(clearTimeOffBalanceReportDataAction());
      }
    });
  }
}
