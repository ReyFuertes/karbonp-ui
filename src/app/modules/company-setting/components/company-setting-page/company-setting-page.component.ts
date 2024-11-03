import { Component, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs';

import { logoutAction } from 'src/app/modules/auth/store/auth.action';
import { LocalService } from 'src/app/services/local-storage.service';
import { SIGNUPROUTE } from 'src/app/shared/constants/route.constant';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { getInitials } from 'src/app/shared/util/formatting';
import { AppState } from 'src/app/store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kp-company-setting-page',
  templateUrl: './company-setting-page.component.html',
  styleUrls: ['./company-setting-page.component.scss']
})
export class CompanySettingPageComponent extends GenericFormControls {
  public svgPath: string = environment.svgPath;
  public imgPath: string = environment.imgPath;
  public isLoading: boolean = false;
  public selectedTabIndex: number = 0;
  public rotatedDirection: boolean = false;
  public getInitials = getInitials;
  public userInitials: string = 'NA';
  public firstName: string = 'FN';
  public showUpgradeDialogModal: boolean = false;
  public showRedeemCouponDialogModal: boolean = false;
  public isCompanyDetail: boolean = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private elementRef: ElementRef,
    private localService: LocalService) {
    super();
    this.userInitials = this.getInitials(JSON.parse(this.localService.getEncItem('uniqueName')));
    this.firstName = JSON.parse(this.localService.getEncItem('uniqueName'))?.split(' ')[0] || '';
    this.form = this.fb.group({
      companyName: new FormControl('test-company', Validators.required),
      country: new FormControl(undefined, Validators.required),
      timeZone: new FormControl(undefined, Validators.required),
      plan: new FormControl('free', Validators.required),
      company: this.fb.group({}),
    });
    this.form.get('plan').valueChanges
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(value => {
        if (value === 'advanced') {
          this.showUpgradeDialogModal = true;
        }
      })
  }

  public handleTabChange(event: any): void {
    localStorage.setItem('selectedTabAccountSetting', event.index)
  }

  public onSetupCompany(): void {
    this.onLogout();
    this.router.navigateByUrl(SIGNUPROUTE);
  }

  public onLogout(): void {
    this.store.dispatch(logoutAction());
  }

  public onRoute(route: string): void {
    this.router.navigateByUrl(route);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: PointerEvent) {
    const nativeElement: any = this.elementRef.nativeElement;
    const clickedInside: boolean = nativeElement.contains(event.target);
    if (clickedInside === false)
      this.rotatedDirection = false;
  }
}
