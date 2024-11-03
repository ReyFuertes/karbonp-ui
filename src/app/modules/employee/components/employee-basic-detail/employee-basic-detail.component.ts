import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IDynamicFormField } from '../../employee.model';

@Component({
  selector: 'kp-employee-basic-detail',
  templateUrl: './employee-basic-detail.component.html',
  styleUrls: ['./employee-basic-detail.component.scss']
})
export class EmployeeBasicDetailComponent extends GenericFormControls implements AfterViewInit {
  @Input() public fields: IDynamicFormField[];

  constructor(private cdRef: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  public get getBasicsForm(): FormGroup {
    return <FormGroup>this.form.get('basics');
  }
}
