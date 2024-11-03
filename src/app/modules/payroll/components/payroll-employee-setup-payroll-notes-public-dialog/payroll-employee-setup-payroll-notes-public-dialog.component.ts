import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { saveNotesAction } from '../../store/payroll-input/payroll-input.action';

@Component({
  selector: 'kp-payroll-employee-setup-payroll-notes-public-dialog',
  templateUrl: './payroll-employee-setup-payroll-notes-public-dialog.component.html'
})
export class PayrollEmployeeSetupPayrollNotesPublicDialogComponent extends GenericPage {
  public notesPublicModalTitle: string;
  public showNotesPublicModal: boolean = false;
  public notesPublicForm: FormGroup;

  constructor(injector: Injector) {
    super(injector)
    this.notesPublicForm = new FormGroup({
      employeeId: new FormControl(undefined, Validators.required),
      payRunId: new FormControl(undefined, Validators.required),
      notes: new FormControl(undefined, [Validators.required, Validators.maxLength(500)]),
      isPrivateNote: new FormControl(false),
      copyNoteOver: new FormControl(undefined),
    })
  }

  public onSave(): void {
    if (this.notesPublicForm.valid) {
      this.store.dispatch(saveNotesAction({ payload: this.notesPublicForm.value }));
      setTimeout(() => this.showNotesPublicModal = false, 300);
    }
    else
      console.log('Invalid form..')
  }
}
