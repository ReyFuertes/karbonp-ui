import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { IPayrun } from '../../payroll.model';
import { IEmployeeActivityLog, IPaymentMethod, IPayPeriod } from 'src/app/models/generic.model';
import { getEmployeeActivityLogsSelector, getPayrollPayrunInProgressLoadingSelector } from '../../store/payrun-in-progress/payroll-payrun-in-progress.selector';

@Component({
  selector: 'kp-payroll-employee-setup-activity',
  templateUrl: './payroll-employee-setup-activity.component.html',
  styleUrls: ['./payroll-employee-setup-activity.component.scss']
})
export class PayrollEmployeeSetupActivityComponent extends GenericPage implements OnInit, OnChanges {
  @Input() public payRuns: IPayrun[];
  @Input() public payPeriod: IPayPeriod;
  @Input() public employeePaymentMethod: IPaymentMethod;

  @Output() public loadActivityLogChange = new EventEmitter<number>();

  public activityLogs: IEmployeeActivityLog[] = [];
  public activityLogsLoaded: boolean = false;
  public loadClickCount: number = 0;
  public selectedPeriod: any;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getEmployeeActivityLogsSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([activityLogs]) => {
        this.activityLogs = activityLogs;
        if (this.activityLogs?.length > 0) {
          this.activityLogsLoaded = true;
          for (let i = 0; i < this.activityLogs.length; i++) {
            this.activityLogs[i].actions = this.activityLogs[i]?.action?.split('|')
              ?.map(action => action?.trim())
              ?.filter((action) => {
                return action !== null || action?.trim() !== ''
              });
          }
        }
      })
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrollPayrunInProgressLoadingSelector));

  public filterActivityLogs(): void {
    if (this.selectedPeriod?.id)
      this.loadActivityLogChange.emit(this.selectedPeriod.id);
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges;
    if (changes['payRuns']?.currentValue)
      this.payRuns = changes['payRuns']?.currentValue;
    if (changes['payPeriod']?.currentValue)
      this.payPeriod = changes['payPeriod']?.currentValue;
    if (changes['employeePaymentMethod']?.currentValue)
      this.employeePaymentMethod = changes['employeePaymentMethod']?.currentValue;
  }
}
