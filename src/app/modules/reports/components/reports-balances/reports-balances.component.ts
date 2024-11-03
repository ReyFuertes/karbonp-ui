import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { EmployeeSelectStatusType } from 'src/app/models/generic.enum';
import { IOptionItem, IPayPeriod, IPaypoint } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getMultiSelectEmployeesSelector, getPayPeriodsSelector, getPayPointsSelector } from 'src/app/store/app.selector';
import { clearDownloadedBalanceReportsAction, downloadBalanceReportsAction, getBalancesReportsAction } from '../../store/reports.action';
import { getBalancesReportsSelector, getDownloadedBalancesReportSelector, getReportsLoadingSelector } from '../../store/reports.selector';
import { IPayloadReport } from '../../reports.model';
import { convertBase64ToBlob } from 'src/app/shared/util/document.util';
import { processDownloadedFile } from 'src/app/shared/util/formatting';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { GenericPage } from 'src/app/shared/generics/page.generic';

@Component({
  selector: 'kp-reports-balances',
  templateUrl: './reports-balances.component.html',
  styleUrls: ['./reports-balances.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class ReportsBalancesComponent extends GenericPage {
  public employeeOptions: IOptionItem[];
  public columns: string[] = ['Employee', 'Organizational Unit', 'Loans', 'Savings', 'Garnishees']
  public defaultOptions = GetTypes(EmployeeSelectStatusType, 0);
  public allEmployees: IOptionItem[];
  public maxSelectedLabels: number = 100;
  public selectionLimit: number = null;
  public payPeriods: IOptionItem[];
  public payPoints: IOptionItem[];
  public balancesReports: IPayloadReport[];
  public balanceReportsPayload: IPayloadReport;
  public downloadedBalancesReport: any; //note: no proper model

  constructor(injector: Injector) {
    super(injector);
    this.form = this.fb.group({
      date: new FormControl(undefined, Validators.required),
      employees: new FormControl(undefined, Validators.required),
      payPeriods: new FormControl(undefined),
      payPoints: new FormControl(undefined)
    });
    this.form.valueChanges.pipe(takeUntil(this.$unsubscribe), distinctUntilChanged())
      .subscribe(() => {
        this.downloadedBalancesReport = undefined;
        this.balancesReports = [];
      });
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getBalancesReportsSelector)),
      this.store.pipe(select(getDownloadedBalancesReportSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, payPeriods, payPoints, balancesReports, downloadedBalancesReport]) => {
        this.payPeriods = payPeriods.map((period: IPayPeriod) => ({ label: period.name, value: period.id }));
        this.payPoints = payPoints.map((payPoint: IPaypoint) => ({ label: payPoint.name, value: payPoint.id }));
        this.allEmployees = employees.map(employee => ({ value: employee?.id, label: employee?.fullName, active: employee?.isActive }));
        this.allEmployees.unshift(...this.defaultOptions);
        this.employeeOptions = this.allEmployees;
        this.balancesReports = balancesReports;
        this.downloadedBalancesReport = Object.assign({}, downloadedBalancesReport);
        if (this.downloadedBalancesReport?.data?.fileContents) {
          const result = convertBase64ToBlob(this.downloadedBalancesReport.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          processDownloadedFile(result, downloadedBalancesReport, 'Balances-Loans-Savings-Garnishee Report');
        }
      });
  }

  public isLoadingAsync = () => this.store.pipe(select(getReportsLoadingSelector));

  public get isAvailableForExport(): boolean {
    return this.balancesReports?.length > 0
      ? true
      : false;
  }

  public onChangeEmployees(event: any): void {
    this.form.get('employees').patchValue(event.value);
    const hasDefaultOptions = event.value?.filter((option: any) => ['All', 'Active', 'Inactive'].includes(option.value));
    if (hasDefaultOptions?.length > 0) {
      this.selectionLimit = 1;
      const hasDefaultValues = ['All', 'Active', 'Inactive'].includes(event.itemValue?.value);
      if (hasDefaultValues) {
        const results = event.value.filter((value: IOptionItem) => {
          return [value].indexOf(event.itemValue) > -1;
        });
        this.form.get('employees').patchValue(results);
      }
    } else
      this.selectionLimit = null;
    //this.setChipPaddings(event?.value);
  }

  public onExport(): void {
    if (!this.downloadedBalancesReport?.data)
      this.store.dispatch(downloadBalanceReportsAction({ payload: this.balanceReportsPayload }));
    else {
      const result = convertBase64ToBlob(this.downloadedBalancesReport?.data?.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      processDownloadedFile(result, this.downloadedBalancesReport, 'Balances-Loans-Savings-Garnishee Report');
    }
  }

  public onFilter(): void {
    const value = this.form.value;
    let employeeIds: number[] = [];
    if (value?.employees?.length === 1 && value?.employees[0]?.value === EmployeeSelectStatusType.All) {
      employeeIds = this.allEmployees
        ?.filter(employee => /^-?\d+\.?\d*$/.test(employee.value))
        ?.map(employee => employee.value);
    } else if (value?.employees?.length === 1 && value?.employees[0]?.value === EmployeeSelectStatusType.Active) {
      employeeIds = this.allEmployees
        ?.filter((employee) => employee.active === true)
        ?.map(employee => employee.value);
    } else {
      employeeIds = this.allEmployees
        ?.filter((employee) => employee.active === false)
        ?.map(employee => employee.value);
    }
    this.balanceReportsPayload = {
      date: moment(value?.date).format(),
      employeeIds,
      implementSortingAndPaging: true,
      language: "en", //note: need to look at the proper lang culture
      payPeriodids: value?.payPeriods?.map((item: IOptionItem) => item.value) || [],
      payPointIds: value?.payPoints?.map((item: IOptionItem) => item.value) || []
    };
    this.store.dispatch(getBalancesReportsAction({ payload: this.balanceReportsPayload }));
    this.store.dispatch(clearDownloadedBalanceReportsAction());
  }

  public onReset(): void {
    this.form.reset();
    this.balancesReports = [];
    this.downloadedBalancesReport = undefined;
  }
}