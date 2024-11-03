import { Component, AfterViewInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subscription, combineLatest, take, takeUntil } from 'rxjs';

import { LocalService } from 'src/app/services/local-storage.service';
import { FormValidators } from 'src/app/shared/generics/form-validators.generics';
import { convertBase64ToBlob, convertBlobToBase64 } from 'src/app/shared/util/convert-to-blob';
import { checkFileSizeLimitExceeded } from 'src/app/shared/util/document.util';
import { AppState } from 'src/app/store';
import { uploadEmployeeBulkImportAction, downloadEmployeeBulkImportFileAction, getEmployeeBulkImportViewAction } from '../../store/employee/employee.action';
import { isEmployeeLoadingSelector, getEmployeeDownloadBulkImportFileSelector, getEmployeeBulkImportViewSelector } from '../../store/employee/employee.selector';
import { EmployeeBulkImportStatusType } from '../../../../models/generic.enum';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { SignalRService } from 'src/app/services/signalr.service';

@Component({
  selector: 'kp-employee-bulk-import',
  templateUrl: './employee-bulk-import.component.html',
  styleUrls: ['./employee-bulk-import.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeBulkImportComponent extends FormValidators implements AfterViewInit {
  public bulkImportForm: FormGroup;
  public employeeBulkImportStatusType = EmployeeBulkImportStatusType;
  public excellfileByteArray: string;
  public signalRSubscription: Subscription;
  public bulkImportView: any; //note: no proper model
  public downloadedBulkImportFile: any;//note: no proper model
  public downloadState: boolean = false;
  public progressValue: number = 0;
  public interval: NodeJS.Timeout;
  public employeeBulkImportParam: { [key: string]: string };

  constructor(
    private store: Store<AppState>,
    private localService: LocalService,
    public signalRService: SignalRService,
    public zone: NgZone,) {
    super();
    signalRService.employeeBulkImportEmmitter
      .subscribe((data) => {
        this.zone.run(() => {
          if (this.bulkImportView?.status != data.status) {
            this.bulkImportView.status = data.status;
            this.store.dispatch(getEmployeeBulkImportViewAction());
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
      includeEmployeeData: new FormControl(true),
      reCalculatePayslips: new FormControl(true),
      file: new FormControl(undefined, Validators.required),
    });
    this.employeeBulkImportParam = {
      CompanyName: this.localService.getEncItem('companyName')
        ? JSON.parse(this.localService.getEncItem('companyName'))
        : 'YourCompanyName'
    };
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.store.pipe(select(getEmployeeBulkImportViewSelector)),
      this.store.pipe(select(getEmployeeDownloadBulkImportFileSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([bulkImportView, downloadedBulkImportFile]) => {
        this.downloadedBulkImportFile = Object.assign({}, downloadedBulkImportFile);
        if (this.downloadedBulkImportFile?.data?.fileContents && this.downloadState === true) {
          const result = convertBase64ToBlob(this.downloadedBulkImportFile.data.fileContents,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          this.processDownloadedFile(result);
          this.downloadState = false;
        }

        if (bulkImportView) {
          this.bulkImportView = Object.assign({}, bulkImportView);
          if (this.bulkImportView !== null && this.bulkImportView.status !== EmployeeBulkImportStatusType.Completed)
            this.signalRService.linkEmployeeBulkImportGroup(this.bulkImportView.id);
          else if (this.bulkImportView != null && this.bulkImportView.importBusyProcessing)
            this.bulkImportView = { status: EmployeeBulkImportStatusType.Completed, errors: ['vImportInstanceAlreadyStarted'] };
        }
        else
          this.bulkImportView = { status: EmployeeBulkImportStatusType.Completed, errors: ['vImportFormatIncorrect'] };
      });

  }

  public isLoadingAsync = () => this.store.pipe(select(isEmployeeLoadingSelector));

  public downloadTemplateFile(): void {
    if (!this.downloadedBulkImportFile?.data)
      this.store.dispatch(downloadEmployeeBulkImportFileAction({ includeEmployeeData: this.bulkImportForm.value.includeEmployeeData }));
    else {
      const result = convertBase64ToBlob(this.downloadedBulkImportFile.data.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      this.processDownloadedFile(result);
    }
    this.downloadState = true;
   }

  public onUploadBulkImport(): void {
    if (this.bulkImportForm.valid) {
      this.store.dispatch(uploadEmployeeBulkImportAction({
        payload: {
          file: this.bulkImportForm.value.file,
          reCalculatePayslips: this.bulkImportForm.value.reCalculatePayslips
        }
      }));
    }
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

  private processDownloadedFile(result: Blob): void {
    try {
      if (result) {
        const fileName = 'Employee Bulk Import.xlsx';
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
