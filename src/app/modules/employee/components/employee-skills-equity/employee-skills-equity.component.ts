import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IEmployee, IEmployeeSkillsEquity } from '../../employee.model';
import { GetTypes } from 'src/app/shared/util/types.util';
import { GenderType, IOptionItem, IPassportCountryCodes, MaritalStatusType } from 'src/app/models/generic.model';
import { getPassportCountryCodesSelector } from 'src/app/store/app.selector';
import { getEmployeeSkillsAndEquitySelector, getSelectedEmployeeSelector } from '../../store/employee/employee.selector';
import { updateEmployeeskillsEquityAction } from '../../store/employee/employee.action';
import { AppState } from 'src/app/store';

@Component({
  selector: 'kp-employee-skills-equity',
  templateUrl: './employee-skills-equity.component.html',
  styleUrls: ['./employee-skills-equity.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeSkillEquityComponent extends GenericFormControls implements OnInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();
  @ViewChild("cd") public cd: ConfirmDialog | undefined;

  public genderType = GetTypes(GenderType);
  public maritalStatusType = GetTypes(MaritalStatusType);
  public isLoaded: boolean = false;
  public actionState: 'view' | 'add' | 'edit' = 'view';
  public currentSection: 'skills_equity' | '' = 'skills_equity';
  public employee: IEmployee;
  public passportCountryCodes: IOptionItem[] = [];
  public employeeSkillsAndEquity: IEmployeeSkillsEquity;

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
  ) {
    super();
    this.form = new FormGroup({
      id: new FormControl(undefined),
      gender: new FormControl(undefined, [Validators.required]),
      maritalStatus: new FormControl(undefined, [Validators.required]),
      numberOfDependents: new FormControl(undefined, [Validators.required]),
      passportCountryCodeId: new FormControl(undefined),
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getPassportCountryCodesSelector)),
      this.store.pipe(select(getEmployeeSkillsAndEquitySelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employee, passportCountryCodes, employeeSkillsAndEquity]) => {
        this.isLoaded = true;
        this.employee = employee;
        this.passportCountryCodes = passportCountryCodes.map((country: IPassportCountryCodes) =>
          ({ label: country.country, value: country.id }));
        if (employeeSkillsAndEquity) {
          this.employeeSkillsAndEquity = employeeSkillsAndEquity;
          this.form.reset();
          this.form.patchValue(employeeSkillsAndEquity, { emitEvent: true });
        }
      });
  }

  public onSaveChanges(): void {
    if (this.form.valid) {
      if (!this.form.value.id)
        delete this.form.value.id;
      this.store.dispatch(updateEmployeeskillsEquityAction({
        payload: Object.assign({},
          this.form.value, {
          employeeId: this.form.value?.employeeId
            ? this.form.value?.employeeId
            : this.employee?.id
        })
      }));
      setTimeout(() => {
        this.savedFormChanges.emit(true);
        this.onCancel('documents_notes');
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

  public get getPassportCountryCode(): IOptionItem {
    return this.passportCountryCodes
      .find(code => code.value === this.employeeSkillsAndEquity?.passportCountryCodeId);
  }
}
