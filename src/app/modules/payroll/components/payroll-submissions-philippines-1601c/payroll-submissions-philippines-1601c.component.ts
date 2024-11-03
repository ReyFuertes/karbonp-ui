import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import * as moment from 'moment';

import { GetTypes } from 'src/app/shared/util/types.util';
import { CategoryOfWithholdingAgentType, SubmissionDocumentType } from '../../payroll.enum';
import { BooleanType } from 'src/app/models/generic.enum';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getdownloadedUser1601CPDFSubmissionSelector, getPhilippines1601CSubmissionsSelector } from '../../store/payroll-submissions/payroll-submissions.selector';
import { generateUser1601CPDFSubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-submissions-philippines-1601c',
  templateUrl: './payroll-submissions-philippines-1601c.component.html',
  styleUrls: ['./payroll-submissions-philippines-1601c.component.scss']
})
export class PayrollSubmissionsPhilippines1601cComponent extends GenericPage implements OnInit {
  public month: string;
  public categoryOfWithholdingAgentOptions = GetTypes(CategoryOfWithholdingAgentType, 0);
  public booleanTypeOptions = GetTypes(BooleanType, 0);
  public downloadedUser1601CPDFSubmission: any;

  constructor(inject: Injector, private route: ActivatedRoute) {
    super(inject);
    this.route.paramMap
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(params => {
        this.month = params.get('month');
      });
    /**
     * mismatching fields
     * tinNumber taxIdentificationNumber
     * rdoCode revenueDistrictOffice
     * addressCode addressPostalCode
     * companyName companyTradingName
     * taxableCompensationNotSubjectWithholdingTax underAnnualTaxIncome
     * totalTaxesWithheld totalTax
     * taxesWithheldForRemittance totalTax
     * totalAmountStillDue totalTax
     */
    this.form = new FormGroup({
      submissionMonth: new FormControl(undefined),
      isAmended: new FormControl(false),
      isTaxWithheld: new FormControl(false),
      tinNumber: new FormControl(undefined),
      rdoCode: new FormControl(undefined),
      companyName: new FormControl(undefined),
      addressLine1: new FormControl(undefined),
      addressLine2: new FormControl(undefined),
      addressCode: new FormControl(undefined),
      contactNumber: new FormControl(undefined),
      category: new FormControl(undefined),
      email: new FormControl(undefined),
      isTaxRelief: new FormControl(undefined),
      taxReliefDetails: new FormControl(undefined),
      totalCompensationLessNonTaxable: new FormControl(undefined),
      statutoryMinimumWage: new FormControl(undefined),
      holidayOvertimeNightShiftHazardPay: new FormControl(undefined),
      thirteenthMonthPayOtherBenefits: new FormControl(undefined),
      deMinimisBenefits: new FormControl(undefined),
      contributionsEmployee: new FormControl(undefined),
      otherNonTaxableCompensation: new FormControl(undefined),
      otherNonTaxableCompensationSpecify: new FormControl(undefined),
      totalNonTaxableCompensation: new FormControl(undefined),
      totalTaxableCompensation: new FormControl(undefined),
      taxableCompensationNotSubjectWithholdingTax: new FormControl(undefined),
      netTaxableCompensation: new FormControl(undefined),
      totalTaxesWithheld: new FormControl(undefined),
      previousMonthTaxesWithheldAdjustment: new FormControl(undefined),
      taxesWithheldForRemittance: new FormControl(undefined),
      taxRemittedInPreviousReturnFiled: new FormControl(undefined),
      otherRemittancesMade: new FormControl(undefined),
      otherRemittancesMadeSpecify: new FormControl(undefined),
      totalTaxRemittancesMade: new FormControl(undefined),
      taxStillDue: new FormControl(undefined),
      surcharge: new FormControl(undefined),
      interest: new FormControl(undefined),
      compromise: new FormControl(undefined),
      totalPenalties: new FormControl(undefined),
      totalAmountStillDue: new FormControl(undefined),
      taxAgentAccreditationNumber: new FormControl(undefined),
      dateOfIssue: new FormControl(undefined),
      dateOfExpiry: new FormControl(undefined),
      cashBankAgency: new FormControl(undefined),
      cashNumber: new FormControl(undefined),
      cashDate: new FormControl(undefined),
      cashAmount: new FormControl(undefined),
      checkBankAgency: new FormControl(undefined),
      checkNumber: new FormControl(undefined),
      checkDate: new FormControl(undefined),
      checkAmount: new FormControl(undefined),
      debitMemoNumber: new FormControl(undefined),
      debitMemoDate: new FormControl(undefined),
      debitMemoAmount: new FormControl(undefined),
      otherParticulars: new FormControl(undefined),
      otherBankAgency: new FormControl(undefined),
      otherNumber: new FormControl(undefined),
      otherDate: new FormControl(undefined),
      otherAmount: new FormControl(undefined),
      underAnnualTaxIncome: new FormControl(undefined),
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPhilippines1601CSubmissionsSelector)),
      this.store.pipe(select(getdownloadedUser1601CPDFSubmissionSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([philippines1601CSubmissions, downloadedUser1601CPDFSubmission]) => {
        if (philippines1601CSubmissions)
          this.form.patchValue(philippines1601CSubmissions);
        this.downloadedUser1601CPDFSubmission = downloadedUser1601CPDFSubmission;
        if (this.downloadedUser1601CPDFSubmission) {
          const downloadedPayslip = this.downloadedUser1601CPDFSubmission?.get(this.form.value?.submissionMonth);
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

  public onGenerate(): void {
    const payload = Object.assign({}, this.form.value, {
      dateOfIssue: moment(this.form.value?.dateOfIssue).format('DD/MM/YYYY'),
      dateOfExpiry: moment(this.form.value?.dateOfIssue).format('DD/MM/YYYY'),
      cashDate: moment(this.form.value?.dateOfIssue).format('DD/MM/YYYY'),
      checkDate: moment(this.form.value?.dateOfIssue).format('DD/MM/YYYY'),
      debitMemoDate: moment(this.form.value?.dateOfIssue).format('DD/MM/YYYY'),
      otherDate: moment(this.form.value?.dateOfIssue).format('DD/MM/YYYY')
    });
    if (this.downloadedUser1601CPDFSubmission)
      processPayrunDownload(this.downloadedUser1601CPDFSubmission?.data, this.getFileName);
    else
      this.store.dispatch(generateUser1601CPDFSubmissionsAction({ payload }));
  }

  public onBack(): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, 'payroll/submissions');
  }

  private get getFileName(): string {
    const date = new Date(this.form.value?.submissionMonth);
    return `${SubmissionDocumentType[SubmissionDocumentType.BIR1601C].toString()}_${date.toLocaleString('default', { month: 'short' })}_${date.getFullYear().toString().substring(2, 4)}.pdf`;
  }
}
