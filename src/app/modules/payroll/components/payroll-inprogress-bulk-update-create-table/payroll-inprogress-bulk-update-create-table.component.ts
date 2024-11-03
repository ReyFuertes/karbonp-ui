import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { IMultiSelectEmployee, IOptionItem, IPaypoint, PaymentType } from 'src/app/models/generic.model';
import { GenericPage } from 'src/app/shared/generics/page.generic';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getPayPointsSelector } from 'src/app/store/app.selector';
import { getPayrunBulkUpdateLoadingSelector, getPayrunBulkUpdateSetupDataSelector, getPayRunEmployeeDataSelector } from '../../store/payrun-bulk-update/payrun-bulk-update.selector';
import { applyBulkPayRunUpdateAction, getPayRunEmployeeDataAction } from '../../store/payrun-bulk-update/payrun-bulk-update.action';
import { IEmployee } from 'src/app/modules/employee/employee.model';
import { CURRENT_PAYRUN_PAGE_KEY } from 'src/app/shared/constants/payroll.constant';

@Component({
  selector: 'kp-payroll-inprogress-bulk-update-create-table',
  templateUrl: './payroll-inprogress-bulk-update-create-table.component.html',
  styleUrls: ['./payroll-inprogress-bulk-update-create-table.component.scss']
})
export class PayrollInProgressBulkUpdateCreateTableComponent extends GenericPage implements OnInit, OnChanges {
  @Input() public payRunId: number;

  public maxSelectedLabels: number = null;
  public selectionLimit: number = null;
  public employeeOptions: IMultiSelectEmployee[];
  public payPointOptions: IPaypoint[];
  public incomeOptions: IOptionItem[] = [];
  public payRunEmployeeData: IEmployee[] = undefined;
  public paymentType = PaymentType;
  public paymentTypeOptions = GetTypes(PaymentType);
  public copyNotesOptions: IOptionItem[] = [{
    label: 'Yes',
    value: true
  }, {
    label: 'No',
    value: false
  }];

  constructor(injector: Injector) {
    super(injector);
    this.form = this.fb.group({
      employeeIds: new FormControl(undefined, Validators.required),
      language: new FormControl('en'), //note: set this from somewhere else
      payPoints: new FormControl(undefined),
      payRunId: new FormControl(undefined),
      payrollInputItems: new FormControl([]), //note: where this is used?
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getPayrunBulkUpdateSetupDataSelector)),
      this.store.pipe(select(getPayRunEmployeeDataSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([payPoints, payrollSetupData, payRunEmployeeData]) => {
        this.employeeOptions = payrollSetupData?.employees;
        this.payPointOptions = payPoints;
        this.payRunEmployeeData = payRunEmployeeData?.map(data => {
          //note: re-structure object, response is a mess cant bind properly -_-
          return Object.assign({}, data, {
            copyNotesOver: data.payslip?.copyNotes,
            copyPrivateNotesOver: data.payslip?.copyPrivateNotes,
            notes: data.payslip?.notes,
            privateNotes: data.payslip?.privateNotes,
          })
        });
      })
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges;
    this.payRunId = changes['payRunId']?.currentValue;
  }

  public onFilter(): void {
    if (this.form.valid) {
      const value = this.form.value;
      this.store.dispatch(getPayRunEmployeeDataAction({
        payload: {
          employeeIds: value?.employeeIds || [],
          language: 'en', //note: set from global settings somewhere
          payPointIds: value?.payPointIds || [],
          payRunId: this.payRunId
        }
      }))
    }
  }

  public onSave(): void {
    if (this.payRunEmployeeData?.length > 0) {
      const payload = this.payRunEmployeeData?.map((data) => {
        const _data: any = Object.assign({}, data);
        delete _data.payslip;
        return _data;
      });
      this.store.dispatch(applyBulkPayRunUpdateAction({ payload, payRunId: this.payRunId }));
    }
  }

  public onCancel(): void {
    this.gotoRoute(CURRENT_PAYRUN_PAGE_KEY, `payroll/payruns`);
  }

  public onReset(): void {
    this.form.reset();
    this.payRunEmployeeData = undefined;
  }

  public isLoadingAsync = () => this.store.pipe(select(getPayrunBulkUpdateLoadingSelector));

  public onChangeEmployees(event: any): void {
    if (event?.value) {
      this.form.get('employeeIds').patchValue(event.value);
      this.setChipPaddings(event?.value);
    }
  }
}
