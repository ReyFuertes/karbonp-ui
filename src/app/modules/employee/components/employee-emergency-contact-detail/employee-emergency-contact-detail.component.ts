import { Component, Input, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { IDynamicFormField } from '../../employee.model';

@Component({
  selector: 'kp-employee-emergency-contact-detail',
  templateUrl: './employee-emergency-contact-detail.component.html',
  styleUrls: ['./employee-emergency-contact-detail.component.scss']
})
export class EmployeeEmergencyContactDetailComponent extends GenericFormControls {
  @Input() public fields: IDynamicFormField[];
  @ViewChild("cd") public cd: ConfirmDialog | undefined;

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService) {
    super();
  }

  public onDeleteEmergencyContact(index: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove?',
      accept: () => {
        this.getEmergencyContacts.removeAt(index);
      },
      reject: () => {
        this.cd.reject();
      }
    });
  }

  public addEmergencyContact(): void {
    this.getEmergencyContacts.push(this.fb.group({
      fullName: new FormControl(undefined, Validators.required),
      relationship: new FormControl(undefined, Validators.required),
      phone: new FormControl(undefined, [Validators.required]),
      phoneAlternative: new FormControl(undefined)
    }));
    setTimeout(() => {
      const targetElement = document.querySelector(`.actions`);
      if (targetElement) {
        try {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        } catch (e) { console.log(e) }
      }
    }, 150);
  }

  public get getEmergencyContacts(): FormArray {
    return this.form.get("emergencyContacts") as FormArray;
  }
}
