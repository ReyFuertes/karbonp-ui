import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, takeUntil } from 'rxjs';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { AppState } from 'src/app/store';
import { getSelectedEmployeeSelector } from '../../store/employee/employee.selector';
import { IEmployee, OffboardReasonType } from '../../employee.model';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { GetTypes } from 'src/app/shared/util/types.util';
import { EmploymentStatusType, FormState } from 'src/app/models/generic.enum';
import { updateEmployeeAccountStatusAction } from '../../store/employee-job-details/employee-job-details.action';
import { IPeopleStatus } from 'src/app/modules/people/people.model';
import { getPeopleStatusesSelector } from 'src/app/modules/people/store/people-status/people-status.selector';

@Component({
  selector: 'kp-employee-job-details',
  templateUrl: './employee-job-details.component.html',
  styleUrls: ['./employee-job-details.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeJobDetailsComponent extends GenericFormControls implements OnInit {
  @Output() public savedFormChanges = new EventEmitter<boolean>();
  @ViewChild("cd") public cd: ConfirmDialog;

  public employee: IEmployee;
  public employeeStatuses = GetTypes(EmploymentStatusType);
  public employeeOffboardReasons = GetTypes(OffboardReasonType, 0);
  public employmentType: IOptionItem[] = [{
    label: 'Full-Time',
    value: 'Full-Time'
  }, {
    label: 'Part-Time',
    value: 'Part-Time'
  }, {
    label: 'Contractor',
    value: 'Contractor'
  }, {
    label: 'Intern',
    value: 'Intern'
  }];
  public selectedEmploymentType: IOptionItem;
  public manager: IOptionItem[] = [{
    label: 'None',
    value: 'none'
  }, {
    label: 'Brad Price',
    value: 'Brad Price'
  }, {
    label: 'Darren Brockett',
    value: 'Darren Brockett'
  }];
  public team: IOptionItem[] = [{
    label: '',
    value: ''
  }];
  public teamOptions: IOptionItem[] = [{
    label: '1',
    value: '1'
  }, {
    label: '2',
    value: '2'
  }, {
    label: '5',
    value: '5'
  }, {
    label: 'Development',
    value: 'Development'
  }, {
    label: 'QA',
    value: 'QA'
  }, {
    label: 'Test',
    value: 'Test'
  }];
  public officesOptions: IOptionItem[] = [{
    label: 'Cape Town',
    value: 'Cape Town'
  }, {
    label: 'Dallas',
    value: 'Dallas'
  }, {
    label: 'Harare',
    value: 'Harare'
  }, {
    label: 'Mexico City',
    value: 'Mexico City'
  }];
  public hasStartDateOptions: string[] = ['Contractor', 'Intern'];
  public currentSection: 'summary' | 'account' | 'team_manager' = 'account';
  public actionState: 'view' | 'edit' = 'view';
  public showOffboardDialog: boolean = false;
  public accountStatusValue: string;
  public accountStatusLabel: string;
  public statusOptions: IOptionItem[] = [];
  public statusDictionaries = new Map<number, IPeopleStatus>();
  public statuses: IPeopleStatus[];

  constructor(private store: Store<AppState>, private confirmationService: ConfirmationService) {
    super();
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getPeopleStatusesSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employee, statuses]) => {
        this.employee = employee;
        this.statusOptions = statuses?.map(status => ({ label: status.name?.toLowerCase(), value: status.id?.toString() }));
        if (this.employee?.peopleStatus) {
          const status = this.statusOptions
            .find(status => status.value === this.employee.peopleStatus.toString());
          this.accountStatusValue = status?.value;
          this.accountStatusLabel = status?.label;
        }
        this.statusDictionaries.clear();
        statuses.forEach(status => this.statusDictionaries.set(status.id, status));
        this.statuses = this.statusDictionaries.values()
          ? Array.from(this.statusDictionaries.values())
            .map(status => Object.assign({}, status, { name: status.name.toLowerCase() }))
          : [];
      });
  }

  public onSaveChanges(): void {
    if (this.accountStatusValue) {
      const employeeWithStatus = Object.assign({}, this.employee, {
        peopleStatus: Number(this.accountStatusValue)
      });
      delete employeeWithStatus?.rules; //note: i dont why this causing error in the api
      this.store.dispatch(updateEmployeeAccountStatusAction({ payload: employeeWithStatus }));
    }
  }

  public onDeleteOffboardDialog(employee: IEmployee): void {
    this.confirmationService.confirm({
      accept: () => {
        console.log('Not implemented', employee)
      }
    });
  }

  public onEdit(section: any): void {
    this.actionState = FormState.edit;
    this.currentSection = section;
  }

  public onCancel(section: any): void {
    this.actionState = FormState.view;
    this.currentSection = section;
  }

  public get hasEmploymentStartDate(): boolean {
    return this.hasStartDateOptions.find(option => this.selectedEmploymentType?.value === option)
      ? true
      : false;
  }
}
