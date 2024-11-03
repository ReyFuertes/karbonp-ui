import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import * as moment from 'moment';

import { EmployeeSelectStatusType } from 'src/app/models/generic.enum';
import { IOptionItem, IPayPeriod, IPaypoint, ITaxPeriodDate } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { IPayloadReport, ISaveTemplateReportReponse } from '../../reports.model';
import { getMultiSelectEmployeesSelector, getPayPeriodsSelector, getPayPointsCurrentUserSelector } from 'src/app/store/app.selector';
import { getDetailedReportColumnsSelector, getDetailedReportTemplatesSelector, getDownloadedDetailedReportSelector, getReportDataSelector, getReportsLoadingSelector, getTaxPeriodDateSelector } from '../../store/reports.selector';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { CustomDefaultPeriods, PayrunStatus } from 'src/app/shared/constants/reports.constant';
import { clearDownloadedDetailedReportsAction, downloadDetailedReportsAction, getCurrentTaxPeriodAction, getReportsColumnAction, getReportsDataAction, getReportsDetailedPayrollTemplatesAction, saveTemplateReportsAction } from '../../store/reports.action';
import { CalculatePreviousBimester } from 'src/app/shared/util/func.util';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { convertBase64ToBlob } from 'src/app/shared/util/convert-to-blob';
import { isNumber, processDownloadedFile } from 'src/app/shared/util/formatting';

