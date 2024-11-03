import { Component, Injector, OnInit } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { IMonthlyUifSubmission, IUifSubmission } from '../../payroll.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { UIFStatusType } from '../../payroll.enum';
import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';
import { getDownloadedUIFPDFSubmissionSelector, getFilingDetailsSetupSubmissionSelector, getPayrollMonthlyUifSubmissionsSelector } from '../../store/payroll-submissions/payroll-submissions.selector';
import { filingDetailsSetupSubmissionsAction, generateUIFPDFSubmissionsAction, submitUIFSubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';

@Component({
  selector: 'kp-payroll-submissions-monthly-uif',
  templateUrl: './payroll-submissions-monthly-uif.component.html',
  styleUrls: ['./payroll-submissions-monthly-uif.component.scss']
})
export class PayrollSubmissionsMonthlyUifComponent extends GenericPage implements OnInit {
  public activeIndex: number = 0;
  public monthlyUifSubmissions = new Map<number, IMonthlyUifSubmission>();
  public uifSubmissions: IUifSubmission[];
  public empUiftatusType = UIFStatusType;
  public PAGINATION_VARS = PAGINATION_VARS;
  public downloadedUIFPDFSubmission: any;
  public selectedSubmissionId: number;
  public noUIFNumber: boolean = true;

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(filingDetailsSetupSubmissionsAction());
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollMonthlyUifSubmissionsSelector)),
      this.store.pipe(select(getDownloadedUIFPDFSubmissionSelector)),
      this.store.pipe(select(getFilingDetailsSetupSubmissionSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([monthlyUifSubmissions, downloadedUIFPDFSubmission, filingDetailsSetup]) => {
        if (monthlyUifSubmissions) {
          this.monthlyUifSubmissions = monthlyUifSubmissions;
          this.uifSubmissions = Array.from(monthlyUifSubmissions.values())
            ?.map(submission => submission?.uifSubmission);
        }
        this.downloadedUIFPDFSubmission = downloadedUIFPDFSubmission;
        if (this.downloadedUIFPDFSubmission) {
          const downloadedPayslip = this.downloadedUIFPDFSubmission?.get(this.selectedSubmissionId);
          if (downloadedPayslip)
            processPayrunDownload(downloadedPayslip?.data, this.getFileName);
        }
        if (filingDetailsSetup)
          this.noUIFNumber = filingDetailsSetup.uifNumber === '' || filingDetailsSetup.uifNumber === null;
      })
  }

  public onSubmitUIFSubmission(submissionId: number): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('UIFSubmissionCompletionConfirmationMessage'),
      accept: () => {
        if (submissionId)
          this.store.dispatch(submitUIFSubmissionsAction({ submissionId }));
        else
          console.log('submissionId invalid');
      }
    });
  }

  public generateUIFSubmissionPDF(submissionId: number): void {
    this.selectedSubmissionId = submissionId;
    if (this.downloadedUIFPDFSubmission)
      processPayrunDownload(this.downloadedUIFPDFSubmission?.data, this.getFileName);
    else {
      this.store.dispatch(generateUIFPDFSubmissionsAction({
        submissionId,
        language: 'en' //note: get this from global settings
      }))
    }
  }

  private get getFileName(): string {
    return 'UIFSubmission.pdf';
  }
}
