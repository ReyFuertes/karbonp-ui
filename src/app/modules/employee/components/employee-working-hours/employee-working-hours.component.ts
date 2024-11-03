import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { combineLatest, takeUntil } from 'rxjs';

import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { AppState } from 'src/app/store';
import { EmployeeWorkingOptionType, IEmployee, IEmployeeShift, IEmployeeWorkingHour } from '../../employee.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { getEmployeeShiftsSelector } from 'src/app/store/app.selector';
import { IOptionItem } from 'src/app/models/generic.model';
import { getSelectedEmployeeSelector, getSelectedEmployeeRegularHoursSelector } from '../../store/employee/employee.selector';
import { updateEmployeeWorkingHoursAction } from '../../store/employee/employee.action';

@Component({
  selector: 'kp-employee-working-hours',
  templateUrl: './employee-working-hours.component.html',
  styleUrls: ['./employee-working-hours.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeWorkingHoursComponent extends GenericDestroy implements OnInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();

  public form: FormGroup;
  public actionState: 'view' | 'edit' = 'view';
  public currentSection: 'working_hours' | '' = 'working_hours';
  public employeeWorkingOptionType = GetTypes(EmployeeWorkingOptionType);
  public isLoaded: boolean = false;
  public employeeShifts: IOptionItem[] = [];
  public hasAnnualWorkingDaysOverride: boolean = false;
  public employee: IEmployee;
  public workingHours: IEmployeeWorkingHour;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder
  ) {
    super();
    this.form = new FormGroup({
      employeeId: new FormControl(undefined),
      shiftId: new FormControl(undefined),
      hoursPerDay: new FormControl(undefined),
      mondayHours: new FormControl(undefined),
      mondayType: new FormControl(undefined),
      tuesdayHours: new FormControl(undefined),
      tuesdayType: new FormControl(undefined),
      wednesdayHours: new FormControl(undefined),
      wednesdayType: new FormControl(undefined),
      thursdayHours: new FormControl(undefined),
      thursdayType: new FormControl(undefined),
      fridayHours: new FormControl(undefined),
      fridayType: new FormControl(undefined),
      saturdayHours: new FormControl(undefined),
      saturdayType: new FormControl(undefined),
      sundayHours: new FormControl(undefined),
      sundayType: new FormControl(undefined),
      fullDaysPerWeek: new FormControl(undefined),
      fullDaysPerWeekOveride: new FormControl(undefined),
      annualWorkingDays: new FormControl(undefined),
      annualWorkingDaysOverride: new FormControl(undefined),
      hasAnnualWorkingDaysOverride: new FormControl(false),
      hasFullDaysPerWeekOveride: new FormControl(false)
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getSelectedEmployeeRegularHoursSelector)),
      this.store.pipe(select(getEmployeeShiftsSelector))
    ]).pipe(
      takeUntil(this.$unsubscribe),)
      .subscribe(([employee, workingHours, employeeShifts]) => {
        if (employee) {
          this.employee = employee;
          this.workingHours = workingHours;
          this.form.patchValue(Object.assign({}, workingHours, {
            hasAnnualWorkingDaysOverride: workingHours?.annualWorkingDaysOverride !== null
              ? true
              : false,
            hasFullDaysPerWeekOveride: workingHours?.fullDaysPerWeekOveride !== null
              ? true
              : false,
          }), { emitEvent: true });
          if (employeeShifts)
            this.employeeShifts = employeeShifts.map((shift: IEmployeeShift) => ({ label: shift.name, value: shift.id }));
          this.isLoaded = true;
        }
      });
  }

  public isWorkTypeOff(value: number): boolean {
    return value === 0
      ? true
      : false;
  }

  public onSaveChanges(): void {
    if (this.form.valid) {
      this.store.dispatch(updateEmployeeWorkingHoursAction({
        payload: Object.assign({}, this.form.value, {
          employeeId: this.form.value?.employeeId
            ? this.form.value?.employeeId
            : this.employee?.id
        })
      }));
      setTimeout(() => {
        this.savedFormChanges.emit(true);
        this.onCancel('working_hours');
      }, 1000);
    }
  }

  public onCancel(section: any): void {
    this.form.reset();
    this.actionState = 'view';
    this.currentSection = section;
  }

  public onEdit(section: any): void {
    this.actionState = 'edit';
    this.currentSection = section;
  }
}
