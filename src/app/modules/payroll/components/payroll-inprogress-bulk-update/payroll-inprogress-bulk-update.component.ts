import { Component, Injector, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { combineLatest, take, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { EmployeeBulkImportStatusType } from 'src/app/models/generic.enum';
import { SignalRService } from 'src/app/services/signalr.service';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { convertBase64ToBlob, convertBlobToBase64 } from 'src/app/shared/util/convert-to-blob';
import { checkFileSizeLimitExceeded } from 'src/app/shared/util/document.util';
import { downloadBulkUpdateExcelAction, getPayRunBulkImportViewAction, uploadPayrollBulkImportUpdateAction } from '../../store/payrun-bulk-update/payrun-bulk-update.action';
import { getBulkPayRunUpdateOptionSelector, getPayrollDownloadBulkImportFileSelector, getPayRunBulkImportViewSelector, getPayrunBulkUpdateSetupDataSelector } from '../../store/payrun-bulk-update/payrun-bulk-update.selector';
import { processDownloadedFile } from 'src/app/shared/util/formatting';
import { IPayrollSetup, IPayrunBulkUpdateOption } from '../../payroll.model';

@Component({
  selector: 'kp-payroll-inprogress-bulk-update',
  templateUrl: './payroll-inprogress-bulk-update.component.html',
  styleUrls: ['./payroll-inprogress-bulk-update.component.scss']
})
export class PayrollInprogressBulkUpdateComponent extends GenericPage implements OnInit, OnChanges {
  @ViewChild('fileUploadControl') public fileUploadControl: FileUpload;
  @Input() public payRunId: number;

  public bulkImportForm: FormGroup;
  public bulkImportView: any; //note: no proper model
  public downloadedBulkImportFile: any;//note: no proper model
  public downloadState: boolean = false; //note refactor
  public employeeBulkImportStatusType = EmployeeBulkImportStatusType;
  public progressValue: number = 0;
  public interval: NodeJS.Timeout;
  public bulkUpdateSetupData: IPayrollSetup;
  public bulkPayRunUpdateOption: IPayrunBulkUpdateOption;

  constructor(injector: Injector,
    public signalRService: SignalRService,
    public zone: NgZone,
  ) {
    super(injector);
    signalRService.payRunBulkImportEmmitter
      .subscribe((data) => {
        this.zone.run(() => {
          if (this.bulkImportView?.status !== data.status) {
            this.bulkImportView.status = data.status;
            if (this.payRunId)
              this.store.dispatch(getPayRunBulkImportViewAction({ payRunId: this.payRunId }));
          }
          else {
            this.bulkImportView = data;
            this.interval = setInterval(() => {
              this.zone.run(() => {
                this.progressValue = this.bulkImportView?.importProgress;
                if (this.progressValue === 99) {
                  this.progressValue = 100;
                  clearInterval(this.interval);
                }
              });
            });
          }
        });
      });
    this.bulkImportForm = new FormGroup({
      recalculatePayslipsToggleDefault: new FormControl(true),
      file: new FormControl(undefined, Validators.required),
      isHoursImport: new FormControl(false),
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrunBulkUpdateSetupDataSelector)),
      this.store.pipe(select(getPayrollDownloadBulkImportFileSelector)),
      this.store.pipe(select(getPayRunBulkImportViewSelector)),
      this.store.pipe(select(getBulkPayRunUpdateOptionSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([bulkUpdateSetupData, downloadedBulkImportFile, bulkImportView, bulkPayRunUpdateOption]) => {
        this.bulkUpdateSetupData = bulkUpdateSetupData;
        this.bulkImportView = bulkImportView;
        if (this.bulkImportView) {
          this.bulkImportView = Object.assign({}, this.bulkUpdateSetupData?.payRunBulkImport);
          if (this.bulkImportView !== null && this.bulkImportView.status !== this.employeeBulkImportStatusType.Completed)
            this.signalRService.linkTimeOffBulkImportGroup(this.bulkImportView.id);
          else if (this.bulkImportView != null && this.bulkImportView.importBusyProcessing)
            this.bulkImportView = { status: this.employeeBulkImportStatusType.Completed, errors: ['vImportInstanceAlreadyStarted'] };
        }
        else
          this.bulkImportView = { status: this.employeeBulkImportStatusType.Completed, errors: ['vImportFormatIncorrect'] };
        this.downloadedBulkImportFile = Object.assign({}, downloadedBulkImportFile);
        if (this.downloadedBulkImportFile?.data?.fileContents && this.downloadState === true) {
          const result = convertBase64ToBlob(this.downloadedBulkImportFile.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          processDownloadedFile(result, this.downloadedBulkImportFile, 'Bulk Pay Run Update.xlsx');
          this.downloadState = false;
        }
        this.bulkPayRunUpdateOption = bulkPayRunUpdateOption;
        if (this.bulkPayRunUpdateOption)
          this.form.patchValue(this.bulkPayRunUpdateOption);
      })
  }

  override ngOnChanges(changes: SimpleChanges): void {
    this.payRunId = changes['payRunId']?.currentValue;
  }

  public downloadTemplateFile(): void {
    if (!this.downloadedBulkImportFile?.data)
      this.store.dispatch(downloadBulkUpdateExcelAction({
        payload: {
          employeeIds: [],
          language: "en", //note: get this from global setting
          payPointIds: [],
          payRunId: this.payRunId
        }
      }));
    else {
      const result = convertBase64ToBlob(this.downloadedBulkImportFile.data.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      this.processDownloadedFile(result);
    }
    this.downloadState = true;
  }

  public onDocumentChange(event: any): void {
    if (event.currentFiles && event.currentFiles.length) {
      const [file] = event.currentFiles;
      const fileSize = event.currentFiles[0].size;
      if (checkFileSizeLimitExceeded(fileSize))
        this.bulkImportForm.controls['file'].setErrors({ invalid: true });
      else {
        this.bulkImportForm.controls['file'].setErrors(null);
        convertBlobToBase64(file)
          .pipe(take(1), takeUntil(this.$unsubscribe))
          .subscribe((b64: any) => {
            if (b64)
              this.bulkImportForm.patchValue({ file: window.btoa(b64) });
          })
      }
    }
  }

  public onUploadBulkImport(): void {
    if (this.bulkImportForm.valid && this.payRunId) {
      this.store.dispatch(uploadPayrollBulkImportUpdateAction({
        payload: Object.assign({}, this.bulkImportForm.value, { isHoursImport: false }),
        payRunId: this.payRunId,
      }));
      setTimeout(() => {
        this.fileUploadControl.clear();
        this.bulkImportForm.controls['file'].reset();
      }, 300);
    }
  }

  private processDownloadedFile(result: Blob): void {
    try {
      if (result) {
        const fileName = '.xlsx';
        const navigator = (window.navigator as any);
        if (navigator?.msSaveOrOpenBlob)
          navigator.msSaveOrOpenBlob(new Blob([this.downloadedBulkImportFile], { type: 'text/excel' }), fileName); // for IE
        else {
          const doc = document.createElement('a');
          doc.href = window.URL.createObjectURL(result);
          doc.download = fileName
          document.body.appendChild(doc);
          doc.click();
          document.body.removeChild(doc);
        }
        this.downloadState = false;
      }
    } catch (error) {
      console.log(`processDownloadedFile ${error}`)
    }
  }
}
