import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, Input, NgZone, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { Subject, Subscription, combineLatest, take, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { FileUpload } from 'primeng/fileupload';

import { IEntitlementPolicy, IEntitlementPolicyRange, ILeaveSetup, IOptionItem } from 'src/app/models/generic.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { deleteTimeOffLeaveApproverAction, downloadTimeOffBulkImportFileAction, getTimeOffBulkImportViewAction, getTimeOffLeaveEntitlementPolicyByIdAction, getTimeOffTimeOffPolicyByIdAction, saveTimeOffLeaveApproverAction, updateTimeOffEntitlementPolicyAction, updateTimeOffPolicySettingsAction, uploadTimeOffBulkImportAction } from '../../store/time-off.action';
import { getSaveUpdatestatusSelector, getTimeOffBulkImportViewSelector, getTimeOffDownloadBulkImportFileSelector, getTimeOffLeaveApproverUsersSelector, getTimeOffLeaveApproversSelector, getTimeOffSelectedEntitlementPolicySelector, getTimeOffSelectedPolicySelector } from '../../store/time-off.selector';
import { ICycleEntitlementRegulation, ILeaveApprover, IleaveApproverUser } from '../../time-off.model';
import { getPayPointsSelector } from 'src/app/store/app.selector';
import { InputMultipleSelectChipComponent } from 'src/app/shared/components/input-multiple-select-chip/input-multiple-select-chip.component';
import { checkFileSizeLimitExceeded } from 'src/app/shared/util/document.util';
import { SignalRService } from 'src/app/services/signalr.service';
import { convertBase64ToBlob, convertBlobToBase64 } from 'src/app/shared/util/convert-to-blob';
import { DISABLED_TIMEOFF } from 'src/app/shared/constants/wordings.constant';
import { GenericApplicationSetting } from 'src/app/shared/generics/application-settings.generic';
import { AppDashboardType, DialogStateType, EmployeeBulkImportStatusType, EntitlementLimitPolicyType, PeriodStartDateType, RuleOverrideType } from 'src/app/models/generic.enum';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';

@Component({
  selector: 'kp-time-off-settings',
  templateUrl: './time-off-settings.component.html',
  styleUrls: ['./time-off-settings.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class TimeOffSettingsComponent extends GenericApplicationSetting implements AfterViewInit, OnChanges {
  @Input() public policies: ILeaveSetup[];
  @Output() public triggerChanges = new EventEmitter<string>();
  @ViewChild('inputMultipleSelectChipComponent') public inputMultipleSelectChipComponent: InputMultipleSelectChipComponent;
  @ViewChild('fileUploadControl') public fileUploadControl: FileUpload;

  public disabledDescription: string = DISABLED_TIMEOFF;
  public timeOffPolicyForm: FormGroup;
  public timeOffEntitlementPolicyForm: FormGroup;
  public cycleEntitlementRegulationForm: FormGroup;
  public entitlementPolicyRangesForm: FormGroup;
  public bulkImportForm: FormGroup;
  public periodStartDateTypes = GetTypes(PeriodStartDateType);
  public entitlementLimitPolicyType = GetTypes(EntitlementLimitPolicyType);
  public showPolicyModal: boolean = false;
  public showModalEntitlementPolicy: boolean = false;
  public selectedPolicy: ILeaveSetup;
  public dialogPolicyState: DialogStateType = DialogStateType.Add;
  public dialogEntitlementPoliciesState: DialogStateType = DialogStateType.Add;
  public dialogEntitlementPolicyRangesState: DialogStateType = DialogStateType.Add;
  public dialogLeaveApproverState: DialogStateType = DialogStateType.Add;
  public dialogState = DialogStateType;
  public selectedEntitlementPolicies: IEntitlementPolicy[] = [];
  public selectedAddEditPolicyTabIndex: number = 0;
  public cycleEntitlementRegulationsItems: ICycleEntitlementRegulation[] = [];
  public selectedEntitlementPolicyOptions: IOptionItem[] = [];
  public timeOffEntitlementPolicyRangeItems: IEntitlementPolicyRange[] = [];
  public leaveApproverUsers: IleaveApproverUser[] = [];
  public showLeaveApproverModal: boolean = false;
  public selectedSettingsTabIndex: number = 0;
  public payPointOptions: IOptionItem[] = [];
  public employeeFilterText$ = new Subject();
  public selectedApprover: IOptionItem;
  public selectedPayPoint: IOptionItem;
  public allEmployeesText: string = 'All Employees';
  public leaveApproverUserOptions: IOptionItem[] = [];
  public leaveApprovers: ILeaveApprover[] = [];
  public employeeBulkImportStatusType = EmployeeBulkImportStatusType;
  public reCalculatePayslips: boolean = false;
  public excellfileByteArray: string;
  public signalRSubscription: Subscription;
  public bulkImportView: any; //note: no proper model
  public downloadedBulkImportFile: any;//note: no proper model
  public downloadState: boolean = false;
  public showModalEntitlementPolicyRange: boolean = false;
  public progressValue: number = 0;
  public interval: NodeJS.Timeout;

  constructor(
    injector: Injector,
    private messageService: MessageService,
    public signalRService: SignalRService,
    public zone: NgZone,
    public cdRef: ChangeDetectorRef) {
    super(injector);
    this.appDashboardType = AppDashboardType.TimeOff;
    signalRService.timeOffBulkImportEmmitter
      .subscribe((data) => {
        this.zone.run(() => {
          if (this.bulkImportView?.status != data.status) {
            this.bulkImportView.status = data.status;
            this.store.dispatch(getTimeOffBulkImportViewAction());
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
    this.timeOffPolicyForm = new FormGroup({
      id: new FormControl(0),
      active: new FormControl(true),
      name: new FormControl(undefined, Validators.required),
      cycleLength: new FormControl(undefined, Validators.required),
      leaveCycleType: new FormControl(0),
      unpaidLeave: new FormControl(false),
      hideBalancesInSelfService: new FormControl(false),
      blockNegativeLeaveBalance: new FormControl(false),
      allowRuleOverride: new FormControl(RuleOverrideType.NotAllowed),
      autoPayFourtyPercentAfterThreeConsecutiveDays: new FormControl(false),
      payVacationPremiumOnAnniversary: new FormControl(false),
      entitlementPolicyRanges: new FormControl([]),
      setMinimumBalance: new FormControl(false),
      customDate: new FormControl(undefined),
      minimumBalance: new FormControl(0),
      timeOffSystemType: new FormControl(0),
      entitlementPolicies: new FormControl([])
    });
    this.timeOffEntitlementPolicyForm = new FormGroup({
      id: new FormControl(0),
      customName: new FormControl(undefined),
      useHoursWorkedForAccrual: new FormControl(false),
      defaultEntitlementInDays: new FormControl(undefined, Validators.required), //note: name doesnt match
      entitlementAvailableAfterMonths: new FormControl(undefined, Validators.required),
      allowLeaveToBeCarriedForward: new FormControl(undefined),
      cycleEntitlementRegulations: new FormControl(undefined),
      leaveCarriedForwardExpiredInMonths: new FormControl(undefined),
      leaveSetup: new FormControl(undefined),
      limitAmount: new FormControl(undefined),
      limitType: new FormControl(undefined),
      maximumBalanceLimit: new FormControl(undefined),
      oneHourOfLeaveForEveryXHoursWorked: new FormControl(undefined),
      updatedByUserId: new FormControl(undefined),
      updatedDateTime: new FormControl(undefined),
      useUpfrontAccrual: new FormControl(false),
    });
    this.cycleEntitlementRegulationForm = new FormGroup({
      id: new FormControl(0),
      entitlement: new FormControl(undefined, Validators.required),
      firstCycle: new FormControl(undefined, Validators.required),
      lastCycle: new FormControl(undefined, Validators.required),
      vacationPremium: new FormControl(null),
    });
    this.entitlementPolicyRangesForm = new FormGroup({
      id: new FormControl(0),
      fromDate: new FormControl(undefined, Validators.required),
      toDate: new FormControl(undefined, Validators.required),
      leaveEntitlementPolicy: new FormGroup({
        id: new FormControl(0),
        defaultEntitlementInDays: new FormControl(undefined),
      })
    });
    this.bulkImportForm = new FormGroup({
      reCalculatePayslips: new FormControl(true),
      file: new FormControl(undefined, Validators.required),
    });
    this.store.pipe(select(getSaveUpdatestatusSelector),
      takeUntil(this.$unsubscribe))
      .subscribe((hasError: boolean) => {
        if (hasError === true)
          setTimeout(() => this.messageService.add({ severity: 'error', summary: 'Error Saving' }), 300);
        if (hasError === false)
          setTimeout(() => this.messageService.add({ severity: 'success', summary: 'Saved Successfully' }), 300);
        setTimeout(() => {
          if (hasError === true)
            return;
          else if (hasError === false) {
            // this.showPolicyModal = false;
            this.triggerChanges.emit('settings');
          }
        }, 300);
      });
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.store.pipe(select(getTimeOffSelectedEntitlementPolicySelector)),
      this.store.pipe(select(getTimeOffSelectedPolicySelector)),
      this.store.pipe(select(getTimeOffLeaveApproversSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getTimeOffLeaveApproverUsersSelector)),
      this.store.pipe(select(getTimeOffBulkImportViewSelector)),
      this.store.pipe(select(getTimeOffDownloadBulkImportFileSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([selectedEntitlementPolicy, selectedPolicy, leaveApprovers, payPoints, leaveApproverUsers, bulkImportView, downloadedBulkImportFile]) => {
        if (selectedEntitlementPolicy) {
          this.timeOffEntitlementPolicyForm.patchValue(selectedEntitlementPolicy);
          this.cycleEntitlementRegulationsItems = Object.assign([], selectedEntitlementPolicy.cycleEntitlementRegulations);
        }
        if (selectedPolicy) {
          this.selectedEntitlementPolicies = selectedPolicy?.entitlementPolicies;
          this.timeOffEntitlementPolicyRangeItems = selectedPolicy?.entitlementPolicyRanges
            ?.map(range => ({
              id: range.id,
              fromDate: range.fromDate,
              toDate: range.toDate,
              leaveEntitlementPolicy: ({
                id: range.leaveEntitlementPolicy.id.toString(),
                defaultEntitlementInDays: range.leaveEntitlementPolicy?.defaultEntitlementInDays
              })
            }));
          this.timeOffPolicyForm.patchValue({
            ...selectedPolicy,
            entitlementPolicyRanges: this.timeOffEntitlementPolicyRangeItems
          });
        }
        this.leaveApprovers = leaveApprovers;
        this.leaveApproverUsers = leaveApproverUsers;
        this.leaveApproverUserOptions = leaveApproverUsers
          ?.map(approverUser => ({ label: `${approverUser.firstName} ${approverUser.lastName}`, value: approverUser.id.toString() }));
        this.payPointOptions = payPoints
          ?.map(payPoint => ({ label: payPoint.name, value: payPoint?.id.toString() }));
        this.payPointOptions.unshift({ label: this.allEmployeesText, value: null });
        if (bulkImportView) {
          this.bulkImportView = Object.assign({}, bulkImportView);
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
          this.processDownloadedFile(result);
          this.downloadState = false;
        }
      });
    const selectedSettingsTabIndex = localStorage.getItem('selectedSettingsTabIndex');
    if (selectedSettingsTabIndex)
      this.selectedSettingsTabIndex = JSON.parse(selectedSettingsTabIndex);
    else
      this.selectedSettingsTabIndex = 0;
    this.cdRef.detectChanges();
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['policies']?.currentValue)
      this.policies = changes['policies']?.currentValue;
  }

  public get getSelectedEntitlementPolicyOptions(): IOptionItem[] {
    return this.selectedEntitlementPolicies
      ?.map((entitlementPolicy: IEntitlementPolicy) => ({
        label: `${entitlementPolicy.defaultEntitlementInDays} days`,
        value: entitlementPolicy.id.toString()
      }));
  }

  public downloadTemplateFile(): void {
    if (!this.downloadedBulkImportFile?.data)
      this.store.dispatch(downloadTimeOffBulkImportFileAction());
    else {
      const result = convertBase64ToBlob(this.downloadedBulkImportFile.data.fileContents,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      this.processDownloadedFile(result);
    }
    this.downloadState = true;
  }

  public onUploadBulkImport(): void {
    if (this.bulkImportForm.valid) {
      this.store.dispatch(uploadTimeOffBulkImportAction({
        payload: this.bulkImportForm.value
      }));
      setTimeout(() => {
        this.store.dispatch(getTimeOffBulkImportViewAction());
        this.fileUploadControl.clear();
        this.bulkImportForm.controls['file'].reset();
      }, 300);
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

  public onSaveUpdateApprover(): void {
    let approver: ILeaveApprover;
    let payload: { leaveApproverItems: ILeaveApprover[] } = null;
    if (this.dialogLeaveApproverState !== DialogStateType.Edit)
      approver = this.leaveApproverUsers.find(approver => approver.id === Number(this.selectedApprover.value));
    else
      approver = this.leaveApprovers.find(approver => approver.userId === Number(this.selectedApprover.value));
    payload = {
      leaveApproverItems: [{
        id: this.dialogLeaveApproverState === DialogStateType.Edit
          ? approver?.id
          : 0,
        payPointId: Number(this.selectedPayPoint?.value),
        userId: approver?.userId || approver?.id
      }]
    };
    if (approver) {
      this.store.dispatch(saveTimeOffLeaveApproverAction({ payload }));
      setTimeout(() => {
        this.showLeaveApproverModal = false;
        this.triggerChanges.emit('leave-approvers');
      }, 300);
    }
  }

  public onEditLeaveApprover(option: ILeaveApprover): void {
    this.dialogLeaveApproverState = DialogStateType.Edit;
    const matchApprover = this.leaveApprovers.find(approver => approver.id === option.id);
    this.selectedApprover = { label: matchApprover.userFullName, value: matchApprover.userId.toString() };
    const matchPayPoint = this.payPointOptions.find(payPoint => payPoint.value === option.payPointId?.toString());
    if (matchPayPoint)
      this.selectedPayPoint = Object.assign({}, matchPayPoint);
    else
      this.selectedPayPoint = Object.assign({}, { label: this.allEmployeesText, value: null });
    this.showLeaveApproverModal = true;
  }

  public onDeleteApprover(option: ILeaveApprover): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove?`,
      accept: () => {
        this.store.dispatch(deleteTimeOffLeaveApproverAction({ id: option.id }));
        setTimeout(() => {
          this.triggerChanges.emit('leave-approvers');
        }, 300);
      },
      reject: () => this.cd.reject()
    });
  }

  public onDeleteEntitlementPolicyRanges(entitlementPolicyRanges: IEntitlementPolicyRange): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove?`,
      accept: () => {
        const index = this.timeOffEntitlementPolicyRangeItems.indexOf(entitlementPolicyRanges);
        if (index > -1)
          this.timeOffEntitlementPolicyRangeItems.splice(index, 1);
        this.timeOffPolicyForm.value.entitlementPolicyRanges = this.timeOffEntitlementPolicyRangeItems;
      },
      reject: () => this.cd.reject()
    });
  }

  public onDeleteCycleEntitlementPolicy(cycleEntitlementPolicy: ICycleEntitlementRegulation): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove?`,
      accept: () => {
        const index = this.cycleEntitlementRegulationsItems.indexOf(cycleEntitlementPolicy);
        if (index > -1)
          this.cycleEntitlementRegulationsItems.splice(index, 1);
      },
      reject: () => this.cd.reject()
    });
  }

  public handleSettingsTabChange(event: any): void {
    this.selectedSettingsTabIndex = event.index;
    localStorage.setItem('selectedSettingsTabIndex', event.index);
  }

  public handleAddEditPolicyTabChange(event: any): void {
    this.selectedAddEditPolicyTabIndex = event.index;
    localStorage.setItem('selectedTimeOffAddEditPolicyTab', event.index);
  }

  public onAddCycleEntitlementRegulation(): void {
    if (this.cycleEntitlementRegulationForm.valid) {
      this.cycleEntitlementRegulationsItems.unshift(Object.assign({}, {
        ...this.cycleEntitlementRegulationForm.value,
        id: this.cycleEntitlementRegulationForm.value?.id || 0, //Note: the api request doesnt accepts null but 0, lol
      }));
      this.cycleEntitlementRegulationForm.reset();
    }
  }

  public onSaveEntitlementPolicy(): void {
    if (this.timeOffEntitlementPolicyForm.valid) {
      if (this.cycleEntitlementRegulationsItems.length > 0)
        this.timeOffEntitlementPolicyForm.value.cycleEntitlementRegulations = this.cycleEntitlementRegulationsItems;
      else
        this.timeOffEntitlementPolicyForm.value.cycleEntitlementRegulations = [];
      const leaveId = this.timeOffPolicyForm.value.id;
      delete this.timeOffEntitlementPolicyForm.value.leaveSetup;
      const payload = Object.assign({}, this.timeOffEntitlementPolicyForm.value, {
        leaveId,
        id: this.timeOffEntitlementPolicyForm.value?.id || 0,
        useHoursWorkedForAccrual: this.timeOffEntitlementPolicyForm.value?.useHoursWorkedForAccrual || false,
        useUpfrontAccrual: this.timeOffEntitlementPolicyForm.value?.useUpfrontAccrual || false,
      })
      this.store.dispatch(updateTimeOffEntitlementPolicyAction({ payload }));
      setTimeout(() => {
        this.showModalEntitlementPolicy = false;
        this.triggerChanges.emit('settings');
      }, 300);
    }
  }

  public onSaveChanges(): void {
    if (this.timeOffPolicyForm.valid) {
      if (this.timeOffEntitlementPolicyRangeItems.length > 0)
        this.timeOffPolicyForm.value.entitlementPolicyRanges = this.timeOffEntitlementPolicyRangeItems;
      else
        this.timeOffPolicyForm.patchValue({ entitlementPolicyRanges: [] });
      this.store.dispatch(updateTimeOffPolicySettingsAction({
        payload: {
          ...this.timeOffPolicyForm.value,
          leaveEntitlementPolicyId: Number(this.timeOffPolicyForm.value.leaveEntitlementPolicyId)
        }
      }));
    }
    else
      setTimeout(() => this.messageService.add({ severity: 'error', summary: 'Form invalid!' }), 300);
  }

  public onAddSettings(): void {
    this.dialogPolicyState = DialogStateType.Add;
    switch (this.selectedSettingsTabIndex) {
      case 0:
        this.showPolicyModal = true;
        break;
      case 1:
        this.showLeaveApproverModal = true;
        this.selectedApprover = undefined;
        this.selectedPayPoint = undefined;
        break;
      case 2:
        break;
      default:
        break;
    }
  }

  public onEditPolicy(policy: ILeaveSetup): void {
    if (policy?.id) {
      this.store.dispatch(getTimeOffTimeOffPolicyByIdAction({ id: policy?.id }));
      this.dialogPolicyState = DialogStateType.Edit;
      this.showPolicyModal = true;
    }
  }

  public showEditEntitlementPolicyRange(entitlementPolicyRange: IEntitlementPolicyRange): void {
    this.entitlementPolicyRangesForm.reset();
    this.entitlementPolicyRangesForm.patchValue({
      id: entitlementPolicyRange.id,
      fromDate: new Date(entitlementPolicyRange.fromDate),
      toDate: new Date(entitlementPolicyRange.toDate),
      leaveEntitlementPolicy: ({
        id: entitlementPolicyRange.leaveEntitlementPolicy.id,
        defaultEntitlementInDays: entitlementPolicyRange.leaveEntitlementPolicy?.defaultEntitlementInDays
      }),
    });
    this.showModalEntitlementPolicyRange = !this.showModalEntitlementPolicyRange;
    this.dialogEntitlementPolicyRangesState = DialogStateType.Edit;
  }

  public showAddEntitlementPolicyRange(): void {
    this.entitlementPolicyRangesForm.reset();
    this.showModalEntitlementPolicyRange = true;
    this.dialogEntitlementPolicyRangesState = DialogStateType.Add;
  }

  public onAddUpdateEntitlementPolicyRange(): void {
    if (this.entitlementPolicyRangesForm.valid) {
      const formValue = this.entitlementPolicyRangesForm.value;
      const selectedEntitlementPolicy = this.selectedEntitlementPolicies
        .find(option => option.id === Number(formValue.leaveEntitlementPolicy?.id));
      const policyRange = {
        id: formValue.id,
        leaveEntitlementPolicy: ({ id: selectedEntitlementPolicy?.id, defaultEntitlementInDays: selectedEntitlementPolicy?.defaultEntitlementInDays }),
        fromDate: moment(formValue?.fromDate).format(),
        toDate: moment(formValue?.toDate).format()
      }
      const index = this.timeOffEntitlementPolicyRangeItems.findIndex(range => range.id === formValue.id);
      if (index !== -1)
        this.timeOffEntitlementPolicyRangeItems.splice(index, 1);
      this.timeOffEntitlementPolicyRangeItems.unshift(policyRange);
      this.timeOffPolicyForm.value.entitlementPolicyRanges = this.timeOffEntitlementPolicyRangeItems;
      this.showModalEntitlementPolicyRange = false;
      this.entitlementPolicyRangesForm.reset();

    }
  }

  public onAddEntitlementPolicy(): void {
    this.showModalEntitlementPolicy = true;
    this.dialogEntitlementPoliciesState = DialogStateType.Add;
    this.timeOffEntitlementPolicyForm.reset();
    this.cycleEntitlementRegulationForm.reset();
    this.cycleEntitlementRegulationsItems = [];
  }

  public onEditEntitlementPolicy(entitlementPolicy: IEntitlementPolicy): void {
    this.timeOffEntitlementPolicyForm.reset();
    if (entitlementPolicy.id) {
      this.showModalEntitlementPolicy = true;
      this.store.dispatch(getTimeOffLeaveEntitlementPolicyByIdAction({ id: entitlementPolicy.id }));
      this.dialogEntitlementPoliciesState = DialogStateType.Edit;
    }
    else
      setTimeout(() => this.messageService.add({ severity: 'error', summary: 'Entitlement Policy invalid!' }), 300);
  }

  public get getAddButtonTooltip(): string {
    return this.selectedSettingsTabIndex === 0
      ? 'Add Policy'
      : 'Add Leave Approvers';
  }

  public get getDialogEntitlementPolicyState(): string {
    return this.dialogEntitlementPolicyRangesState === DialogStateType.Add
      ? DialogStateType[0]
      : DialogStateType[1];
  }

  public get getDialogPolicyState(): string {
    return this.dialogPolicyState === DialogStateType.Add
      ? DialogStateType[0]
      : DialogStateType[1];
  }

  public get getDialogEntitlementPolicyRangesState(): string {
    return this.dialogEntitlementPolicyRangesState === DialogStateType.Add
      ? DialogStateType[0]
      : DialogStateType[1];
  }

  private processDownloadedFile(result: Blob): void {
    try {
      if (result) {
        const fileName = 'Time Off Bulk Import.xlsx';
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
