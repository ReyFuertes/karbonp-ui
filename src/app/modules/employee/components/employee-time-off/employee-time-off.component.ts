import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { combineLatest, filter, takeUntil } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import * as moment from 'moment';
import { Paginator } from 'primeng/paginator';

import { EmployeeRequestStatusType, IEmployeeTimeOffBookings, ILatestTimeBalance, ILeaveSetup, IOptionItem, ITimeOffActivity, ITimeOffBooking, ITimeOffBookingItem, TimeOffType } from 'src/app/models/generic.model';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { AppState } from 'src/app/store';
import { IEmployee, IEmployeeTimeOffActivity, IEmployeeTimeOffPolicy, IEmployeeTimeOffTakeOn, ITimeOffAdjustment } from '../../employee.model';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getLeaveTimeOffSetupPoliciesSelector } from 'src/app/store/app.selector';
import { getSelectedEmployeeSelector } from '../../store/employee/employee.selector';
import { IsTimeOffLoadingSelector, getEmployeeLatestTimeBalanceSelector, getEmployeeTimeOffActivitiesSelector, getEmployeeTimeOffAdjustmentsSelector, getEmployeeTimeOffBookingsSelector, getEmployeeTimeOffPoliciesSelector, getEmployeeTimeOffTakeOnsSelector } from '../../store/time-off/time-off.selector';
import { deleteTimeOffAdjustmentAction, deleteTimeOffBookingAction, saveEmployeeTimeOffAdjustmentsAction, saveEmployeeTimeOffPolicyAction, saveEmployeeTimeOffTakeOnAction, setEmployeeTimeOffLoadingAction, updateEmployeeSaveTimeOffBookingAction } from '../../store/time-off/time-off.action';

@Component({
  selector: 'kp-employee-time-off',
  templateUrl: './employee-time-off.component.html',
  styleUrls: ['./employee-time-off.component.scss'],
  animations: [fadeInAnimation(100)]
})
export class EmployeeTimeOffComponent extends GenericFormControls implements OnInit {
  @ViewChild('op') public op: any;
  @ViewChild('overlayTarget') public overlayTarget: ElementRef;
  @ViewChild('inputHours') inputHours: ElementRef;
  @ViewChild('inputNotes') inputNotes: ElementRef;
  @ViewChild("cd") public cd: ConfirmDialog | undefined;
  @ViewChild('paginator', { static: false }) paginator: Paginator;
  @Output() public savedFormChanges = new EventEmitter<boolean>();

  public getTimeOffType = GetTypes(TimeOffType);
  public employeeRequestStatusType = GetTypes(EmployeeRequestStatusType);
  public timeAdjustmentForm: FormGroup;
  public timeOffSetupPolicyForm: FormGroup;
  public latestTimeBalances: ILatestTimeBalance[] = [];
  public isOverlayShowing: boolean = false;
  public employee: IEmployee;
  public policies: IOptionItem[] = [];
  public timeOffActivities: ITimeOffActivity[] = [];
  public timeOffMOnth: string = '';
  public timeOffBookings: IEmployeeTimeOffBookings;
  public diffDays: number[] = [];
  public partials: number[] = [];
  public showBookingDetailsDialog: boolean = false;
  public selectedTimeOff: ITimeOffBooking;
  public selectedTabIndex: number = 0;
  public timeOffAdjustments: ITimeOffAdjustment[];
  public showTimeOffAdjustmentsDialog: boolean = false;
  public policyObj: any;
  public isLoaded: boolean = false;
  public timeoffLeaveSetupPolicies: ILeaveSetup[] = [];
  public employeeTimeOffSetupPolicies: IEmployeeTimeOffPolicy[];
  public employeeTimeOffTakeOns: IEmployeeTimeOffTakeOn[];
  public employeeTimeOffActivities: IEmployeeTimeOffActivity[];
  public paginatedEmployeeTimeOffActivities: IEmployeeTimeOffActivity[];
  public balanceHistoryLeavePolicyId: number;

