import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-reports-monthly-payment',
  templateUrl: './reports-monthly-payment.component.html',
  styleUrls: ['./reports-monthly-payment.component.scss']
})
export class ReportsMonthlyPaymentComponent extends GenericFormControls {
  public columns: string[] = ['Company', 'Pay Run Date', 'Payment Date', 'Reference', '	Payment Total', 'Transaction Fees', 'Payment Total With Fees', 'Status', 'Successful Payments'];
  public testData: any[] = [{
    
  }];

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      fromDate: new FormControl(undefined),
      toDate: new FormControl(undefined),
      status: new FormControl(undefined)
    });
  }
}
