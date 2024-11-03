import { Injectable, Injector } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';

import { loginAction, loginSuccessAction, logoutAction, logoutSuccessAction } from './auth.action';
import { AuthService } from '../auth.service';
import { LOGINROUTE } from 'src/app/shared/constants/route.constant';
import { LocalService } from 'src/app/services/local-storage.service';
import { initSetTokenAction, loginFailedAction } from 'src/app/store/app.action';
import { AppState } from '.';
import { GenericEffect } from 'src/app/shared/generics/notification.generic';
import { DEFAULT_CURRENT_ZA_LOCATION_ID } from 'src/app/shared/constants/generic.constant';

@Injectable()
export class AuthEffects extends GenericEffect {
  loginAction$ = createEffect(() => this.actions$.pipe(
    ofType(loginAction),
    switchMap(({ payload }) => this.authService.post(payload, '/auth/login')
      .pipe(
        switchMap((response) => {
          const tokenDetails = this.jwtHelperService.decodeToken(response?.token);
          const locationId = tokenDetails.LocationId !== '0'
            ? tokenDetails.LocationId
            : DEFAULT_CURRENT_ZA_LOCATION_ID; // note: set to fingoHR as default
          this.localService.setItem('locationId', locationId);
          return combineLatest([
            this.authService.get(`/auth/UpdateTokenWithLocation/${locationId}`,
              new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${response?.token}`,
              })),
            of(tokenDetails)
          ])
        }),
        map(([response, tokenDetails]) => {
          const token = response?.token;
          if (token) {
            this.localService.setItem('uniqueName', JSON.stringify(tokenDetails?.unique_name))
            this.store.dispatch(initSetTokenAction({ token }));
            localStorage.setItem('token', token);
            this.localService.setItem('tokenDetails', JSON.stringify(tokenDetails));
          }
          return loginSuccessAction({ response });
        }),
        catchError((error: any) => {
          this.getNotificationMessage({ status: 401 }, 'Login Failed');
          return of(loginFailedAction({ error: error?.title }));
        })
      ))
  ));

  logoutAction$ = createEffect(() => this.actions$.pipe(
    ofType(logoutAction),
    tap(() => {
      this.localService.clearItems();
      this.router.navigateByUrl(LOGINROUTE);
    }),
    map(() => logoutSuccessAction())
  ));

  constructor(
    injector: Injector,
    private router: Router,
    private store: Store<AppState>,
    private actions$: Actions,
    private localService: LocalService,
    private authService: AuthService,
    private jwtHelperService: JwtHelperService) {
    super(injector);
  }
}
