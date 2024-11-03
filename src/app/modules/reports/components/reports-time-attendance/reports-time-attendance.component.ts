import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-reports-time-attendance',
  templateUrl: './reports-time-attendance.component.html',
  styleUrls: ['./reports-time-attendance.component.scss']
})
export class ReportsTimeAttendanceComponent extends GenericFormControls {
  public columns: string[] = ['Company', 'Location', 'Active Employees'];
  public testData: any[] = [{
    company: 'ABC Company',
    location: '	Employee Test',
    activeEmployees: '1'
  }];
  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      fromDate: new FormControl(undefined),
      toDate: new FormControl(undefined),
      search: new FormControl(undefined)
    });
  }
}