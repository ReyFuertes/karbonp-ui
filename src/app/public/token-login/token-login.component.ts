import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, first, map, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { GenericDestroy } from '../../shared/generics/generic-destroy-page';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { BlockUIService } from 'src/app/services/blockui.service';
import { AppState } from 'src/app/store';
import { LocalService } from 'src/app/services/local-storage.service';
import { DEFAULT_CURRENT_ZA_LOCATION_ID } from 'src/app/shared/constants/generic.constant';
import { initSetTokenAction } from 'src/app/store/app.action';

@Component({
  selector: 'kp-token-login',
  templateUrl: './token-login.component.html',
  styleUrls: ['./token-login.component.scss']
})
export class TokenLoginComponent extends GenericDestroy {
  private sendAwayUrl: string = 'https://www.google.com'; //note: send away to google when user do not meet the criterias

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private authService: AuthService,
    private localService: LocalService,
    public blockUIService: BlockUIService,
    private jwtHelperService: JwtHelperService) {
    super();
    this.route.queryParamMap
      .pipe(first())
      .subscribe(params => {
        const objectParams: any = {
          userUID: params.get('userUID'),
          userLoginToken: params.get('userLoginToken'),
          thirdPartySyncUID: params.get('thirdPartySyncUID')
        }
        const payload: any = Object.keys(objectParams)
          .filter(key => objectParams[key] !== null)
          .reduce((object: any, key: any) => {
            object[key] = objectParams[key];
            return object;
          }, {});
        this.blockUIService.setBlockUI(true);
        this.authService.post(payload, `/ThirdPartySync/tokenlogin`)
          .pipe(
            tap((response) => {
              if (response?.success === false)
                throw response;
              if (response?.errors && Object.keys(response?.errors)?.length > 0) //note: if no sucess prop found, send away to google
                throw { redirectURL: this.sendAwayUrl }
            }),
            switchMap((response) => {
              if (response?.token) {
                const tokenDetails = this.jwtHelperService.decodeToken(response?.token);
                const currentLocationId: string = tokenDetails?.CurrentLocationId || tokenDetails?.LocationId;
                const userLocationId = (currentLocationId !== '0'
                  ? currentLocationId
                  : DEFAULT_CURRENT_ZA_LOCATION_ID) //note: default to fingoHR
                this.localService.setItem('locationId', JSON.stringify(userLocationId));
                return combineLatest([
                  this.authService.get(`/auth/UpdateTokenWithLocation/${userLocationId}`,
                    new HttpHeaders({
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      Authorization: `Bearer ${response?.token}`,
                    })),
                  of(tokenDetails)
                ])
              }
              return of([]);
            }),
            map(([response, tokenDetails]) => {
              const token = response?.token;
              if (token) {
                this.localService.setItem('uniqueName', JSON.stringify(tokenDetails?.unique_name))
                this.store.dispatch(initSetTokenAction({ token }));
                localStorage.setItem('token', token);
                this.localService.setItem('tokenDetails', JSON.stringify(tokenDetails));
                this.router.navigateByUrl('dashboard');
              }
            }),
            catchError((error) => of(error))
          ).subscribe({
            next: (response) => {
              if (response?.redirectURL)
                window.location.href = `${response?.redirectURL}`;
              this.blockUIService.setBlockUI(false);
            }
          });
      })
  }
}
