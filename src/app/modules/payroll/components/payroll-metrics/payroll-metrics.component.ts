import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-payroll-metrics',
  templateUrl: './payroll-metrics.component.html',
  styleUrls: ['./payroll-metrics.component.scss']
})
export class PayrollMetricsComponent extends GenericFormControls {

  constructor(private fb: FormBuilder, private router: Router) {
    super();
    this.form = this.fb.group({
      fromDate: new FormControl(undefined),
      toDate: new FormControl(undefined)
    });
  }

  public gotoOverview(): void {
    this.router.navigateByUrl('/payroll/overview');
  }
}