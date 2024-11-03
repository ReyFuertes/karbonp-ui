import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getDownloadedEMP501PDFSelector, getDownloadedIRP5EasyfileExportSelector, getDownloadedIRP5IT3ASubmissionSelector, getPayrollAnnualIrp5It3SubmissionsSelector, getPayrollLoadingSubmissionSelector, getPayrollTaxSeasonsSubmissionsSelector } from '../../store/payroll-submissions/payroll-submissions.selector';
import { IIrp5Summission, ITaxSeason, IValidateIRP5IT3AError, IValidateIRP5IT3ASubmission } from '../../payroll.model';
import { IOptionItem } from 'src/app/models/generic.model';
import { finalizeIRP5IT3ASubmissionsAction, generateEMP501PDFSubmissionsAction, generateIRP5EasyfileExportSubmissionsAction, generateIRP5IT3ASubmissionsAction, getAnnualIRP5IT3ASubmissionsAction } from '../../store/payroll-submissions/payroll-submissions.action';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';

@Component({
  selector: 'kp-payroll-submissions-annual-irp5-it3',
  templateUrl: './payroll-submissions-annual-irp5-it3.component.html',
  styleUrls: ['./payroll-submissions-annual-irp5-it3.component.scss']
})
export class PayrollSubmissionsAnnualIrp5It3Component extends GenericPage implements OnInit {
  public selectedTaxSeason: any;
  public taxSeasons: IOptionItem[] = [];
  public annualIrp5It3: { IIrp5Summission: IIrp5Summission[], validateIRP5IT3A: IValidateIRP5IT3ASubmission[] };
  public iRP5IT3s: IValidateIRP5IT3ASubmission[];
  public downloadedIRP5IT3ASubmission: any;
  public selectedEmployeeId: number;
  public selectedDates: { fromDate: string, toDate: string };
  public notFinalised: boolean = false;
  public downloadedIRP5EasyfileExport: any;
  public downloadedEMP501PDF: any;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrollTaxSeasonsSubmissionsSelector)),
      this.store.pipe(select(getPayrollAnnualIrp5It3SubmissionsSelector)),
      this.store.pipe(select(getDownloadedIRP5IT3ASubmissionSelector)),
      this.store.pipe(select(getDownloadedIRP5EasyfileExportSelector)),
      this.store.pipe(select(getDownloadedEMP501PDFSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([taxSeasons, annualIrp5It3, downloadedIRP5IT3ASubmission, downloadedIRP5EasyfileExport,
        downloadedEMP501PDF
      ]) => {
        this.taxSeasons = taxSeasons?.map((tax: ITaxSeason) => {
          const fromDate = moment(tax?.fromDate).format('DD MMM YYYY');
          const toDate = moment(tax?.toDate).format('DD MMM YYYY');
          return {
            label: `${fromDate} - ${toDate}`,
            value: JSON.stringify({ fromDate, toDate })
          };
        });
        this.annualIrp5It3 = annualIrp5It3;
        this.iRP5IT3s = annualIrp5It3?.validateIRP5IT3A?.flatMap(vIRP5IT3A => vIRP5IT3A);
        this.notFinalised = this.annualIrp5It3?.IIrp5Summission.some((submission: { isFinalised: boolean; }) => submission?.isFinalised === false);
        this.downloadedIRP5IT3ASubmission = downloadedIRP5IT3ASubmission;
        if (this.downloadedIRP5IT3ASubmission) {
          const downloadedData = this.downloadedIRP5IT3ASubmission?.get(this.selectedEmployeeId);
          if (downloadedData) {
            try {
              processPayrunDownload(downloadedData?.data, this.getFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
        this.downloadedIRP5EasyfileExport = downloadedIRP5EasyfileExport;
        if (this.downloadedIRP5EasyfileExport) {
          const downloadedData = this.downloadedIRP5EasyfileExport?.get(this.getKeyDates);
          if (downloadedData) {
            try {
              processPayrunDownload(downloadedData?.data, this.getIRP5EasyFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
        this.downloadedEMP501PDF = downloadedEMP501PDF;
        if (this.downloadedEMP501PDF) {
          const downloadedData = this.downloadedEMP501PDF?.get(this.getKeyDates);
          if (downloadedData) {
            try {
              processPayrunDownload(downloadedData?.data, this.emp510FileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
      })
  }

  public generateIRP5IT3ASubmissionPDF(annualIrp5It3: IIrp5Summission): void {
    this.selectedEmployeeId = annualIrp5It3?.employeeId;
    if (this.downloadedIRP5IT3ASubmission)
      processPayrunDownload(this.downloadedIRP5IT3ASubmission?.data, this.getFileName);
    else {
      this.store.dispatch(generateIRP5IT3ASubmissionsAction({
        payload: {
          employeeId: annualIrp5It3?.employeeId,
          fromDate: moment(this.selectedDates?.fromDate).format('DD/MM/YYYY'),
          language: "en",
          toDate: moment(this.selectedDates?.toDate).format('DD/MM/YYYY'),
          type: annualIrp5It3.type
        }
      }))
    }
  }

  public generatEMP501SubmissionPDF(): void {
    if (this.downloadedEMP501PDF)
      processPayrunDownload(this.downloadedEMP501PDF?.data, this.emp510FileName);
    else {
      this.store.dispatch(generateEMP501PDFSubmissionsAction({
        payload: {
          fromDate: moment(this.selectedDates?.fromDate).format('DD/MM/YYYY'),
          toDate: moment(this.selectedDates?.toDate).format('DD/MM/YYYY'),
          language: 'en' //note: get this from global settings
        }
      }))
    }
  }

  public get isFinalized(): boolean {
    return this.annualIrp5It3?.IIrp5Summission?.length > 0 && !this.notFinalised;
  }

  public reValidateIRP5IT3ASubmissions(): void {
    this.store.dispatch(getAnnualIRP5IT3ASubmissionsAction({
      payload: {
        fromDate: moment(this.selectedDates?.fromDate).format('DD/MM/YYYY'),
        toDate: moment(this.selectedDates?.toDate).format('DD/MM/YYYY')
      }
    }))
  }

  public finalizeIRP5IT3ASubmissions(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('AreyousureyouwanttofinalisetheSubmissionstoSelfService'),
      accept: () => {
        this.store.dispatch(finalizeIRP5IT3ASubmissionsAction({
          payload: {
            fromDate: moment(this.selectedDates?.fromDate).format('DD/MM/YYYY'),
            toDate: moment(this.selectedDates?.toDate).format('DD/MM/YYYY')
          }
        }))
      }
    });
  }

  public generateIRP5EasyfileExport(): void {
    if (this.downloadedIRP5IT3ASubmission)
      processPayrunDownload(this.downloadedIRP5IT3ASubmission?.data, this.getIRP5EasyFileName);
    else {
      this.store.dispatch(generateIRP5EasyfileExportSubmissionsAction({
        payload: {
          fromDate: moment(this.selectedDates?.fromDate).format('DD/MM/YYYY'),
          toDate: moment(this.selectedDates?.toDate).format('DD/MM/YYYY')
        }
      }))
    }
  }

  public onEdit(error: IValidateIRP5IT3AError): void {
    if (error?.isFilingDetailError) {
      console.log('On edit')
    }
    else {
      console.log('Goto employee details')
    }
    alert('Not Implemented')
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrollLoadingSubmissionSelector));

  public onChangeTax(event: any): void {
    if (event?.value) {
      this.selectedDates = JSON.parse(event.value);
      this.store.dispatch(getAnnualIRP5IT3ASubmissionsAction({
        payload: {
          fromDate: moment(this.selectedDates?.fromDate).format('DD/MM/YYYY'),
          toDate: moment(this.selectedDates?.toDate).format('DD/MM/YYYY')
        }
      }))
    }
  }

  private get getIRP5EasyFileName(): string {
    return `TaxCertificates_${moment(this.selectedDates?.toDate).format('DD/MM/YYYY')}`;
  }

  private get getFileName(): string {
    return 'EMP201Submission.pdf';
  }

  private get emp510FileName(): string {
    return `EMP501-${moment(this.selectedDates?.toDate).format('DD/MM/YYYY')}.pdf`;
  }

  private get getKeyDates(): string {
    return `${moment(this.selectedDates?.fromDate).format('DD/MM/YYYY')}${moment(this.selectedDates?.toDate).format('DD/MM/YYYY')}`;
  }
}
