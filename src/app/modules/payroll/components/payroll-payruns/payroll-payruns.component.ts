import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';
import * as moment from 'moment';
import { Dropdown } from 'primeng/dropdown';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { completeInProgressPayRunAction, createCustomPayrunAction, deletePayRunAction, getPayrunInProgressAction, reCalculatePayRunPayslipsAction, releasePayRunAction, validateForInabilityToCompletePayRunAction } from '../../store/payrun-in-progress/payroll-payrun-in-progress.action';
import { getAbilityToCompletePayRunSelector, getIsReleasePayRunSuccessSelector, getIsRequestedPayslipCompletedSelector, getPayrollPayrunInProgressFilterLoadingSelector, getPayrollPayrunInProgressLoadingSelector, getPayrollPayrunInProgressSelector, getPayrollPayrunsInProgressTotalItemsSelector, getSelfServiceEnabledCountSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';
import { IEtfSetup, IPayrunCompleted, IPayrunInProgress, IPayrunTimeAttendance } from '../../payroll.model';
import { getDownloadedPayRunExcelExportSelector, getDownloadedPayRunPdfExportSelector, getPayrollPayrunCompletedSelector, getPayrollPayrunsCompleteTotalItemsSelector } from '../../store/payrun-completed/payroll-payruns-completed.selector';
import { generatePayRunExcelExportAction, getPayrunCompletedAction, undoPayRunCompletePayrunAction } from '../../store/payrun-completed/payroll-payruns-completed.action';
import { IOptionItem, IPaginationPayload, IPayPeriod, IUser } from 'src/app/models/generic.model';
import { getPayrollEftSetupAction } from '../../store/overview/payroll-overview.action';
import { getPayrollEtfSetupSelector } from '../../store/overview/payroll-overview.selector';
import { ConfirmationSeverityType, EmployeeSelectStatusType, PayRunStatusType, RunPayslipStatusType } from 'src/app/models/generic.enum';
import { getPayrollPayrunTimeAttendanceSelector, getPayrollPayrunTimetrackingIntegrationSelector } from '../../store/payroll-timetracking/payroll-timetracking.selector';
import { getPayrunTimeAttendanceAction, getPayrunTimeTrackingIntegrationAction } from '../../store/payroll-timetracking/payroll-timetracking.action';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { getLoggedInUserSelector, getMultiSelectEmployeesSelector, getPayPeriodsSelector } from 'src/app/store/app.selector';
import { GetTypes } from 'src/app/shared/util/types.util';
import { processPayrunDownload } from 'src/app/shared/util/payrun.util';
import { PAGINATION_VARS } from 'src/app/shared/constants/generic.constant';
import { getLoggedInUserAction, getPayPeriodsAction } from 'src/app/store/app.action';
import { environment } from 'src/environments/environment';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-payruns',
  templateUrl: './payroll-payruns.component.html',
  styleUrls: ['./payroll-payruns.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class PayrollPayrunsComponent extends GenericPage implements OnInit {
  @ViewChild('filterDropdown') filterDropdown: Dropdown;

  public imgPath: string = environment.imgPath;
  public langCulture: string = 'en'; //note: get this from global settings
  public pageKey: string = CURRENT_PAYRUN_PAGE_KEY;
  public defaultOptions = GetTypes(EmployeeSelectStatusType, 0);
  public completePayrunForm: FormGroup;
  public employeeForm: FormGroup;
  public createCustomPayrunForm: FormGroup;
  public selectedTabIndex: number = 0;
  public payrunInProgress: IPayrunInProgress[];
  public payrunCompleted: IPayrunCompleted[];
  public paymentMethodsForCompany: string[];
  public etfSetup: IEtfSetup;
  public payRunStatusType = PayRunStatusType;
  public timeTrackingEnabled: boolean = false;
  public timeAttendance: IPayrunTimeAttendance;
  public customPayRunModal: boolean = false;
  public employeeOptions: IOptionItem[];
  public maxSelectedLabels: number = null;
  public selectionLimit: number = null;
  public allEmployees: IOptionItem[];
  public payPeriods: IPayPeriod[];
  public runPayslipStatusType = RunPayslipStatusType;
  public payFrequency: IPayPeriod;
  public validateCompletePayRunModal: boolean;
  public abilityToCompletePayRun: any;
  public hasPreviousPayments: boolean;
  public selectedInProgressPayrun: IPayrunInProgress;
  public completePayRunConfirmationMessage: string;
  public completePayRunSatSubmissionMessage: string;
  public hascompletePayRunShowSchedulePayment: boolean = false;
  public downloadedPayRunExcelExportData = new Map<number, any>();
  public downloadedPayRunPdfExport = new Map<number, any>();
  public payRunId: number;
  public currentInProgressPayRun: IPayrunInProgress;
  public confirmationSeverity = ConfirmationSeverityType;
  public reCalculateInfoModal: boolean = false;
  public isRequestedPayslipCompleted: boolean = false;
  public selfServiceEnabledCount: number;
  public releasePayslipModal: boolean = false;
  public payrollCompletePayrunsTotalItems: number = 0;
  public payrollInProgressPayrunsTotalItems: number = 0;
  public payRunCompletePageNumber = 0;
  public payRunCompleteRows = PAGINATION_VARS.pagesize;
  public payRunInProgressPageNumber = 0;
  public payRunInProgressRows = PAGINATION_VARS.pagesize;
  public loggedInUser: IUser;

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(getLoggedInUserAction());
    this.store.dispatch(getPayPeriodsAction({ payload: { active: true, sortBy: "Name", sortAscending: true } }))
    this.store.dispatch(getPayrunTimeAttendanceAction());
    this.store.dispatch(getPayrunTimeTrackingIntegrationAction());
    this.store.dispatch(getPayrollEftSetupAction());
    this.loadPayruns([
      { sortBy: 'ToDate' },
      { sortBy: 'EndDate', sortAscending: false }
    ]);
    this.employeeForm = this.fb.group({
      employees: new FormControl(undefined, Validators.required),
      date: new FormControl(undefined),
      name: new FormControl(undefined)
    });
    this.createCustomPayrunForm = this.fb.group({
      employees: new FormControl(undefined),
      date: new FormControl(undefined, Validators.required),
      name: new FormControl(undefined)
    });
    this.completePayrunForm = this.fb.group({
      completePayRunReleasePayslips: new FormControl(undefined),
      completePayRunCancelPreviousPayment: new FormControl(undefined),
      completePayRunSchedulePayment: new FormControl(undefined),
      payDate: new FormControl(undefined)
    });
    const currentPayrollPage = localStorage.getItem(this.pageKey);
    if (currentPayrollPage)
      this.activeMenuOption = JSON.parse(currentPayrollPage);
    else
      this.activeMenuOption = '/payroll/payruns';
    this.gotoRoute(this.pageKey, this.activeMenuOption);
    const payrollPayrunsSelectedTab = localStorage.getItem('payrollPayrunsSelectedTab');
    if (payrollPayrunsSelectedTab)
      this.selectedTabIndex = JSON.parse(payrollPayrunsSelectedTab);
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getMultiSelectEmployeesSelector)),
      this.store.pipe(select(getPayrollEtfSetupSelector)),
      this.store.pipe(select(getPayrollPayrunInProgressSelector)),
      this.store.pipe(select(getPayrollPayrunCompletedSelector)),
      this.store.pipe(select(getPayrollPayrunsCompleteTotalItemsSelector)),
      this.store.pipe(select(getPayrollPayrunsInProgressTotalItemsSelector)),
      this.store.pipe(select(getPayrollPayrunTimetrackingIntegrationSelector)),
      this.store.pipe(select(getPayrollPayrunTimeAttendanceSelector)),
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getAbilityToCompletePayRunSelector)),
      this.store.pipe(select(getDownloadedPayRunExcelExportSelector)),
      this.store.pipe(select(getDownloadedPayRunPdfExportSelector)),
      this.store.pipe(select(getIsRequestedPayslipCompletedSelector)),
      this.store.pipe(select(getSelfServiceEnabledCountSelector)),
      this.store.pipe(select(getIsReleasePayRunSuccessSelector)),
      this.store.pipe(select(getLoggedInUserSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employees, etfSetup, payrunInProgress, payrunCompleted, payrollCompletePayrunsTotalItems, payrollInProgressPayrunsTotalItems, timeTrackingEnabled,
        timeAttendance, payPeriods, abilityToCompletePayRun, downloadedPayRunExcelExport, downloadedPayRunPdfExport, isRequestedPayslipCompleted,
        selfServiceEnabledCount, isReleasePayRunSuccess, loggedInUser]) => {
        this.allEmployees = employees?.map(employee => ({ value: employee?.id, label: employee?.fullName, active: employee?.isActive }));
        this.employeeOptions = this.allEmployees;
        this.etfSetup = etfSetup;
        this.payrunInProgress = payrunInProgress;
        this.hascompletePayRunShowSchedulePayment = this.payrunInProgress?.filter(payRun => payRun?.directPaymentsEnabled)?.length > 0;
        this.payrunCompleted = payrunCompleted;
        this.payrollCompletePayrunsTotalItems = payrollCompletePayrunsTotalItems;
        this.payrollInProgressPayrunsTotalItems = payrollInProgressPayrunsTotalItems
        this.paymentMethodsForCompany = [...new Set(this.payrunCompleted
          ?.map(payrun => payrun?.paymentMethods?.map(method => method.name)[0]))]
          ?.sort((a, b) => a.localeCompare(b));
        this.timeTrackingEnabled = timeTrackingEnabled;
        if (!this.timeTrackingEnabled)
          this.timeTrackingEnabled = !!timeAttendance;
        this.payPeriods = payPeriods; //note: display null names?
        this.abilityToCompletePayRun = abilityToCompletePayRun;
        if (abilityToCompletePayRun?.data?.hasPreviousPayrunsInProgress) {
          //note: show pay run completion failed modal
          return;
        }
        this.downloadedPayRunExcelExportData = downloadedPayRunExcelExport;
        if (this.downloadedPayRunExcelExportData) {
          const downloadedPayslip = this.downloadedPayRunExcelExportData?.get(this.payRunId);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getExportExcelPdfFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
        this.downloadedPayRunPdfExport = downloadedPayRunPdfExport;
        if (this.downloadedPayRunExcelExportData) {
          const downloadedPayslip = this.downloadedPayRunExcelExportData?.get(this.payRunId);
          if (downloadedPayslip) {
            try {
              processPayrunDownload(downloadedPayslip?.data, this.getExportExcelPdfFileName);
            } catch (error) {
              this.showError(error as string);
            }
          }
        }
        this.isRequestedPayslipCompleted = isRequestedPayslipCompleted;
        if (this.isRequestedPayslipCompleted && this.completePayrunForm.get('completePayRunReleasePayslips')?.value === true) {
          setTimeout(() => this.releasePayslipModal = true, 1000);
        }
        //else if (this.payrunInProgress?.filter(payrun => payrun?.directPaymentsEnabled)?.length > 0) {
        //cancelPayment(this.payRunPaymentId, this.paymentService, this.payRunToCompleteId);
        //}
        if (isReleasePayRunSuccess === true && this.completePayrunForm.get('completePayRunSchedulePayment')?.value === true) {
          setTimeout(() => {
            this.router.navigateByUrl(`/payroll/payruns/schedule-payment/${this.selectedInProgressPayrun?.id}`);
          }, 1000);
        }
        this.selfServiceEnabledCount = selfServiceEnabledCount;
        this.loggedInUser = loggedInUser;
      })
  }

  public onSchedulePayment(payRunId: number): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, `/payroll/payruns/schedule-payment/${payRunId}`);
  }

  public onViewPayment(payRunPaymentId: number): void {
    if (payRunPaymentId) {
      this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, `/payroll/payruns/payment-details/${payRunPaymentId}`);
    }
    else
      console.log('Error: payrun id invalid');
  }

  public onUndoPayRun(payRunId: number): void {
    this.confirmationSeverityStatus = ConfirmationSeverityType.Error;
    this.confirmationService.confirm({
      message: 'Are you sure you want to undo completed payrun?',
      accept: () => {
        if (payRunId)
          this.store.dispatch(undoPayRunCompletePayrunAction({ payRunId }));
        else
          console.log('Error: payRunId invalid')
      },
      reject: () => {
        try {
          this.cd.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public onDeletePayRun(payRunId: number): void {
    this.confirmationSeverityStatus = ConfirmationSeverityType.Error;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this pay run? All future draft payslips related to the employees in this pay run will be re-calculated?',
      accept: () => {
        if (payRunId)
          this.store.dispatch(deletePayRunAction({ payRunId }))
        else
          console.log('Error: payRunId invalid')
      },
      reject: () => {
        try {
          this.cd.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public generatePayRunPdfExport(payRunId: number, methodType: string) {
    this.payRunId = payRunId;
    if (payRunId) {
      const downloadedPayslip = this.downloadedPayRunExcelExportData?.get(payRunId);
      if (downloadedPayslip)
        processPayrunDownload(downloadedPayslip?.data, this.getExportExcelPdfFileName);
      else
        this.store.dispatch(generatePayRunExcelExportAction({ payRunId, cultureLang: this.langCulture, methodType }));
    }
  }

  public generatePayRunExcelExport(payRunId: number, methodType: string) {
    this.payRunId = payRunId;
    if (payRunId) {
      const downloadedPayslip = this.downloadedPayRunExcelExportData?.get(payRunId);
      if (downloadedPayslip)
        processPayrunDownload(downloadedPayslip?.data, this.getExportExcelPdfFileName);
      else
        this.store.dispatch(generatePayRunExcelExportAction({ payRunId, cultureLang: this.langCulture, methodType }));
    }
  }

  public onRecalculatePayslips(payRunId: number): void {
    this.confirmationSeverityStatus = ConfirmationSeverityType.Success;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to re-calculate?',
      accept: () => {
        if (payRunId) {
          this.store.dispatch(reCalculatePayRunPayslipsAction({ payRunId }));
          setTimeout(() => {
            this.reCalculateInfoModal = true;
          }, 2000);
        }
      },
      reject: () => {
        try {
          this.cd.reject();
        } catch (error) { console.log(error) }
      }
    });
  }

  public onBulkUpdate(payRunId: number): void {
    this.gotoRoute(this.pageKey, `payroll/payruns/bulk-update/${payRunId}`);
  }

  //note: ability to validiate complete payrun should be in the pay in progress request?
  public onValidateCompletePayRun(payRun: IPayrunInProgress): void {
    this.selectedInProgressPayrun = payRun;
    if (payRun?.id)
      this.store.dispatch(validateForInabilityToCompletePayRunAction({ id: this.selectedInProgressPayrun?.id }));
    this.hasPreviousPayments = this.selectedInProgressPayrun?.payRunPaymentId !== null;
    this.completePayRunConfirmationMessage = '';
    if (this.selectedInProgressPayrun?.totalPendingPayslips > 0)
      this.completePayRunConfirmationMessage = 'PayRunCompletionWithDraftsConfirmationMessage';
    else
      this.completePayRunConfirmationMessage = 'PayRunCompletionConfirmationMessage';
    this.completePayRunSatSubmissionMessage = null;
    if (this.currentCountryISOCode === this.countryISOCodeType.MEX) {
      this.completePayRunSatSubmissionMessage = this.selectedInProgressPayrun?.liveSATSubmissionEnabled
        ? 'SATLiveSubmissionWarningMessage' :
        'SATTestSubmissionWarningMessage';
    }
    this.validateCompletePayRunModal = !this.validateCompletePayRunModal;
  }

  private get isUserCanCompletePayRun(): boolean {
    return (this.currentCountryISOCode === this.countryISOCodeType.PHL
      && this.completePayrunForm.value?.payDate)
      || this.currentCountryISOCode !== this.countryISOCodeType.PHL;
  }

  public onCompletePayRun(): void {
    const value = this.completePayrunForm.value;
    if (this.isUserCanCompletePayRun) {
      this.store.dispatch(completeInProgressPayRunAction({
        payload: {
          payRunId: this.selectedInProgressPayrun?.id,
          payDate: this.currentCountryISOCode === this.countryISOCodeType.PHL
            ? moment(value?.payDate).format('DD/MM/YYYY')
            : null,
        }
      }));
      setTimeout(() => this.validateCompletePayRunModal = false, 350);
    }
  }

  public onReleasePayslip(): void {
    if (this.selectedInProgressPayrun?.id) {
      this.store.dispatch(releasePayRunAction({ payRunId: this.selectedInProgressPayrun?.id, cultureLang: 'en' })) //note: get culture lang globally
      this.releasePayslipModal = false;
    }
  }

  public onPaginateInProgress(event: any): void {
    this.store.dispatch(getPayrunInProgressAction({
      payload: Object.assign({},
        this.payload, { pageNumber: (event?.first + 1), pagesize: event?.rows })
    }));
  }

  public onChangeEmployees(event: any): void {
    this.employeeForm.get('employees').patchValue(event.value);
    const hasDefaultOptions = event.value?.filter((option: any) => ['All', 'Active', 'Inactive'].includes(option.value));
    if (hasDefaultOptions?.length > 0) {
      this.selectionLimit = 1;
      const hasDefaultValues = ['All', 'Active', 'Inactive'].includes(event.itemValue?.value);
      if (hasDefaultValues) {
        const results = event.value?.filter((value: IOptionItem) => {
          return [value].indexOf(event.itemValue) > -1;
        });
        this.employeeForm.get('employees').patchValue(results);
      }
    } else
      this.selectionLimit = null;
    this.setChipPaddings(event?.value);
  }

  public onResetPayruns(): void {
    this.payFrequency = undefined;
    this.loadPayruns([
      { sortBy: 'ToDate' },
      { sortBy: 'EndDate', sortAscending: false }
    ]);
    this.filterDropdown.clear();
  }

  public onFilterPayRuns(): void {
    if (this.payFrequency) {
      this.loadPayruns([
        { sortBy: 'ToDate', payFrequencyId: this.payFrequency?.id, },
        { sortBy: 'EndDate', sortAscending: false, payFrequencyId: this.payFrequency?.id, }
      ]);
    }
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrollPayrunInProgressLoadingSelector));
  public isFilterLoadingAsync = () => this.store.pipe(select(getPayrollPayrunInProgressFilterLoadingSelector));

  public onSaveCustomPayrun(): void {
    if (this.createCustomPayrunForm.valid) {
      const value = this.createCustomPayrunForm.value;
      this.store.dispatch(createCustomPayrunAction({
        payload: {
          name: value?.name,
          employeeIds: value?.employees,
          date: moment(value?.date).format('DD/MM/YYYY')
        }
      }));
      setTimeout(() => this.customPayRunModal = false, 300);
    }
  }

  public onEdit(id: number): void {
    this.gotoRoute(this.currentPageKey, `/payroll/payruns/edit/${id}`);
  }

  public getCountOfPaymentMethods(payemntMethodName: string, payRunId: number): number {
    return this.payrunCompleted
      ?.find(payrun => payrun?.id == payRunId)
      ?.paymentMethods.find(method => method.name == payemntMethodName)?.count ?? 0;
  }

  public isPayrunCompleted(row: IPayrunInProgress): boolean {
    return row?.hasPastInProgressPayRuns === false
      && row?.hasPayslipsNeedingRecalculation === false
      && this.canCompletePayRun(row) === false;
  }

  public isPayrunInProgress(row: IPayrunInProgress): boolean {
    return row?.hasPastInProgressPayRuns === true
      || row?.hasPayslipsNeedingRecalculation;
  }

  public canCompletePayRun(row: IPayrunInProgress): boolean {
    return row?.hasPayslipsNeedingRecalculation === false
      && row?.hasPastInProgressPayRuns === false
      && row?.isProcessing === false
      && row?.status !== 1
      && row?.totalPayslips - row?.totalPendingPayslips > 0
  }

  public onPaginatePayrunInProgress(event: any): void {
    this.store.dispatch(getPayrunInProgressAction({
      payload: {
        pageNumber: event?.page + 1,
        pagesize: event?.rows,
        sortBy: 'ToDate',
        sortAscending: true,
        payFrequencyId: null
      }
    }));
  }

  public onPaginatePayrunComplete(event: any): void {
    this.store.dispatch(getPayrunCompletedAction({
      payload: {
        pageNumber: event?.page + 1,
        pagesize: event?.rows,
        sortBy: 'EndDate',
        sortAscending: true,
        payFrequencyId: null
      }
    }));
  }

  public handleTabChange(event: any): void {
    localStorage.setItem('payrollPayrunsSelectedTab', JSON.parse(event?.index));
  }

  private payload: IPaginationPayload = { pageNumber: PAGINATION_VARS.pageNumber, pagesize: PAGINATION_VARS.pagesize, sortBy: 'ToDate', sortAscending: true, payFrequencyId: null };

  private loadPayruns(params: any[]): void {
    this.store.dispatch(getPayrunInProgressAction({ payload: Object.assign({}, this.payload, { ...params[0] }) }));
    this.store.dispatch(getPayrunCompletedAction({ payload: Object.assign({}, this.payload, { ...params[1] }) }));
  }

  private get getExportExcelPdfFileName(): string {
    return 'Completed Pay Run Export';
  }
}