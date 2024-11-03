import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Store, select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IEmployee, IEmployeeTakeOn } from '../../employee.model';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { getSelectedEmployeeSelector, getPhilippinesEmployeeTakeOnSelector } from '../../store/employee/employee.selector';
import { updateEmployeeTakeOnAction } from '../../store/employee/employee.action';
import { AppState } from 'src/app/store';

@Component({
  selector: 'kp-employee-take-on',
  templateUrl: './employee-take-on.component.html',
  styleUrls: ['./employee-take-on.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeTakeOnComponent extends GenericFormControls implements OnInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();
  @ViewChild("cd") public cd: ConfirmDialog | undefined;

  public isLoaded: boolean = false;
  public actionState: 'view' | 'add' | 'edit' = 'view';
  public currentSection: 'take_on' | '' = 'take_on';
  public employee: IEmployee;
  public employeeTakeOn: IEmployeeTakeOn;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
  ) {
    super();
    this.form = new FormGroup({
      id: new FormControl(undefined),
      employeeId: new FormControl(undefined),
      basicSalaryTaxable: new FormControl(undefined),
      deminimisBenefitsNonTaxable: new FormControl(undefined),
      hdmfContributionsNonTaxable: new FormControl(undefined),
      phicContributionsNonTaxable: new FormControl(undefined),
      salariesOtherCompensationNonTaxable: new FormControl(undefined),
      salariesOtherCompensationTaxable: new FormControl(undefined),
      sssContributionsNonTaxable: new FormControl(undefined),
      taxWithheld: new FormControl(undefined),
      thirteenthMonthPayOtherBenefitsNonTaxable: new FormControl(undefined),
      thirteenthMonthPayOtherBenefitsTaxable: new FormControl(undefined)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getPhilippinesEmployeeTakeOnSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employee, employeeTakeOn]) => {
        this.employee = employee;
        if (employee) {
          this.isLoaded = true;
          this.employeeTakeOn = employeeTakeOn;
          this.form.patchValue(this.employeeTakeOn, { emitEvent: true });
        }
      });
  }

  public onSaveChanges(): void {
    if (this.form.valid) {
      if (!this.form.value.id)
        delete this.form.value.id;
      this.store.dispatch(updateEmployeeTakeOnAction({
        payload: Object.assign({},
          this.form.value, {
          employeeId: this.form.value?.employeeId
            ? this.form.value?.employeeId
            : this.employee?.id
        })
      }))
      setTimeout(() => {
        this.savedFormChanges.emit(true);
        this.onCancel('take_on');
      }, 1000);
    }
  }

  public onCancel(section: any): void {
    this.actionState = 'view';
    this.currentSection = section;
  }

  public onEdit(section: any): void {
    this.actionState = 'edit';
    this.currentSection = section;
  }
}
