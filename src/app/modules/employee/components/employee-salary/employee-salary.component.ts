import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-employee-salary',
  templateUrl: './employee-salary.component.html',
  styleUrls: ['./employee-salary.component.scss']
})
export class EmployeeSalaryComponent extends GenericFormControls {
  @Output() public saveContinueChange = new EventEmitter<string>();

  public currencies: IOptionItem[] = [
    { label: '', value: '' },
    { label: 'GBP - British Pount', value: 'gbp' },
    { label: 'PHP - Phil Peso', value: 'php' }
  ];
  public frequencies: IOptionItem[] = [
    { label: '', value: '' },
    { label: 'Annually', value: '12' },
    { label: 'Bi-annually', value: '6' }
  ];

  constructor() {
    super();
  }

  public onSaveContinue(): void {
    this.saveContinueChange.emit('other');
  }

  public get getSalaryForm(): AbstractControl | null {
    return this.form.get('salary');
  }
}
