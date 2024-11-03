import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { EmployeeSelectStatusType } from 'src/app/models/generic.enum';
import { IOptionItem, IPayPeriod, IPaypoint } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { IPayloadReport, IReportResponse } from '../../reports.model';
import { getMultiSelectEmployeesSelector, getPayPeriodsSelector, getPayPointsSelector } from 'src/app/store/app.selector';
import { getDownloadedETIReportSelector, getETIReportSelector, getReportsLoadingSelector } from '../../store/reports.selector';
import { clearDownloadedETIReportsAction, downloadETIReportsAction, getETIReportsAction } from '../../store/reports.action';
import { convertBase64ToBlob } from 'src/app/shared/util/convert-to-blob';
import { processDownloadedFile } from 'src/app/shared/util/formatting';
import { GenericPage } from 'src/app/shared/generics/page.generic';

@Component({
  selector: 'kp-reports-eti',
  templateUrl: './reports-eti.component.html',
  styleUrls: ['./reports-eti.component.scss']
})
export class ReportsETIComponent extends GenericPage {
  public maxSelectedLabels: number = null;
  public selectionLimit: number = null;
  public defaultOptions = GetTypes(EmployeeSelectStatusType, 0);
  public allEmployees: IOptionItem[];
  public employeeOptions: IOptionItem[];
  public payPeriods: IOptionItem[];
  public payPoints: IOptionItem[];
  public infoReportsPayload: IPayloadReport;
  public downloadedInformationReport: any;  //note: no proper model
  public etiReport: IReportResponse[];
  public downloadedETIReport: any;
  public columns: string[] = [
    'First Name', 'Last Name', 'Number', 'Identification Number', 'Age', 'Start Date', 'ETI Year', 'Month', 'Amount Claimable', 'Amount Used For Calculation'
  ];

  constructor(injector: Injector) {
    super(injector);
    this.form = this.fb.group({
      fromDate: new FormControl(undefined),
      toDate: new FormControl(undefined),
      employees: new FormControl(undefined, Validators.required),
      payPeriods: new FormControl(undefined),
      payPoints: new FormControl(undefined)
    });
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getDownloadedETIReportSelector)),
      this.store.pipe(select(getETIReportSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, payPeriods, payPoints, downloadedETIReport, etiReport]) => {
        this.allEmployees = employees.map(employee => ({ value: employee?.id, label: employee?.fullName, active: employee?.isActive }));
        this.allEmployees.unshift(...this.defaultOptions);
        this.employeeOptions = this.allEmployees;
        this.payPeriods = payPeriods.map((period: IPayPeriod) => ({ label: period.name, value: period.id }));
        this.payPoints = payPoints.map((payPoint: IPaypoint) => ({ label: payPoint.name, value: payPoint.id }));
        this.downloadedETIReport = Object.assign({}, downloadedETIReport);
        if (this.downloadedETIReport?.data?.fileContents) {
          const result = convertBase64ToBlob(this.downloadedETIReport.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          processDownloadedFile(result, downloadedETIReport, 'Employee Information Report');
        }
        this.etiReport = etiReport;
      })
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
    this.infoReportsPayload = {
      date: moment(value?.date).format(),
      employeeIds,
      implementSortingAndPaging: true,
      language: "en", //note: need to look at the proper lang culture
      payPeriodids: value?.payPeriods?.map((item: IOptionItem) => item.value) || [],
      payPointIds: value?.payPoints?.map((item: IOptionItem) => item.value) || []
    };
    this.store.dispatch(getETIReportsAction({ payload: this.infoReportsPayload }));
    this.store.dispatch(clearDownloadedETIReportsAction());
  }

  public isLoadingAsync = () => this.store.pipe(select(getReportsLoadingSelector));

  public onExport(): void {
    if (!this.downloadedInformationReport?.data)
      this.store.dispatch(downloadETIReportsAction({ payload: this.downloadedInformationReport }));
    else {
      const result = convertBase64ToBlob(this.downloadedInformationReport?.data?.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      processDownloadedFile(result, this.downloadedInformationReport, 'ETI Report');
    }
  }

  public get isAvailableForExport(): boolean {
    return this.etiReport?.length > 0
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
  }

  public onReset(): void {
    this.form.reset();
    this.etiReport = [];
    this.downloadedInformationReport = undefined;
  }
}
