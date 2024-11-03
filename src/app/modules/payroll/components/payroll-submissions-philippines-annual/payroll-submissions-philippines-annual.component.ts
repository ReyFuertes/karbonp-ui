import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { IOptionItem } from 'src/app/models/generic.model';
import { IEmployee } from 'src/app/modules/employee/employee.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getdDownloadedAlphalistSchedule1ReportSubmissionSelector, getdDownloadedAnnualizationReportSubmissionSelector, getEmployeestotalCountSubmissionSelector, getEmployeesWithPayRunDataSubmissionSelector, getPayrollDownloadedPdfPHSubmissionsSelector, getPayrollTaxSeasonsSubmissionsSelector } from '../../store/payroll-submissions/payroll-submissions.selector';
import { ITaxSeason } from '../../payroll.model';
import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';
import { downloadPhilippinesSubmissionsAction, generateAlphalistSchedule1ReportSubmissionsAction, generateAnnualizationReportSubmissionsAction, getEmployeesWithPayRunDataSubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { IEmployeePaginationPayload } from 'src/app/modules/people/people.model';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';
import { SubmissionDocumentType } from '../../payroll.enum';

@Component({
  selector: 'kp-payroll-submissions-philippines-annual',
  templateUrl: './payroll-submissions-philippines-annual.component.html',
  styleUrls: ['./payroll-submissions-philippines-annual.component.scss']
})
export class PayrollSubmissionsPhilippinesAnnualComponent extends GenericPage implements OnInit {
  public selectedTaxSeason: any;
  public taxSeasons: IOptionItem[] = [];
  public employeesWithPayRunData: IEmployee[];
  public selectedMonth: string;
  public employeestotalCount: number;
  public paginationVars = PAGINATION_VARS;
  public defaultPagination: IEmployeePaginationPayload = {
    selfServiceEnabled: null,
    sortBy: 'LastName',
    searchText: '',
    sortAscending: true,
    pageNumber: PAGINATION_VARS.pageNumber,
    pagesize: PAGINATION_VARS.pagesize
  };
  public downloadedPdfPhSubmission: any;
  public selectedSubmissionDocumentType: number;
  public selectedEmployeeId: number;
  public downloadedAnnualizationReportSubmission: any;
  public showDownloadAnnualInfoModal: boolean = false;
  public initiateAnnualDownload: boolean = false;
  public downloadedAlphalistSchedule1ReportSubmission: any;
  public downloadFileName: string;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollTaxSeasonsSubmissionsSelector)),
      this.store.pipe(select(getEmployeesWithPayRunDataSubmissionSelector)),
      this.store.pipe(select(getEmployeestotalCountSubmissionSelector)),
      this.store.pipe(select(getPayrollDownloadedPdfPHSubmissionsSelector)),
      this.store.pipe(select(getdDownloadedAnnualizationReportSubmissionSelector)),
      this.store.pipe(select(getdDownloadedAlphalistSchedule1ReportSubmissionSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([taxSeasons, employeesWithPayRunData, employeestotalCount, downloadedPdfPhSubmission,
        downloadedAnnualizationReportSubmission, downloadedAlphalistSchedule1ReportSubmission
      ]) => {
        this.taxSeasons = taxSeasons
          ?.filter(tax => !tax.isMidTaxSeason)
          ?.map((tax: ITaxSeason) => {
            const fromDate = moment(tax?.fromDate).format('DD MMM YYYY');
            const toDate = moment(tax?.toDate).format('DD MMM YYYY');
            return {
              label: `${fromDate} - ${toDate}`,
              value: JSON.stringify({
                fromDate: moment(tax?.fromDate).format('DD/MM/YYYY'),
                toDate: moment(tax?.toDate).format('DD/MM/YYYY')
              })
            };
          });
        this.employeesWithPayRunData = employeesWithPayRunData;
        this.employeestotalCount = employeestotalCount;
        this.downloadedPdfPhSubmission = downloadedPdfPhSubmission;
        if (this.downloadedPdfPhSubmission) {
          const downloadedPayslip = this.downloadedPdfPhSubmission?.get(`${this.selectedSubmissionDocumentType}_${this.selectedMonth}`);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
        this.downloadedAnnualizationReportSubmission = downloadedAnnualizationReportSubmission;
        if (this.downloadedAnnualizationReportSubmission) {
          //note: refactor
          // const value = JSON.parse(this.selectedTaxSeason);
          // const downloadedAnnualizationReportSubmission = this.downloadedAnnualizationReportSubmission?.get(`${value?.fromDate}${value?.toDate}`);
          // if (downloadedAnnualizationReportSubmission)
          //   processPayrunDownload(downloadedAnnualizationReportSubmission?.data, 'AnnualReport.pdf');
          if (downloadedAnnualizationReportSubmission?.data)
            this.showDownloadAnnualInfoModal = false;
          else {
            if (this.initiateAnnualDownload)
              this.showDownloadAnnualInfoModal = true;
          }
        }
        this.downloadedAlphalistSchedule1ReportSubmission = downloadedAlphalistSchedule1ReportSubmission;
        if (this.downloadedAlphalistSchedule1ReportSubmission && this.selectedTaxSeason) {
          const value = JSON.parse(this.selectedTaxSeason);
          const downloadedPayslip = this.downloadedAlphalistSchedule1ReportSubmission?.get(`${value?.fromDate}${value?.toDate}`);
          if (downloadedPayslip)
            processPayrunDownload(downloadedPayslip?.data, this.getFileName);
        }
      })
  }

  public getScheduleReportExcelExport(): void {
    if (this.selectedTaxSeason) {
      this.downloadFileName = 'scheduleReportExcelExport.xlsx';
      const value = JSON.parse(this.selectedTaxSeason);
      this.selectedMonth = value?.toDate;
      const downloadedAlphalistSchedule1ReportSubmission = this.downloadedAlphalistSchedule1ReportSubmission?.get(`${value?.fromDate}${value?.toDate}`);
      if (downloadedAlphalistSchedule1ReportSubmission)
        processPayrunDownload(downloadedAlphalistSchedule1ReportSubmission?.data, this.getFileName);
      else {
        const payload = {
          fromDate: value.fromDate,
          toDate: value.toDate,
          language: 'en' //note: get this settings 
        }
        this.store.dispatch(generateAlphalistSchedule1ReportSubmissionsAction({ payload }));
      }
    }
  }

  public downloadAnnualizationReport(): void {
    if (this.selectedTaxSeason) {
      this.initiateAnnualDownload = true;
      const value = JSON.parse(this.selectedTaxSeason);
      const downloadedAnnualizationReportSubmission = this.downloadedAnnualizationReportSubmission?.get(`${value?.fromDate}${value?.toDate}`);
      if (downloadedAnnualizationReportSubmission)
        processPayrunDownload(downloadedAnnualizationReportSubmission?.data, this.getFileName);
      else {
        const payload = {
          fromDate: value.fromDate,
          toDate: value.toDate,
          language: 'en' //note: get this settings 
        }
        this.store.dispatch(generateAnnualizationReportSubmissionsAction({ payload }));
      }
    }
  }

  public onPaginateEmployees(event: any, searchText: string = ''): void {
    this.store.dispatch(getEmployeesWithPayRunDataSubmissionsAction({
      payload: Object.assign({}, this.defaultPagination, {
        pageNumber: event?.page === 0 ? 1 : (event?.page + 1),
        pagesize: event?.rows,
        searchText
      })
    }));
  }

  public onDownloadPdf(row: any): void {
    this.selectedMonth = row?.reportDate;
    this.selectedEmployeeId = row?.id;
    if (this.selectedTaxSeason)
      this.selectedMonth = JSON.parse(this.selectedTaxSeason)?.toDate;
    this.selectedSubmissionDocumentType = SubmissionDocumentType.BIR2316;
    const downloadedPdfSubmission = this.downloadedPdfPhSubmission?.get(`${this.selectedSubmissionDocumentType}_${this.selectedMonth}`);
    if (downloadedPdfSubmission)
      processPayrunDownload(downloadedPdfSubmission?.data, this.getFileName);
    else {
      this.store.dispatch(downloadPhilippinesSubmissionsAction({
        payload: {
          reportDate: this.selectedMonth,
          submissionDocumentType: this.selectedSubmissionDocumentType,
          employeeId: this.selectedEmployeeId
        }
      }))
    }
  }

  public onClear(): void {
    this.employeesWithPayRunData = [];
    this.selectedTaxSeason = undefined;
  }

  public onChangeTax(event: any): void {
    if (event?.value) {
      const value = JSON.parse(event.value);
      this.selectedTaxSeason = event.value;
      const payload = {
        fromDate: value?.fromDate,
        pageNumber: PAGINATION_VARS.pageNumber,
        pagesize: PAGINATION_VARS.pagesize,
        searchText: '',
        sortAscending: true,
        sortBy: 'LastName',
        toDate: value?.toDate
      }
      this.store.dispatch(getEmployeesWithPayRunDataSubmissionsAction({ payload }));
    }
  }

  private get getFileName(): string {
    let fileName: string;
    if (this.selectedSubmissionDocumentType === SubmissionDocumentType.BIR2316) {
      const { firstName, lastName } = this.employeesWithPayRunData.find(employee => employee.id === this.selectedEmployeeId);
      fileName = `${firstName.substring(0, 1)}_${lastName}_${SubmissionDocumentType[this.selectedSubmissionDocumentType]}_${this.selectedMonth}.pdf`;
    } else if (this.selectedSubmissionDocumentType)
      fileName = `${SubmissionDocumentType[this.selectedSubmissionDocumentType]?.toString()}_${this.selectedMonth}.pdf`;
    else
      fileName = `${this.downloadFileName}_${this.selectedMonth}.pdf`;
    return fileName;
  }
}