@Component({
  selector: 'kp-reports-detailed-payroll',
  templateUrl: './reports-detailed-payroll.component.html',
  styleUrls: ['./reports-detailed-payroll.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class ReportsDetailedPayrollComponent extends GenericPage {
  public defaultColumns: string[] = ['EmployeeName', 'EmployeeNumber', 'payPoint', 'organizationalUnit', 'Pay Run Date'];
  public reportName: string = 'Detailed Payroll Report';
  public defaultOptions = GetTypes(EmployeeSelectStatusType, 0);
  public allEmployees: IOptionItem[];
  public employeesMaxSelectedLabels: number = 100;
  public employeesSelectionLimit: number = null;
  public columnsSelectionLimit: number = null;
  public columnsMaxSelectedLabels: number = 100;
  public payPeriods: IOptionItem[];
  public payPoints: IOptionItem[];
  public employeeOptions: IOptionItem[];
  public detailReportsPayload: IPayloadReport;
  public downloadedDetailReport: any; //note: no proper model
  public detailReports: any[];
  public customPeriods: IOptionItem[];
  public payrunStatus: IOptionItem[];
  public previousTaxPeriod: ITaxPeriodDate;
  public taxPeriodDate: ITaxPeriodDate;
  public detailedReportColumns: IOptionItem[];
  public detailedPayrollReportViews: any[];
  public payItemTotals: any;
  public downloadedDetailedReport: any;
  public templateName: string = '';
  public reportTemplates: ISaveTemplateReportReponse[];
  public dynamicColumns: string[] = [];
  public isNumber = isNumber;

  constructor(
    injector: Injector) {
    super(injector);
    this.store.dispatch(getCurrentTaxPeriodAction());
    this.store.dispatch(getReportsColumnAction());
    this.store.dispatch(getReportsDetailedPayrollTemplatesAction());
    this.form = this.fb.group({
      dates: new FormControl(undefined, Validators.required),
      fromDate: new FormControl(undefined, Validators.required),
      toDate: new FormControl(undefined, Validators.required),
      employees: new FormControl(undefined, Validators.required),
      payPeriods: new FormControl(undefined),
      payPoints: new FormControl(undefined),
      columns: new FormControl(undefined),
      payRunStatus: new FormControl(undefined),
      templates: new FormControl(undefined)
    });
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getPayPointsCurrentUserSelector)),
      this.store.pipe(select(getTaxPeriodDateSelector)),
      this.store.pipe(select(getDetailedReportColumnsSelector)), //note: confusing implemention need re-implement or clarrify
      this.store.pipe(select(getReportDataSelector)),
      this.store.pipe(select(getDownloadedDetailedReportSelector)),
      this.store.pipe(select(getDetailedReportTemplatesSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, payPeriods, payPointsCurrentUser, taxPeriodDate, detailedReportColumns, reportData, downloadedDetailedReport, reportTemplates]) => {
        this.customPeriods = CustomDefaultPeriods
          ?.filter(option => option?.label)
          ?.map(option => Object.assign({}, option, { label: this.translateService.instant(option.label) }));
        if (this.currentCountryISOCode === 'MEX')
          this.customPeriods.push({ value: 1000, label: this.translateService.instant('LastBimester') });
        if (employees?.length > 0) {
          this.allEmployees = employees.map(employee => ({ value: employee?.id, label: employee?.fullName, active: employee?.isActive }));
          this.allEmployees.unshift(...this.defaultOptions);
          this.employeeOptions = this.allEmployees;
          this.onChangeEmployees({ value: this.defaultOptions, itemValue: this.defaultOptions[1] });
        }
        this.payrunStatus = PayrunStatus?.map(option => Object.assign({}, option, { label: this.translateService.instant(option.label) }));
        this.form.get('payRunStatus').patchValue(this.payrunStatus);
        this.payPeriods = payPeriods.map((period: IPayPeriod) => ({ label: period.name, value: period.id }));
        this.payPoints = payPointsCurrentUser.map((payPoint: IPaypoint) => ({ label: payPoint.name, value: payPoint.id }));
        this.taxPeriodDate = taxPeriodDate;
        if (this.taxPeriodDate) {
          this.previousTaxPeriod = {
            fromDate: moment(taxPeriodDate.fromDate).subtract(1, 'years').format(),
            toDate: moment(taxPeriodDate.toDate).subtract(1, 'years').endOf('month').format()
          }
        }
        if (reportData?.detailedPayrollReportViews.length > 0) {
          this.detailedPayrollReportViews = reportData?.detailedPayrollReportViews?.map(data => {
            const payItems: any[] = data?.payItems.sort((a, b) => a?.name.localeCompare(b?.name));
            return {
              employeeName: data?.employeeName,
              employeeNumber: data?.employeeNumber,
              organizationalUnit: data?.organizationalUnit,
              payDate: data?.payDate,
              payPoint: data?.payPoint,
              payRunDate: data?.payRunDate,
              ...Object.fromEntries(payItems.map((t) => [t?.name, t?.value]))
            };
          });
          if (reportData?.payItemTotals) {
            this.payItemTotals = Object.assign({},
              Object.fromEntries(reportData?.payItemTotals.map((t) => [this.capitalizeFirstLetter(t?.name), t?.value]))
            )
          }
          this.dynamicColumns = this.detailedPayrollReportViews
            ?.map(items => Object.keys(items))
            ?.flat(1)
            ?.filter((value, index, array) => array.indexOf(value) === index);
          this.detailedReportColumns = this.dynamicColumns?.map(column => ({ value: column, label: this.translateService.instant(this.capitalizeFirstLetter(column)) }));
          this.form.get('columns').patchValue(this.detailedReportColumns);
        } else {
          this.detailedReportColumns = detailedReportColumns?.map(column => ({ value: column, label: this.translateService.instant(this.capitalizeFirstLetter(column)) }));
          if (this.detailedReportColumns?.length > 0)
            this.form.get('columns').patchValue(this.detailedReportColumns);
        }
        this.downloadedDetailedReport = Object.assign({}, downloadedDetailedReport);
        if (this.downloadedDetailedReport?.data?.fileContents) {
          const result = convertBase64ToBlob(this.downloadedDetailedReport.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          processDownloadedFile(result, downloadedDetailedReport, this.reportName);
        }
        this.reportTemplates = reportTemplates;
      });
  }

  public onSelectTemplate(event: any): void {
    const selectedTemplate = this.reportTemplates.find(template => template?.id === event?.value);
    const formattedColumns = selectedTemplate?.selectedColumns.split(',');
    if (formattedColumns) {
      this.detailedReportColumns = formattedColumns?.map(column => ({ value: column, label: this.translateService.instant(this.capitalizeFirstLetter(column)) }));
      this.form.get('columns').patchValue(this.detailedReportColumns);
    }
    if (selectedTemplate?.toDate)
      this.form.get('toDate').patchValue(moment(selectedTemplate?.toDate).toDate());
    if (selectedTemplate?.fromDate)
      this.form.get('fromDate').patchValue(moment(selectedTemplate?.fromDate).toDate());
    const selectedPeriodFromTemplate = CustomDefaultPeriods.find(period => period.value === selectedTemplate?.selectedCustomPeriod);
    if (selectedPeriodFromTemplate)
      this.form.get('dates').patchValue(selectedPeriodFromTemplate?.value);
    if (selectedTemplate?.selectedPayrunStatus) {
      const selectedPayrunStatus = selectedTemplate.selectedPayrunStatus.split(',')
        ?.map(column => ({ value: column, label: this.translateService.instant(this.capitalizeFirstLetter(column)) }));
      this.form.get('payRunStatus').patchValue(selectedPayrunStatus);
    }
    if (selectedTemplate?.selectedPayPeriods) {
      const selectedPayPeriods = selectedTemplate.selectedPayPeriods.split(',')
        ?.map(column => ({ value: column, label: this.translateService.instant(this.capitalizeFirstLetter(column)) }));
      this.form.get('payPeriods').patchValue(selectedPayPeriods);
    }
    if (selectedTemplate?.selectedPayPoints) {
      const selectedPayPoints = selectedTemplate.selectedPayPoints.split(',')
        ?.map(column => ({ value: column, label: this.translateService.instant(this.capitalizeFirstLetter(column)) }));
      this.form.get('payPoints').patchValue(selectedPayPoints);
    }
  }

  public onSaveTemplate(): void {
    if (this.form.valid) {
      const payload: any = {
        id: 0,
        name: this.templateName,
        selectedColumns: this.form.get('columns').value?.map((column: IOptionItem) => this.capitalizeFirstLetter(column.value)),
        selectedEmployees: this.getEmployeeIds,
        selectedCustomPeriod: this.form.get('dates').value,
        selectedPayPoints: this.form.get('payPoints').value || [],
        selectedPayPeriods: this.form.get('payPeriods').value || [],
        selectedPayrunStatus: this.form.get('payRunStatus').value?.map((column: IOptionItem) => column.value),
        fromDate: this.form.get('fromDate').value,
        toDate: this.form.get('toDate').value,
      }
      this.store.dispatch(saveTemplateReportsAction({ payload }));
      this.loadReports();
      this.showModal = false;
    }
  }

  public onExport(): void {
    if (!this.downloadedDetailedReport?.data)
      this.store.dispatch(downloadDetailedReportsAction({ payload: this.detailReportsPayload }));
    else {
      const result = convertBase64ToBlob(this.downloadedDetailedReport?.data?.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      processDownloadedFile(result, this.downloadedDetailedReport, this.reportName);
    }
  }

  public get isAvailableForExport(): boolean {
    return this.detailedPayrollReportViews?.length > 0
      ? true
      : false;
  }

  public getPropertyValue(name: string): string {
    return this.payItemTotals.find((value: any) => value?.name === name)?.value;
  }

  public onChangeCustomPeriods(event: any): void {
    let { fromDate, toDate } = this.form.value;
    if (event?.value === 0) {
      toDate = moment().endOf('month').toDate();
      fromDate = moment().startOf('month').toDate();
    }
    else if (event?.value === 30) {
      fromDate = moment().subtract(1, 'months').startOf('month').toDate();
      toDate = moment().subtract(1, 'months').endOf('month').toDate();
    }
    else if (event?.value === 365) {
      fromDate = moment(this.taxPeriodDate.fromDate).toDate();
      toDate = moment(this.taxPeriodDate.toDate).toDate();
    }
    else if (event?.value === 366) {
      fromDate = this.previousTaxPeriod.fromDate;
      toDate = this.previousTaxPeriod.toDate;
    }
    else if (event?.value === 1000) {
      const dates = CalculatePreviousBimester();
      fromDate = dates.fromDate;
      toDate = dates.toDate;
    }
    else if (event?.value !== 1) {
      toDate = moment().toDate();
      fromDate = moment().subtract(event?.value, 'days').toDate();
    }
    this.form.get('fromDate').patchValue(moment(fromDate).toDate());
    this.form.get('toDate').patchValue(moment(toDate).toDate());
  }

  public isLoadingAsync = () => this.store.pipe(select(getReportsLoadingSelector));

  public onChangeEmployees(event: any): void {
    this.form.get('employees').patchValue(event?.value, { emitEvent: false });
    const hasDefaultOptions = event.value?.filter((option: any) => ['All', 'Active', 'Inactive'].includes(option.value));
    if (hasDefaultOptions?.length > 0) {
      this.employeesSelectionLimit = 1;
      const hasDefaultValues = ['All', 'Active', 'Inactive'].includes(event.itemValue?.value);
      if (hasDefaultValues) {
        const results = event.value.filter((value: IOptionItem) => {
          return [value].indexOf(event.itemValue) > -1;
        });
        this.form.get('employees').patchValue(results, { emitEvent: false });
      }
    } else
      this.employeesSelectionLimit = null;
  }

  public onFilter(): void {
    const value = this.form.value;
    if (this.form.valid) {
      this.detailReportsPayload = {
        fromDate: moment(value?.fromDate).format('DD/MM/yyyy'),
        toDate: moment(value?.toDate).format('DD/MM/yyyy'),
        employeeIds: this.getEmployeeIds,
        implementSortingAndPaging: true,
        language: "en", //note: need to look at the proper lang culture
        payPeriodids: value?.payPeriods?.map((item: IOptionItem) => item.value) || [],
        payPointIds: value?.payPoints?.map((item: IOptionItem) => item.value) || []
      };
      this.loadReports();
    }
  }

  public lowerFirstLetter(value: string): string {
    return value[0]?.toLowerCase() + value?.slice(1);
  }

  public capitalizeFirstLetter(value: string): string {
    return value[0]?.toUpperCase() + value?.slice(1);
  }

  public getPayItemsValue(name: string): string | number {
    return this.detailedPayrollReportViews?.find(value => value?.name?.toLowerCase() === name?.toLowerCase());
  }

  public checkIfColumnsVisible(value: string): boolean {
    return this.form.get('columns').value?.find((column: IOptionItem) => column.value.toLowerCase() === value.toLowerCase())
      ? true
      : false;
  }

  public onReset(): void {
    this.detailReports = [];
    this.downloadedDetailReport = undefined;
    this.detailedPayrollReportViews = [];
    this.dynamicColumns = [];
    this.form.get('fromDate').reset();
    this.form.get('toDate').reset();
    this.form.get('dates').reset();
    this.form.get('columns').reset();
    this.form.get('templates').reset();
  }

  private loadReports(): void {
    this.store.dispatch(getReportsDataAction({ payload: this.detailReportsPayload }));
    this.store.dispatch(clearDownloadedDetailedReportsAction());
  }

  private get getEmployeeIds(): number[] {
    let employeeIds: number[] = [];
    const value = this.form.value;
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
    return employeeIds || [];
  }
}