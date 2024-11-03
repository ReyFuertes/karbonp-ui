import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { EmployeeSelectStatusType } from 'src/app/models/generic.enum';
import { IOptionItem, IOrganizationalUnit, IPayPeriod, IPaypoint } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getMultiSelectEmployeesSelector, getPayPeriodsSelector, getPayPointsSelector } from 'src/app/store/app.selector';
import { IPayloadReport, IReportResponse } from '../../reports.model';
import { clearDownloadedInformationReportsAction, downloadInformationReportsAction, getInformationReportsAction } from '../../store/reports.action';
import { getDownloadedInformationReportSelector, getInformationReportSelector, getReportsLoadingSelector } from '../../store/reports.selector';
import { processDownloadedFile } from 'src/app/shared/util/formatting';
import { convertBase64ToBlob } from 'src/app/shared/util/convert-to-blob';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';

@Component({
  selector: 'kp-reports-information',
  templateUrl: './reports-information.component.html',
  styleUrls: ['./reports-information.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class ReportsInformationComponent extends GenericPage {
  public columns: string[] = [
    'Employee Number', 'Mobile Number', 'Landline', 'Email', 'Job Title', 'Income Tax Number', 'Date Of Birth', 'Identification Number', 'Passport / Foreign ID Number', 'Passport Country Code', 'Start Date', 'Last Day of Service', 'Payment Method', 'Residential Address Address Line 1', 'Residential Address Address Line 2', 'Residential Address City', 'Residential Address Postal Code', 'Residential Address State / Province', 'Residential Address Country	', 'Same As Residential Postal Address', 'Postal Address Address Line 1', 'Postal Address Address Line 2', 'Postal Address City', 'Postal Address Postal Code', 'Postal Address State / Province', 'Postal Address Country', 'Bank', 'Account Number', 'Branch Code', 'Account Type', 'Account Owner', 'Organizational Unit'
  ];
  public maxSelectedLabels: number = null;
  public selectionLimit: number = null;
  public defaultOptions = GetTypes(EmployeeSelectStatusType, 0);
  public allEmployees: IOptionItem[];
  public employeeOptions: IOptionItem[];
  public payPeriods: IOptionItem[];
  public payPoints: IOptionItem[];
  public infoReportsPayload: IPayloadReport;
  public downloadedInformationReport: any;  //note: no proper model
  public informationReport: IReportResponse[];

  constructor(injector: Injector) {
    super(injector);
    this.form = this.fb.group({
      employees: new FormControl(undefined, Validators.required),
      payPeriods: new FormControl(undefined),
      payPoints: new FormControl(undefined)
    });
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getDownloadedInformationReportSelector)),
      this.store.pipe(select(getInformationReportSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, payPeriods, payPoints, downloadedInformationReport, informationReport]) => {
        this.allEmployees = employees.map(employee => ({ value: employee?.id, label: employee?.fullName, active: employee?.isActive }));
        this.allEmployees.unshift(...this.defaultOptions);
        this.employeeOptions = this.allEmployees;
        this.payPeriods = payPeriods.map((period: IPayPeriod) => ({ label: period.name, value: period.id }));
        this.payPoints = payPoints.map((payPoint: IPaypoint) => ({ label: payPoint.name, value: payPoint.id }));
        this.downloadedInformationReport = Object.assign({}, downloadedInformationReport);
        if (this.downloadedInformationReport?.data?.fileContents) {
          const result = convertBase64ToBlob(this.downloadedInformationReport.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          processDownloadedFile(result, downloadedInformationReport, 'Employee Information Report');
        }
        this.informationReport = informationReport;
      })
  }

  public onExport(): void {
    if (!this.downloadedInformationReport?.data)
      this.store.dispatch(downloadInformationReportsAction({ payload: this.infoReportsPayload }));
    else {
      const result = convertBase64ToBlob(this.downloadedInformationReport?.data?.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      processDownloadedFile(result, this.downloadedInformationReport, 'Employee Information Report');
    }
  }

  public isLoadingAsync = () => this.store.pipe(select(getReportsLoadingSelector));

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

  public get isAvailableForExport(): boolean {
    return this.informationReport?.length > 0
      ? true
      : false;
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
    this.store.dispatch(getInformationReportsAction({ payload: this.infoReportsPayload }));
    this.store.dispatch(clearDownloadedInformationReportsAction());
  }

  public onReset(): void {
    this.form.reset();
    this.informationReport = [];
    this.downloadedInformationReport = undefined;
  }

  public getOrganizationalUnitData(organizationalUnit: IOrganizationalUnit) {
    if (organizationalUnit != null)
      return `${organizationalUnit?.code} - ${organizationalUnit?.name}`;
    else
      return null;
  }
}