import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-reports-create-edit',
  templateUrl: './reports-create-edit.component.html',
  styleUrls: ['./reports-create-edit.component.scss']
})
export class ReportsCreateEditComponent extends GenericFormControls {
  public params: string;

  constructor(private fb: FormBuilder, private route: Router) {
    super();
    this.form = this.fb.group({
      fromDate: new FormControl(undefined),
      toDate: new FormControl(undefined),
      employee: new FormControl(undefined)
    });
  }

  public onCancel(): void {
    this.route.navigateByUrl('/reports');
  }
}