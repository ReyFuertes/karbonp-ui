import { Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { buffer, bufferCount, combineLatest, debounceTime, filter, first, fromEvent, map, race, repeat, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { IOptionItem, IPaypoint } from 'src/app/models/generic.model';
import { getMultiSelectEmployeesSelector, getPayPointsSelector } from 'src/app/store/app.selector';
import { GetTypes } from 'src/app/shared/util/types.util';
import { IPayrunEmployee, IPayRunEmployeePayload, ISelectedPayrun } from '../../payroll.model';
import { getDownloadedBulkPayrunSelector, getDownloadedPayslipSelector, getPayrollPayrunEmployeesSelector, getPayrollPayrunInProgressLoadingSelector, getPayrollPayrunSelectedPayRunSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { approvePayrunPayslipsAction, clearDownloadedBulkPayRunsAction, downloadBulkPayRunsAction, generatePDFPaySlipAction, getPayRunEmployeesAction, getPayrunSetupDataAction } from '../../store/payrun-in-progress/payroll-payrun-in-progress.action';
import { PayRunStatusType, RunPayslipStatusType } from 'src/app/models/generic.enum';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';
import { PayslipStatusType } from '../../payroll.enum';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-inprogress-edit-payslip',
  templateUrl: './payroll-inprogress-edit-payslip.component.html',
  styleUrls: ['./payroll-inprogress-edit-payslip.component.scss']
})
export class PayrollEditPayslipComponent extends GenericPage implements OnInit {
  public bulkDownloadForm: FormGroup;
  public payRunId: number;
  public paySlipStatusOptions: IOptionItem[] = [];
  public employeeOptions: IOptionItem[];
  public maxSelectedLabels: number = null;
  public selectionLimit: number = null;
  public selectedPayRun: ISelectedPayrun;
  public payrunEmployees: IPayrunEmployee[];
  public payrunEmployeeOptions: IOptionItem[];
  public grossAmountTotal: number = 0;
  public taxAmountTotal: number = 0;
  public deductionAmountTotal: number = 0;
  public netAmountTotal: number = 0;
  public payRunEmployeePayload: IPayRunEmployeePayload;
  public approveAll: boolean = false;
  public runPayslipStatusType = RunPayslipStatusType;
  public bulkDownloadModal: boolean = false;
  public payPoints: IOptionItem[];
  public downloadedBulkPayrun: any; //note: no proper model
  public documentDownloadType: number = 0;
  public downloadedPayslipData = new Map<number, any>();
  public selectedEmployeeId: number;
  public headerToggleLabel: string;
  public payRunStatusType = PayRunStatusType;
  public payslipEmailStatusMessageConverted: string = 'NotSpecified';

  constructor(
    injector: Injector,
    private route: ActivatedRoute
  ) {
    super(injector);
    this.currentPageKey = CURRENT_PAYRUN_PAGE_KEY;
    this.form = this.fb.group({
      employees: new FormControl(undefined),
      paySlipStatus: new FormControl(undefined)
    });
    this.bulkDownloadForm = this.fb.group({
      employees: new FormControl(undefined),
      payPoints: new FormControl(undefined),
      includeEMP201: new FormControl(undefined),
      mergePdf: new FormControl(undefined),
    });
    this.route.paramMap
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(params => {
        this.payRunId = Number(params.get('id'));
        if (this.payRunId)
          this.store.dispatch(getPayrunSetupDataAction({ id: this.payRunId }));
      })
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getPayrollPayrunSelectedPayRunSelector)),
      this.store.pipe(select(getPayrollPayrunEmployeesSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getDownloadedBulkPayrunSelector)),
      this.store.pipe(select(getDownloadedPayslipSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, selectedPayRun, payrunEmployees, payPoints, downloadedBulkPayrun, downloadedPayslip]) => {
        this.employeeOptions = employees.map(employee => ({ value: employee?.id, label: employee?.fullName, active: employee?.isActive }));
        this.paySlipStatusOptions = GetTypes(PayslipStatusType, 2).map((value) => ({ label: value.label, value }));
        this.selectedPayRun = selectedPayRun;
        const currentDayStart = new Date(new Date().toDateString());
        this.payrunEmployees = payrunEmployees;
        if (payrunEmployees) {
          let emailSend = 'NotSpecified';
          let hasEmailAddress = false;
          let hasBeenSent = false;
          let currentEmailAddress = '';
          this.payrunEmployees.forEach(payrunEmployee => {
            if (payrunEmployee?.email !== '') {
              hasEmailAddress = true;
              currentEmailAddress = payrunEmployee.email;
              if (payrunEmployee.lastEmailSentDate !== null && payrunEmployee?.payslipEmailStatus !== 4) {
                hasBeenSent = true;
                if (payrunEmployee.payslipEmailStatus === 1 || payrunEmployee?.payslipEmailStatus === 2)
                  emailSend = 'SendInProgress';
                else {
                  if (hasEmailAddress) {
                    if (hasBeenSent) {
                      if (currentEmailAddress !== payrunEmployee?.lastEmailSentEmailAddress)
                        emailSend = 'HasBeenSentAndEmailDifferent'
                      else {
                        if (new Date(payrunEmployee?.lastEmailSentDate) < currentDayStart)
                          emailSend = 'HasBeenSentEmailTheSameAndSentBeforeToday'
                        else
                          emailSend = 'HasBeenSentEmailTheSameAndSentToday'
                      }
                    }
                    else {
                      if (payrunEmployee?.payslipEmailStatus === 3)
                        emailSend = 'HasEmailAndSentOldWay';
                      else {
                        if (payrunEmployee?.payslipEmailStatus === 4) {
                          switch (payrunEmployee?.payslipEmailStatusMessage) {
                            case 'Self-Service is disabled':
                              this.payslipEmailStatusMessageConverted = 'SelfServiceWasDisabled';
                              break;
                            case 'Value cannot be null. (Parameter email)':
                              this.payslipEmailStatusMessageConverted = 'NoEmailAddressAtTimeOfSend';
                              break;
                            default:
                              this.payslipEmailStatusMessageConverted = 'NotSpecified';
                              break;
                          }
                          emailSend = 'HasEmailAndLastFailed';
                        }
                        else
                          emailSend = 'HasEmailAndNotSent';
                      }
                    }
                  }
                  else
                    emailSend = 'NoEmailAddress';
                }
              }
            }
            payrunEmployee.emailSendType = emailSend;
          });
          this.payrunEmployeeOptions = payrunEmployees?.map((payrunEmployee: IPayrunEmployee) => ({
            label: `${payrunEmployee?.firstName} ${payrunEmployee?.lastName}`,
            value: payrunEmployee?.employeeId?.toString()
          }));
        }
        const toggleOff = !this.payrunEmployees.some(e => e.paySlipStatus !== 1);
        if (toggleOff === true)
          this.headerToggleLabel = this.translateService.instant('RevertAllToDraft');
        else
          this.headerToggleLabel = this.translateService.instant('ApproveAll');
        this.grossAmountTotal = this.payrunEmployees.reduce((prev, cur) => prev + cur.grossAmount, 0);
        this.taxAmountTotal = this.payrunEmployees.reduce((prev, cur) => prev + cur.taxAmount, 0);
        this.deductionAmountTotal = this.payrunEmployees.reduce((prev, cur) => prev + cur.deductionAmount, 0);
        this.netAmountTotal = this.payrunEmployees.reduce((prev, cur) => prev + cur.netAmount, 0);
        this.approveAll = this.hasPaySlipStatusApproved;
        this.payPoints = payPoints.map((payPoint: IPaypoint) => ({ label: payPoint.name, value: payPoint.id }));
        this.downloadedBulkPayrun = Object.assign({}, downloadedBulkPayrun);
        if (this.downloadedBulkPayrun?.data?.file) {
          processPayrunDownload(this.downloadedBulkPayrun?.data, this.getBulkDownloadFilename);
          this.store.dispatch(clearDownloadedBulkPayRunsAction()); //note: clear downloaded bulk data
        }
        else {
          //note: notification dialog
        }
        this.downloadedPayslipData = downloadedPayslip;
        if (this.downloadedPayslipData) {
          const downloadedPayslip = this.downloadedPayslipData?.get(this.selectedEmployeeId);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getPayslipFilename);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
      })
  }

  public get hasPaySlipStatusApproved(): boolean {
    return this.payrunEmployees.some(runEmployee => runEmployee.paySlipStatus === RunPayslipStatusType.Approved)
      ? true
      : false;
  }

  public onApprove(event: any, employeeId: number): void {
    this.payrunEmployees.forEach(runEmployee => {
      if (runEmployee?.employeeId === employeeId)
        runEmployee = Object.assign(runEmployee, {}, {
          requiresRecalculation: event?.checked === 1
            ? true
            : false,
          paySlipStatus: event?.checked
        });
    });
    this.approveAll = this.hasPaySlipStatusApproved;
  }

  public getApproveStatus(runEmployee: IPayrunEmployee): boolean {
    return runEmployee?.paySlipStatus === this.runPayslipStatusType.Approved
      ? true
      : false
  }

  public onChangeBulkDownloadEmployees(event: any): void {
    this.bulkDownloadForm.get('employees').patchValue(event.value);
    this.setChipPaddings(event?.value);
  }

  public onCancelBulkDownload(): void {
    this.bulkDownloadModal = false;
    this.bulkDownloadForm.reset();
  }

  public onChangeEmployees(event: any): void {
    this.form.get('employees').patchValue(event.value);
    //this.setChipPaddings(event?.value);
  }

  public onFilter(): void {
    if (this.form.valid) {
      this.payRunEmployeePayload = {
        employeeIds: this.form.value?.employees,
        payRunId: this.payRunId,
        payslipStatus: this.form.value?.paySlipStatus?.value || null,
        sortAscending: true,
        sortBy: 'LastName'
      };
      this.loadPayrunEmployees(this.payRunEmployeePayload);
    }
  }

  public onApproveAll(event: any): void {
    this.payrunEmployees.forEach(employee => {
      Object.assign(employee, {}, {
        requiresRecalculation: event?.checked,
        paySlipStatus: event?.checked === true ? 1 : 0
      });
    });
  }

  public onRowEdit(row: IPayrunEmployee): void {
    const { employeeId, payRunId } = row;
    const doubleClickDuration = 200;
    const leftClick$ = fromEvent(window, 'click').pipe(filter((event: any) => event.button === 0));
    const debounce$ = leftClick$.pipe(debounceTime(doubleClickDuration));
    const clickLimit$ = leftClick$.pipe(bufferCount(2));
    const bufferGate$ = race(debounce$, clickLimit$).pipe(first(), repeat(),);
    leftClick$.pipe(
      buffer(bufferGate$),
      map(dblclicks => dblclicks?.length > 1),
      takeUntil(this.$unsubscribe)
    ).subscribe(dblclicks => {
      if (dblclicks === true)
        this.gotoRoute(this.currentPageKey, `/payroll/payruns/employee-setup/${employeeId}/${payRunId}`);
    });
  }

  public onEdit(row: IPayrunEmployee): void {
    const { employeeId, payRunId } = row;
    this.gotoRoute(this.currentPageKey, `/payroll/payruns/employee-setup/${employeeId}/${payRunId}`);
  }

  public onSaveAndValidate(): void {
    this.store.dispatch(approvePayrunPayslipsAction({
      id: this.payRunId,
      payload: this.payrunEmployees?.map(value => ({
        payslipId: value?.payslipId,
        revert: value?.paySlipStatus === RunPayslipStatusType.Approved
          ? false
          : true
      }))
    }));
  }

  public onCancel(): void {
    this.gotoRoute(this.currentPageKey, '/payroll/payruns');
    this.store.dispatch(clearDownloadedBulkPayRunsAction());
  }

  public onDownloadPayRun(payload: IPayrunEmployee): void {
    this.selectedEmployeeId = payload.employeeId;
    const downloadedPayslip = this.downloadedPayslipData?.get(this.selectedEmployeeId);
    if (downloadedPayslip) {
      try {
        processPayrunDownload(downloadedPayslip?.data, this.getPayslipFilename);
      } catch (error) {
        this.showError(error as string);
      }
    }
    else
      this.store.dispatch(generatePDFPaySlipAction({ employeeId: payload.employeeId, payRunId: payload.payRunId }));
  }

  public onBulkDownload(): void {
    if (this.bulkDownloadForm.valid && !this.downloadedBulkPayrun?.data) {
      const value = this.bulkDownloadForm.value;
      this.store.dispatch(downloadBulkPayRunsAction({
        payload: {
          documentType: 0,
          employeeIds: value?.employees?.map((employee: IOptionItem) => Number(employee)),
          includeEMP201: value?.includeEMP201 || false,
          language: 'en', //note: get the language culture
          mergePdf: value?.mergePdf || false,
          payPointIds: value?.payPoints?.map((payPoint: IOptionItem) => payPoint?.value) || [],
          payRunId: this.payRunId
        }
      }));
      this.bulkDownloadModal = false;
      this.bulkDownloadForm.reset();
    }
    else {
      if (this.downloadedBulkPayrun?.data?.file)
        processPayrunDownload(this.downloadedBulkPayrun?.data, this.getBulkDownloadFilename);
    }
    this.store.dispatch(clearDownloadedBulkPayRunsAction());
  }

  public onReset(): void {
    this.form.reset();
    this.loadPayrunEmployees({
      employeeIds: null,
      payRunId: this.payRunId,
      payslipStatus: null,
      sortAscending: true,
      sortBy: 'LastName'
    });
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrollPayrunInProgressLoadingSelector));

  private get getBulkDownloadFilename(): string {
    const date = new Date(this.selectedPayRun.payRun?.payDate ?? this.selectedPayRun?.payRun?.toDate);
    return `Bulk_Payslips_${date.toLocaleString('default',
      { month: 'short' })}_${date.getFullYear().toString().substring(2, 4)}.${this.downloadedBulkPayrun?.data?.extension}`;
  }

  private get getPayslipFilename(): string {
    const date = new Date(this.selectedPayRun.payRun?.payDate ?? this.selectedPayRun.payRun?.toDate);
    const employee = this.payrunEmployees.find(employee => employee.employeeId === this.selectedEmployeeId);
    return employee.firstName.substring(0, 1) + '_' + employee.lastName.replace(' ', '') + '_' + date.toLocaleString('default', { month: 'short' }) + '_' + date.getDate() + '_' + date.getFullYear().toString() + '.pdf';
  }

  private loadPayrunEmployees(payload: IPayRunEmployeePayload): void {
    this.store.dispatch(getPayRunEmployeesAction({ payload }));
  }
}
