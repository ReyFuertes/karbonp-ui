import { Component, Injector, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, take, takeUntil } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { select } from '@ngrx/store';

import { EmployeeBulkImportStatusType } from 'src/app/models/generic.enum';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { IPayrollSetup, IPayrunBulkUpdateOption } from '../../payroll.model';
import { SignalRService } from 'src/app/services/signalr.service';
import { checkFileSizeLimitExceeded } from 'src/app/shared/util/document.util';
import { convertBase64ToBlob, convertBlobToBase64 } from 'src/app/shared/util/convert-to-blob';
import { downloadBulkHoursUpdateExcelAction, uploadPayrollBulkImportUpdateAction } from '../../store/payrun-bulk-update/payrun-bulk-update.action';
import { processDownloadedFile } from 'src/app/shared/util/formatting';
import { getPayrollDownloadBulkHoursImportFileSelector, getPayRunBulkHoursImportViewSelector, getPayrunBulkUpdateSetupDataSelector } from '../../store/payrun-bulk-update/payrun-bulk-update.selector';

@Component({
  selector: 'kp-payroll-inprogress-bulk-update-hours',
  templateUrl: './payroll-inprogress-bulk-update-hours.component.html',
  styleUrls: ['./payroll-inprogress-bulk-update-hours.component.scss']
})
export class PayrollInProgressBulkUpdateHoursComponent extends GenericPage implements OnInit {
  @ViewChild('fileUploadControl') public fileUploadControl: FileUpload;
  @Input() public payRunId: number;

  public bulkImportForm: FormGroup;
  public bulkHoursImportView: any; //note: no proper model
  public downloadedBulkHoursImportFile: any;//note: no proper model
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
          if (this.bulkHoursImportView?.status !== data.status) {
            this.bulkHoursImportView.status = data.status;
            //request
          }
          else {
            this.bulkHoursImportView = data;
            this.interval = setInterval(() => {
              this.zone.run(() => {
                this.progressValue = this.bulkHoursImportView?.importProgress;
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
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayrunBulkUpdateSetupDataSelector)),
      this.store.pipe(select(getPayrollDownloadBulkHoursImportFileSelector)),
      this.store.pipe(select(getPayRunBulkHoursImportViewSelector)),
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([bulkUpdateSetupData, downloadedBulkHoursImportFile, bulkHoursImportView]) => {
        this.bulkUpdateSetupData = bulkUpdateSetupData;
        this.bulkHoursImportView = bulkHoursImportView;
        if (this.bulkHoursImportView) {
          this.bulkHoursImportView = Object.assign({}, this.bulkUpdateSetupData?.payRunBulkImport);
          if (this.bulkHoursImportView !== null && this.bulkHoursImportView.status !== this.employeeBulkImportStatusType.Completed)
            this.signalRService.linkTimeOffBulkImportGroup(this.bulkHoursImportView.id);
          else if (this.bulkHoursImportView != null && this.bulkHoursImportView.importBusyProcessing)
            this.bulkHoursImportView = { status: this.employeeBulkImportStatusType.Completed, errors: ['vImportInstanceAlreadyStarted'] };
        }
        else
          this.bulkHoursImportView = { status: this.employeeBulkImportStatusType.Completed, errors: ['vImportFormatIncorrect'] };
        this.downloadedBulkHoursImportFile = Object.assign({}, downloadedBulkHoursImportFile);
        if (this.downloadedBulkHoursImportFile?.data?.fileContents && this.downloadState === true) {
          const result = convertBase64ToBlob(this.downloadedBulkHoursImportFile.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          processDownloadedFile(result, this.downloadedBulkHoursImportFile, 'Bulk Hours Update');
          this.downloadState = false;
        }
      })
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
        payload: Object.assign({}, this.bulkImportForm.value, { isHoursImport: true }),
        payRunId: this.payRunId,
      }));
      setTimeout(() => {
        this.fileUploadControl.clear();
        this.bulkImportForm.controls['file'].reset();
      }, 300);
    }
  }

  public downloadTemplateFile(): void {
    if (!this.downloadedBulkHoursImportFile?.data)
      this.store.dispatch(downloadBulkHoursUpdateExcelAction({
        payload: {
          employeeIds: [],
          language: "en", //note: get this from global setting
          payPointIds: [],
          payRunId: this.payRunId
        }
      }));
    else {
      const result = convertBase64ToBlob(this.downloadedBulkHoursImportFile.data.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      processDownloadedFile(result, this.downloadedBulkHoursImportFile, 'Bulk Hours Update');
    }
    this.downloadState = true;
  }
}