  constructor(private store: Store<AppState>,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService) {
    super();
    this.form = new FormGroup({
      employeeId: new FormControl(undefined),
      fromDate: new FormControl(undefined, [Validators.required]),
      leaveSetupId: new FormControl(false),
      note: new FormControl(undefined),
      toDate: new FormControl(undefined, [Validators.required]),
      timeOffBookingItems: new FormArray([])
    });

    this.timeAdjustmentForm = new FormGroup({
      date: new FormControl(undefined, [Validators.required]),
      amount: new FormControl(undefined, [Validators.required]),
      description: new FormControl(undefined),
      leaveSetupId: new FormControl(undefined),
      employeeId: new FormControl(undefined)
    });

    this.form.get('timeOffBookingItems')
      .valueChanges
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((values) => {
        values.forEach((value: ITimeOffBookingItem) => {
          if (value.timeOffType === 1)
            value.hours = 8;
        });
      })

    combineLatest([
      this.form.get('fromDate').valueChanges,
      this.form.get('toDate').valueChanges
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([fromDate, toDate]) => {
        if (toDate && toDate) {
          this.getTimeOffBookingsForm.clear();
          const duration = moment(toDate).endOf('d').diff(moment(fromDate).startOf('d'), 'hours');
          const overlapInHours = (duration + 1) / 3;
          const employeeHours = overlapInHours / 8;
          for (let i = 0; i < employeeHours; i++) {
            this.getTimeOffBookingsForm.push(this.fb.group({ date: toDate, hours: 8, timeOffBookingId: 0, timeOffType: 1 }));
          }
        }
      });
  }

  ngOnInit(): void {
    this.selectedTabIndex = Number(localStorage.getItem('selectedTabTimeOff') || 0);
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getEmployeeLatestTimeBalanceSelector)),
      this.store.pipe(select(getEmployeeTimeOffBookingsSelector)),
      this.store.pipe(select(getEmployeeTimeOffAdjustmentsSelector)),
      this.store.pipe(select(getLeaveTimeOffSetupPoliciesSelector)),
      this.store.pipe(select(getEmployeeTimeOffPoliciesSelector)),
      this.store.pipe(select(getEmployeeTimeOffTakeOnsSelector)),
      this.store.pipe(select(getEmployeeTimeOffActivitiesSelector))
    ]).pipe(
      filter(response => !!response[0] && !!response[1]),
      takeUntil(this.$unsubscribe)
    ).subscribe({
      next: ([employee, employeeLatestTimeBalances, employeeTimeOffBookings, timeOffAdjustments, timeoffLeaveSetupPolicies, employeeTimeOffSetupPolicies, employeeTimeOffTakeOns, employeeTimeOffActivities]) => {
        this.employee = employee;
        this.latestTimeBalances = employeeLatestTimeBalances
          ?.map((latestTimeBalance: ILatestTimeBalance) => latestTimeBalance);
        this.policies = employeeLatestTimeBalances
          ?.map(latestTimeBalance => latestTimeBalance.leaveSetup)
          ?.map((leave: ILeaveSetup) => ({ label: leave.name, value: leave.id }));
        this.timeOffActivities = employeeLatestTimeBalances
          ?.map(latestTimeBalance => latestTimeBalance.timeOffActivity);
        this.timeOffMOnth = employeeLatestTimeBalances
          ? employeeLatestTimeBalances[0]?.timeOffActivity.month
          : '';
        this.timeOffBookings = employeeTimeOffBookings;
        this.timeOffAdjustments = timeOffAdjustments;
        this.policyObj = this.policies?.reduce(function (acc: any, cur: IOptionItem) {
          acc[cur.value] = cur;
          return acc;
        }, {});
        this.timeoffLeaveSetupPolicies = timeoffLeaveSetupPolicies;
        this.employeeTimeOffSetupPolicies = [];
        employeeTimeOffSetupPolicies.forEach((timeOffSetup: any) => {
          this.employeeTimeOffSetupPolicies.push(Object.assign({}, {
            entitlementPolicies: this.fmtEntitlementPolicies(timeOffSetup?.timeOffSetupId)
          }, timeOffSetup));
        });
        this.employeeTimeOffTakeOns = [];
        employeeTimeOffTakeOns.forEach((takeOn: IEmployeeTimeOffTakeOn) => {
          this.employeeTimeOffTakeOns.push(Object.assign({}, {
            ...takeOn,
            endOfTakeOnPeriod: new Date(takeOn.endOfTakeOnPeriod),
          }));
        });
        this.employeeTimeOffActivities = employeeTimeOffSetupPolicies.map((policy) => {
          const activity = employeeTimeOffActivities.find(m => m.leaveSetup.name === policy?.timeOffSetupName);
          const fromDate = activity?.fromDate;
          const toDate = activity?.toDate;
          let dateRange = [];
          const lastRange: IOptionItem = {
            label: `${moment(fromDate).format('DD/MM/yyyy')} - ${moment(toDate).format('DD/MM/yyyy')}`,
            value: `${moment(toDate).format('DD/MM/yyyy')}`
          };
          dateRange.push(lastRange);
          dateRange = dateRange.sort((a, b) => a.value['value'] > b.value['value'] ? -1 : a.value['value'] === b.value['value'] ? 0 : 1);
          return { ...activity, dateRange, selectedDateRange: lastRange }
        });
        this.store.dispatch(setEmployeeTimeOffLoadingAction({ loading: false }));
      }
    });
  }

  public isTimeOffLoading = () => this.store.pipe(select(IsTimeOffLoadingSelector))

  public onSaveEmployeeTimeOffTakeOns(): void {
    const payload = this.employeeTimeOffTakeOns.map(takeOn => {
      return {
        accrued: takeOn.accrued,
        closingBalance: takeOn.closingBalance,
        employeeId: takeOn.employeeId,
        previousCycleBalance: takeOn.previousCycleBalance,
        taken: takeOn.taken,
        cycleStart: moment(takeOn.cycleStart).format('DD/MM/yyyy'),
        cycleEnd: moment(takeOn.cycleEnd).format('DD/MM/yyyy'),
        endOfTakeOnPeriod: moment(takeOn.endOfTakeOnPeriod).format('DD/MM/yyyy'),
        leaveSetupId: takeOn.leaveSetup.id
      };
    });
    this.store.dispatch(saveEmployeeTimeOffTakeOnAction({
      payload: { timeOffTakeOns: payload }
    }));
    setTimeout(() => {
      this.savedFormChanges.emit(true);
    }, 300);
  }

  public onSaveTimeAdjustments(): void {
    if (this.timeAdjustmentForm.valid) {
      const payload = {
        ...this.timeAdjustmentForm.value,
        leaveSetupId: this.balanceHistoryLeavePolicyId,
        employeeId: this.employee?.id,
        date: moment(this.timeAdjustmentForm.value?.date).format('DD/MM/YYYY'),
      };
      this.store.dispatch(saveEmployeeTimeOffAdjustmentsAction({ payload }));
      setTimeout(() => {
        this.showTimeOffAdjustmentsDialog = false;
        this.timeAdjustmentForm.reset();
        this.savedFormChanges.emit(true);
      }, 300);
    }
  }

  public onSaveEmployeeTimeOffSetupPolicy(): void {
    this.store.dispatch(saveEmployeeTimeOffPolicyAction({ payload: this.employeeTimeOffSetupPolicies }));
    setTimeout(() => {
      this.savedFormChanges.emit(true);
    }, 300);
  }

  public getTimeOffSetupPolicy(id: number): any {
    return this.timeoffLeaveSetupPolicies.find(policy => policy.id === id);
  }

  public fmtEntitlementPolicies(id: number): IOptionItem[] {
    const policies: IOptionItem[] = [];
    policies.push({ label: 'Default Policy', value: null });
    if (this.timeoffLeaveSetupPolicies?.length > 0) {
      const timeoffLeaveSetupPolicy = this.timeoffLeaveSetupPolicies.find(timeOffSetup => timeOffSetup.id === id);
      const entitlementPolicies = timeoffLeaveSetupPolicy?.entitlementPolicies;
      if (entitlementPolicies) {
        policies.push(...entitlementPolicies.map(policy => ({ label: `${policy.id} Days`, value: policy?.id }))) || [];
      }
      else
        policies;
    }
    return [];
  }

  public onSaveChanges(): void {
    const payload = {
      ...this.form.value,
      employeeId: `${this.employee?.id}`,
      leaveSetupId: `${this.form.value?.leaveSetupId}`,
      fromDate: moment(this.form.value?.fromDate).format('DD/MM/YYYY'),
      toDate: moment(this.form.value?.toDate).format('DD/MM/YYYY'),
      timeOffBookingItems: this.form.value.timeOffBookingItems?.map((item: ITimeOffBookingItem) => {
        return { ...item, date: moment(item.date).format('DD/MM/YYYY') }
      })
    };
    this.store.dispatch(updateEmployeeSaveTimeOffBookingAction({ payload }));
    setTimeout(() => {
      this.onClose();
      this.savedFormChanges.emit(true);
    }, 300);
  }

  public handleTabChange(event: any): void {
    localStorage.setItem('selectedTabTimeOff', event.index)
  }

  public onView(timeOff: ITimeOffBooking): void {
    this.showBookingDetailsDialog = !this.showBookingDetailsDialog;
    this.selectedTimeOff = timeOff;
  }

  public onDeleteAdjustment(adjustment: ITimeOffAdjustment): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this item?`,
      accept: () => {
        if (adjustment?.id)
          this.store.dispatch(deleteTimeOffAdjustmentAction({ id: adjustment?.id }));
        else
          alert('Time-off id not found..');
        this.onClose();
        setTimeout(() => {
          this.savedFormChanges.emit(true);
        }, 300);
      },
      reject: () => {
        this.cd.reject();
      }
    });
  }

  public onDeleteTimeOff(timeOff: ITimeOffBooking): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this item?`,
      accept: () => {
        if (timeOff?.timeOffBooking?.id)
          this.store.dispatch(deleteTimeOffBookingAction({ id: timeOff?.timeOffBooking?.id }));
        else
          alert('Time-off id not found..');
        this.onClose();
        setTimeout(() => {
          this.savedFormChanges.emit(true);
        }, 300);
      },
      reject: () => {
        this.cd.reject();
      }
    });
  }

  public requestHolidayTimeOff(op: any, event: any, latestTimeBalance: ILatestTimeBalance): void {
    this.form.reset();
    this.form.patchValue({ employeeId: this.employee?.id, leaveSetupId: latestTimeBalance?.leaveSetup.id })
    setTimeout(() => this.inputNotes.nativeElement.focus(), 0);
    op.show(event, event.nativeElement);
    this.isOverlayShowing = !this.isOverlayShowing;
  }

  public getProgressBarValue(timeOffActivity: ITimeOffActivity): any {
    return (timeOffActivity?.closingBalance / timeOffActivity?.openingBalance) * 100;
  }

  public get getTimeOffBookings(): ITimeOffBooking[] {
    return this.timeOffBookings?.timeOffBookings;
  }

  public get getTimeOffBookingsForm(): FormArray {
    return this.form.get("timeOffBookingItems") as FormArray;
  }

  public get getPolicyIcon(): any {
    return { 1: 'travel', 2: 'work_alert', 3: 'pregnant_woman' };
  }

  public get getPolicyColor(): any {
    return { 1: '#5e93f0', 2: '#f55555', 3: '#23b548' };
  }

  public onClose(): void {
    this.op.hide();
  }
}
