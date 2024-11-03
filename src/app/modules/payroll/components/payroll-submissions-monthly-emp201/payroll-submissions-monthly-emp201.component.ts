import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { IEmp201Submission, IMonthlyEmp201Submission } from '../../payroll.model';
import { EMP201StatusType } from '../../payroll.enum';
import { getDownloadedEMP201PdfSubmissionSelector, getPayrollMonthlyEmp201SubmissionSelector } from '../../store/payroll-submissions/payroll-submissions.selector';
import { completeEMP201SubmissionsAction, generateEMP201PdfSubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';


@Component({
  selector: 'kp-payroll-submissions-monthly-emp201',
  templateUrl: './payroll-submissions-monthly-emp201.component.html',
  styleUrls: ['./payroll-submissions-monthly-emp201.component.scss']
})
export class PayrollSubmissionsMonthlyEmp201Component extends GenericPage implements OnInit {
  public columns: string[] = ['Month', 'Status', 'Submission date', 'Complete Date', '', ''];
  public activeIndex: number = 0;
  public monthlyEmp201Submissions = new Map<number, IMonthlyEmp201Submission>();
  public emp201Submissions: IEmp201Submission[];
  public emp201StatusType = EMP201StatusType;
  public PAGINATION_VARS = PAGINATION_VARS;
  public downloadedEMP201PdfSubmission: any;
  public selectedSubmissionId: number;

  constructor(injector: Injector) {
    super(injector);

    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollMonthlyEmp201SubmissionSelector)),
      this.store.pipe(select(getDownloadedEMP201PdfSubmissionSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([monthlyEmp201Submissions, downloadedEMP201PdfSubmission]) => {
        if (monthlyEmp201Submissions) {
          this.monthlyEmp201Submissions = monthlyEmp201Submissions;
          this.emp201Submissions = Array.from(monthlyEmp201Submissions.values())
            ?.map(submission => submission?.emP201Submission);
        }
        this.downloadedEMP201PdfSubmission = downloadedEMP201PdfSubmission;
        if (this.downloadedEMP201PdfSubmission) {
          const downloadedPayslip = this.downloadedEMP201PdfSubmission?.get(this.selectedSubmissionId);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
      })
  }

  public generateEMP201SubmissionPDF(submissionId: number): void {
    this.selectedSubmissionId = submissionId;
    if (this.downloadedEMP201PdfSubmission)
      processPayrunDownload(this.downloadedEMP201PdfSubmission?.data, this.getFileName);
    else {
      this.store.dispatch(generateEMP201PdfSubmissionsAction({
        submissionId,
        language: 'en' //note: get this from global settings
      }))
    }
  }

  public completeEMP201Submission(submissionId: number): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('EMP201SubmissionCompletionConfirmationMessage'),
      accept: () => {
        if (submissionId)
          this.store.dispatch(completeEMP201SubmissionsAction({ submissionId }));
        else
          console.log('submissionId invalid');
      }
    });
  }

  private get getFileName(): string {
    return 'EMP201Submission.pdf';
  }
}
