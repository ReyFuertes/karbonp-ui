import { Store, select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { AppState } from '../store';
import { isUserLoggedInSelector } from '../store/app.selector';

@Injectable()
export class AuthGuard {
  constructor(private store: Store<AppState>, private router: Router) { }

  public canActivate() {
    return this.store.pipe(select(isUserLoggedInSelector))
      .pipe(tap(isLoggedIn => {
        if (!isLoggedIn)
          this.router.navigateByUrl('login');
      }));
  }
}
