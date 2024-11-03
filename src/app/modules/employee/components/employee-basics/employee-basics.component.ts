import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { LocalService } from 'src/app/services/local-storage.service';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-employee-basics',
  templateUrl: './employee-basics.component.html',
  styleUrls: ['./employee-basics.component.scss']
})
export class EmployeeBasicsComponent extends GenericFormControls {
  @Output() public saveContinueChange = new EventEmitter<string>();

  public empBasicsTranslateParam: { [key: string]: string };

  constructor(private localService: LocalService) {
    super();
    this.empBasicsTranslateParam = {
      CompanyName: this.localService.getEncItem('companyName')
        ? JSON.parse(this.localService.getEncItem('companyName'))
        : 'YourCompanyName'
    };
  }

  public onSaveContinue(): void {
    this.saveContinueChange.emit('job_details');
  }

  public get getBasicsForm(): AbstractControl | null {
    return this.form.get('basics');
  }
}
