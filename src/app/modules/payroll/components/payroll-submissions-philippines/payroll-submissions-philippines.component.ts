import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getPayrollDownloadedPdfPHSubmissionsSelector, getPayrollPhilippinesSubmissionsSelector } from '../../store/payroll-submissions/payroll-submissions.selector';
import { IPhilippinesSubmission } from '../../payroll.model';
import { downloadPhilippinesSubmissionsAction, get1601CDataSubmissionsAction, getPhilippinesMonthlySubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { SubmissionDocumentType } from '../../payroll.enum';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';
import { PH_SUBMISSIONS_ROUTES } from 'src/app/shared/constants/generic.constant';

@Component({
  selector: 'kp-payroll-submissions-philippines',
  templateUrl: './payroll-submissions-philippines.component.html',
  styleUrls: ['./payroll-submissions-philippines.component.scss']
})
export class PayrollSubmissionsPhilippinesComponent extends GenericPage implements OnInit {
  public activeIndex: number = 0;
  public philippinesSubmissions: IPhilippinesSubmission[] = [];
  public submissionDocumentType = SubmissionDocumentType;
  public downloadedPdfSubmissionsPh = new Map<string, any>();
  public selectedMonth: string;
  public selectedSubmissionDocumentType: SubmissionDocumentType;

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(getPhilippinesMonthlySubmissionsAction());
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollPhilippinesSubmissionsSelector)),
      this.store.pipe(select(getPayrollDownloadedPdfPHSubmissionsSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([philippinesSubmissions, downloadedPdfSubmissionsPh]) => {
        this.philippinesSubmissions = philippinesSubmissions;
        this.downloadedPdfSubmissionsPh = downloadedPdfSubmissionsPh;
        if (this.downloadedPdfSubmissionsPh) {
          const downloadedPayslip = this.downloadedPdfSubmissionsPh?.get(`${this.selectedSubmissionDocumentType}_${this.selectedMonth}`);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getFileName(this.selectedSubmissionDocumentType, new Date(this.selectedMonth)));
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
      })
  }

  public onEdit(submissionDocumentType: number, reportDate: string): void {
    this.store.dispatch(get1601CDataSubmissionsAction({
      payload: { reportDate: moment(reportDate).format('DD/MM/YYYY'), submissionDocumentType }
    }));
    this.router.navigateByUrl(`payroll/submissions${(PH_SUBMISSIONS_ROUTES as any)[submissionDocumentType]}/${reportDate}`);
  }

  public onDownloadPdf(submissionDocumentType: SubmissionDocumentType, month: string): void {
    this.selectedMonth = moment(month).format('DD/MM/YYYY');
    this.selectedSubmissionDocumentType = submissionDocumentType;
    const downloadedPdfSubmission = this.downloadedPdfSubmissionsPh?.get(`${this.selectedSubmissionDocumentType}_${this.selectedMonth}`);
    if (downloadedPdfSubmission) {
      try {
        processPayrunDownload(downloadedPdfSubmission?.data, this.getFileName(this.selectedSubmissionDocumentType, new Date(this.selectedMonth)));
      } catch (error) {
        this.showError(error as string);
      }
    }
    else {
      this.store.dispatch(downloadPhilippinesSubmissionsAction({
        payload: {
          reportDate: this.selectedMonth,
          submissionDocumentType,
          employeeId: null
        }
      }))
    }
  }

  public getFileName(submissionDocumentType: SubmissionDocumentType, date: Date): string {
    let fileName: string;
    if (submissionDocumentType === SubmissionDocumentType.BIR2316) {
      //note: refactor
      //const { firstName, lastName } = this.employees.find(e => e.id === employeeId);
      const firstName: string = '';
      const lastName: string = '';
      fileName = `${firstName?.substring(0, 1)}_${lastName}_${SubmissionDocumentType[submissionDocumentType]}_${date.getFullYear()}.pdf`;
    } else
      fileName = `${SubmissionDocumentType[submissionDocumentType].toString()}_${date.toLocaleString('default', { month: 'short' })}_${date.getFullYear().toString().substring(2, 4)}.pdf`;
    return fileName;
  }
}