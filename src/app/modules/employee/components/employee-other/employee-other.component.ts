import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { DASHBOARDROUTE } from 'src/app/shared/constants/route.constant';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-employee-other',
  templateUrl: './employee-other.component.html',
  styleUrls: ['./employee-other.component.scss']
})
export class EmployeeOtherComponent extends GenericFormControls {
  @Output() public saveContinueChange = new EventEmitter<string>();

  constructor(private router: Router) {
    super();
  }

  public saveInviteLater(): void {
    this.router.navigateByUrl(DASHBOARDROUTE);
  }

  public get getOtherForm(): AbstractControl | null {
    return this.form.get('other');
  }
}
