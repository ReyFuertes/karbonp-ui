import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-payroll-payruns-detail',
  templateUrl: './payroll-payruns-detail.component.html',
  styleUrls: ['./payroll-payruns-detail.component.scss']
})
export class PayrollPayrunsDetailComponent extends GenericFormControls {
  public columns: string[] = ['Person', 'Gross Pay', 'Tax', 'Other Deductions', 'Net Pay'];
  public payruns: any[] = [{
    person: 'Andrew Field',
    grossPay: 'R 45,000.00',
    tax: 'R 7,234.00',
    otherDeductions: 'R 3,100.00',
    netpay: 'R 43,023.00',
  }];

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      filterBy: new FormControl(undefined),
      toDate: new FormControl(undefined)
    });
  }
}