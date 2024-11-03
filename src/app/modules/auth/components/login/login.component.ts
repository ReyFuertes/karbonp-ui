import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { loginAction } from '../../store/auth.action';
import { AppState } from 'src/app/store';
import { DASHBOARDROUTE, SIGNUPROUTE } from 'src/app/shared/constants/route.constant';
import { isAppLoadingSelector, isUserLoggedInSelector } from 'src/app/store/app.selector';
import { LocalService } from 'src/app/services/local-storage.service';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';

@Component({
  selector: 'kp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends GenericFormControls implements OnInit {
  public imgPath: string = environment.imgPath;
  public loginTranslateParam: { [key: string]: string };

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private localService: LocalService) {
    super();
    this.form = this.fb.group({
      email: [undefined, [Validators.required, Validators.email]],
      password: [undefined, Validators.required]
    });
    this.loginTranslateParam = {
      CompanyName: this.localService.getEncItem('companyName')
        ? JSON.parse(this.localService.getEncItem('companyName'))
        : 'YourCompanyName'
    };
  }

  ngOnInit(): void {
    this.store.pipe(select(isUserLoggedInSelector))
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: (isLoggedIn: boolean) => {
          if (isLoggedIn === true)
            this.router.navigateByUrl(DASHBOARDROUTE);
        }
      });
  }

  public isLoadingAsync = () => this.store.pipe(select(isAppLoadingSelector));

  public login(): void {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.store.dispatch(loginAction({
        payload: { email, password }
      }));
    }
  }

  public onCreateAccount(): void {
    this.router.navigateByUrl(SIGNUPROUTE);
  }
}
