import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';

import { IOptionItem } from 'src/app/models/generic.model';
import { DASHBOARDROUTE } from 'src/app/shared/constants/route.constant';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { AppState } from 'src/app/store';
import { isUserLoggedInSelector } from 'src/app/store/app.selector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kp-create-account-company-page',
  templateUrl: './create-account-company-page.component.html',
  styleUrls: ['./create-account-company-page.component.scss']
})
export class CreateAccountCompanyPageComponent extends GenericFormControls {
  public imgPath: string = environment.imgPath;
  public menusOptions: IOptionItem[] = [{
    label: 'Create Account',
    value: 'create_account'
  }, {
    label: 'Setup your company',
    value: 'setup_company'
  }, {
    label: 'Your dashboard is ready',
    value: 'dashboard_ready'
  }];
  public activeMenuOption: string = 'create_account';
  public isLoading: boolean = false;
  public isLoggedIn: boolean = false;

  constructor(private store: Store<AppState>, private fb: FormBuilder, private router: Router) {
    super();
    this.form = this.fb.group({
      account: this.fb.group({//note: test values for testing
        firstName: new FormControl('no', Validators.required),
        lastName: new FormControl('implementation', Validators.required),
        email: new FormControl('test.user.karbonpay@gmail.com', [Validators.required, Validators.email]),
        password: new FormControl('noimplementation123', Validators.required),
        terms: new FormControl(undefined, Validators.required)
      }),
      company: this.fb.group({
        companyName: new FormControl('test-company', Validators.required),
        numberOfEmployees: new FormControl(undefined, Validators.required)
      }),
    });
    this.store.pipe(select(isUserLoggedInSelector))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (isLoggedIn: boolean) => {
          this.isLoggedIn = isLoggedIn;
          if (isLoggedIn)
            this.router.navigateByUrl(DASHBOARDROUTE);
          this.isLoading = false;
        },
        error: (err) => console.log(`Login failed: ${err}`),
      });
  }

  public handlePageChange(menu: string): void {
    this.activeMenuOption = menu;
    switch (menu) {
      case 'goto-dashboard':
        alert('No implementation..')
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1000);
        break;
      case 'setup_company':
        break;
      default:
        break;
    }
  }
}
