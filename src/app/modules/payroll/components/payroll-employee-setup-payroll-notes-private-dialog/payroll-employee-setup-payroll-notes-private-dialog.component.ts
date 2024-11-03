import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { saveNotesAction } from '../../store/payroll-input/payroll-input.action';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-notes-private-dialog',
  templateUrl: './payroll-employee-setup-payroll-notes-private-dialog.component.html'
})
export class PayrollEmployeeSetupPayrollNotesPrivateDialogComponent extends GenericPage {
  public notesPrivateModalTitle: string;
  public showNotesPrivateModal: boolean = false;
  public notesPrivateForm: FormGroup;

  constructor(injector: Injector) {
    super(injector)
    this.notesPrivateForm = new FormGroup({
      employeeId: new FormControl(undefined, Validators.required),
      payRunId: new FormControl(undefined, Validators.required),
      notes: new FormControl(undefined, [Validators.required, Validators.maxLength(500)]),
      isPrivateNote: new FormControl(true),
      copyNoteOver: new FormControl(undefined),
    })
  }

  public onSave(): void {
    if (this.notesPrivateForm.valid) {
      this.store.dispatch(saveNotesAction({ payload: this.notesPrivateForm.value }));
      setTimeout(() => this.showNotesPrivateModal = false, 300);
    }
    else
      console.log('Invalid form..')
  }
}
