import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IDynamicFormField } from '../../employee.model';
import { LocalService } from 'src/app/services/local-storage.service';
import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';

@Component({
  selector: 'kp-employee-biography-detail',
  templateUrl: './employee-biography-detail.component.html',
  styleUrls: ['./employee-biography-detail.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeBiographyDetailComponent extends GenericFormControls {
  @Input() public fields: IDynamicFormField[];

  public bioTranslateParam: { [key: string]: string };

  constructor(private localService: LocalService) {
    super();
    this.bioTranslateParam = {
      firstName: this.form?.get('basics').value?.firstName || '',
      CompanyName: this.localService.getEncItem('companyName')
        ? JSON.parse(this.localService.getEncItem('companyName'))
        : 'YourCompanyName'
    };
  }

  public get getBiographyForm(): FormGroup {
    return <FormGroup>this.form.get('biography');
  }
}
