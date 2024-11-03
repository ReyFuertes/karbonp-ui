import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LOGINROUTE } from '../../constants/route.constant';

@Component({
  selector: 'kp-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  constructor(private router: Router) { }

  public toLoginRoute(): void {
    this.router.navigateByUrl(LOGINROUTE);
  }
}
