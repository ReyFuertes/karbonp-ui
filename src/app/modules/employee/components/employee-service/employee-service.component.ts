import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import * as moment from 'moment';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { IOptionItem, StatusReasonCodeType } from 'src/app/models/generic.model';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { AppState } from 'src/app/store';
import { GetTypes } from 'src/app/shared/util/types.util';
import { IEmployee, IEmployeeService } from '../../employee.model';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { getSelectedEmployeeSelector, getSelectedEmployeeServiceSelector, getSelectedEmployeeServicesSelector } from '../../store/employee/employee.selector';
import { cancelEmployeeTerminationAction, updateEmployeeServiceAction } from '../../store/employee/employee.action';

@Component({
  selector: 'kp-employee-service',
  templateUrl: './employee-service.component.html',
  styleUrls: ['./employee-service.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeServiceComponent extends GenericFormControls implements OnInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();
  @ViewChild("cd") public cd: ConfirmDialog | undefined;

  public actionState: 'view' | 'edit' = 'view';
  public currentSection: 'employee_service' | '' = 'employee_service';
  public isLoaded: boolean = false;
  public employeeShifts: IOptionItem[] = [];
  public statusReasonCodeType = GetTypes(StatusReasonCodeType);
  public employee: IEmployee;
  public employeeService: IEmployeeService;
  public employeeServices: IEmployeeService[];
  public reinstate: boolean = false;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService
  ) {
    super();
    this.form = new FormGroup({
      employeeId: new FormControl(undefined),
      lastDayOfService: new FormControl(undefined, [Validators.required]),
      statusReason: new FormControl(undefined, [Validators.required]),
      expectedReturnDate: new FormControl(undefined),
      notes: new FormControl(undefined),
      paidDuringTemporaryAbsence: new FormControl(undefined),
      reinstatementDate: new FormControl(undefined),
      deactivateEmployee: new FormControl(false)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getSelectedEmployeeServiceSelector)),
      this.store.pipe(select(getSelectedEmployeeServicesSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employee, employeeService, employeeServices]) => {
        if (employee) {
          this.employee = employee;
          this.employeeService = employeeService;
          this.employeeServices = employeeServices;
          if (employeeService) {
            this.form.reset();
            this.form.patchValue(Object.assign({}, employeeService, {
              lastDayOfService: new Date(employeeService.lastDayOfService)
            }))
          }
          this.isLoaded = true;
        }
      });
  }

  public onCancelTermination(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to cancel termination?',
      accept: () => {
        this.store.dispatch(cancelEmployeeTerminationAction({ id: this.employeeService?.id.toString() }));
        this.onSaveCancel();
      },
      reject: () => {
        this.cd.reject();
      }
    });
  }

  public onReinstate(): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Reinstate?',
      accept: () => {
        this.reinstate = !this.reinstate;
        this.store.dispatch(updateEmployeeServiceAction({
          payload: Object.assign({},
            this.form.value, {
            employeeId: this.form.value?.employeeId
              ? this.form.value?.employeeId
              : this.employee?.id,
            lastDayOfService: moment(this.form.value?.lastDayOfService).format('DD/MM/YYYY'),
            expectedReturnDate: moment(this.form.value?.expectedReturnDate).format('DD/MM/YYYY'),
            reinstatementDate: moment(this.form.value?.reinstatementDate).format('DD/MM/YYYY')
          })
        }));
        this.onSaveCancel();
      },
      reject: () => {
        this.cd.reject();
      }
    });
  }

  public onSaveChanges(): void {
    if (this.form.valid) {
      delete this.form.value?.deactivateEmployee;
      delete this.form.value?.paidDuringTemporaryAbsence;
      this.store.dispatch(updateEmployeeServiceAction({
        payload: Object.assign({},
          this.form.value, {
          employeeId: this.form.value?.employeeId
            ? this.form.value?.employeeId
            : this.employee?.id,
          lastDayOfService: moment(this.form.value?.lastDayOfService).format('DD/MM/YYYY'),
          expectedReturnDate: moment(this.form.value?.expectedReturnDate).format('DD/MM/YYYY')
        })
      }));
      this.onSaveCancel();
    }
  }

  public onCancel(): void {
    this.actionState = 'view';
    this.currentSection = 'employee_service';
  }

  public onEdit(section: any): void {
    this.actionState = 'edit';
    this.currentSection = section;
  }

  private onSaveCancel(): void {
    setTimeout(() => {
      this.savedFormChanges.emit(true);
      this.onCancel();
    }, 1000);
  }
}
