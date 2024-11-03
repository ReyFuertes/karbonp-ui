import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-reports-time-off-balances',
  templateUrl: './reports-time-off-balances.component.html',
  styleUrls: ['./reports-time-off-balances.component.scss']
})
export class ReportsTimeOffBalancesComponent extends GenericFormControls {
  public employees: IOptionItem[] = [{
    label: 'All Employees',
    value: '0'
  }, {
    label: 'All Active Employees',
    value: '1'
  }, {
    label: 'All Inactive Employees',
    value: '2'
  }];

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      date: new FormControl(undefined),
      employee: new FormControl(undefined),
      payPoints: new FormControl(undefined)
    });
  }
}