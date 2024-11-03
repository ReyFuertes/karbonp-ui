import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent extends GenericFormControls {
  @Output() public changePage = new EventEmitter<string>(undefined);

  public isLoading: boolean = false; //note: should be implemented this to state

  constructor(private router: Router) {
    super();
  }

  public redirectToPolicy(): void {
    window.open('https://policies.google.com/privacy', '_blank');
  }

  public redirectToTerms(): void {
    window.open('https://policies.google.com/terms', '_blank');
  }

  public get getAccountForm(): AbstractControl {
    return this.form.get('account');
  }

  public onGetStarted(): void {
    if (this.getAccountForm.valid) {
      this.changePage.emit('setup_company');
    }
  }
}
