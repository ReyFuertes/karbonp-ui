import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

import { logoutAction } from 'src/app/modules/auth/store/auth.action';
import { SideBarService } from 'src/app/services/sidebar.service';
import { AppState } from 'src/app/store';
import { getLocationNavMenuSelector } from 'src/app/store/app.selector';
import { environment } from 'src/environments/environment';
import { GenericDestroy } from '../../generics/generic-destroy-page';
import { getInitials } from '../../util/formatting';
import { LocalService } from 'src/app/services/local-storage.service';
import { DASHBOARDROUTE } from '../../constants/route.constant';
import { updateTokenWithLocationAction } from 'src/app/store/app.action';
import { IOptionItem } from 'src/app/models/generic.model';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { TranslateService } from '@ngx-translate/core';
import { CURRENT_PAYRUN_PAGE_KEY } from '../../constants/payroll.constant';
import { TIMEOFF_PAGE_KEY } from '../../constants/time-off.constant';

@Component({
  selector: 'kp-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class TopNavComponent extends GenericDestroy implements OnInit {
  public svgPath: string = environment.svgPath;
  public imgPath: string = environment.imgPath;
  public rotatedDirection: boolean = false;
  public companyOptions: any[] = [];
  public logoNameExt: string = 'karbonpay-logo.png';
  public getInitials = getInitials;
  public userInitials: string = 'NA';
  public firstName: string = 'FN';
  public trialStartDate: Date;
  public trialEndDate: Date;
  public daysToExpire: number;
  public selectedCompanyLocation: string;
  public topNavTranslateParam: { [key: string]: string };

  constructor(
    private store: Store<AppState>,
    public sideBarService: SideBarService,
    private elementRef: ElementRef,
    private router: Router,
    private localService: LocalService,
    private messageService: MessageService,
    private translateService: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    const uniqueName = this.localService.getEncItem('uniqueName');
    if (uniqueName) {
      this.userInitials = this.getInitials(JSON.parse(uniqueName));
      this.firstName = JSON.parse(uniqueName)?.split(' ')[0] || '';
    }
    this.store.pipe(select(getLocationNavMenuSelector),
      takeUntil(this.$unsubscribe)
    ).subscribe(locationNavMenu => {
      this.companyOptions = locationNavMenu?.data
        .map(value => {
          return {
            label: value.countryName,
            value: `${value.countryFlagPath}`,
            items: value.navMenuViewModelItems.map(item => Object.assign({}, {
              id: item.locationId,
              label: item.dropDownSelectionText,
              value: item.dropDownSelectionText,
              name: item.companyName
            }))
          }
        });

      const selectedCompanyLocation = this.localService.getEncItem('selectedCompanyLocation');
      if (selectedCompanyLocation)
        this.selectedCompanyLocation = JSON.parse(this.localService.getEncItem('selectedCompanyLocation'));
      else {
        const locationId = this.localService.getEncItem('locationId');
        if (locationId)
          this.getSelectedCompanyLocation(locationId);
      }
    })
    this.setCompanyName();
  }

  private setCompanyName(): void {
    this.topNavTranslateParam = {
      CompanyName: this.localService.getEncItem('companyName')
        ? JSON.parse(this.localService.getEncItem('companyName'))
        : 'YourCompanyName'
    };
  }

  private getSelectedCompanyLocation(locationId: string): void {
    this.companyOptions?.forEach(location => {
      location.items.forEach((company: IOptionItem) => {
        if (company.id === Number(locationId)) {
          this.selectedCompanyLocation = company.label;
          this.localService.setItem('selectedCompanyLocation', JSON.stringify(this.selectedCompanyLocation));
          this.localService.setItem('companyName', JSON.stringify(company?.name));
          this.setCompanyName();
          return;
        }
      });
    });
  }

  public handleOnchange(selectionlabel: string): void {
    if (selectionlabel) {
      this.companyOptions.forEach((location) => {
        location.items.forEach((company: IOptionItem) => {
          if (company.label.trim() === selectionlabel.trim()) {
            const locationId = company.id.toString();
            this.localService.setItem('locationId', JSON.stringify(this.selectedCompanyLocation));
            this.store.dispatch(updateTokenWithLocationAction({ locationId }));
            this.getSelectedCompanyLocation(locationId);
            this.setCompanyName();
            setTimeout(() => this.messageService.add({ severity: 'success', summary: this.translateService.instant('ChangedCompanySuccessful') }), 1500);
            setTimeout(() => this.router.navigateByUrl('/dashboard'), 2500);
            return;
          }
        });
      });
      //note: remove pressistent localstorage variables from here
      localStorage.removeItem(CURRENT_PAYRUN_PAGE_KEY);
      localStorage.removeItem('employeeDetailSelectedMenu');
      localStorage.removeItem('payrollPayrunsSelectedTab');
      localStorage.removeItem('payrollSettingsSelectedTab');
      localStorage.removeItem('peopleSelectedMenu');
      localStorage.removeItem(TIMEOFF_PAGE_KEY);
    }
  }

  public onRoute(route: string): void {
    this.router.navigateByUrl(route);
  }

  public onLogout(): void {
    this.store.dispatch(logoutAction());
  }

  public gotoDashboard(): void {
    this.router.navigateByUrl(DASHBOARDROUTE);
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: PointerEvent) {
    const nativeElement: any = this.elementRef.nativeElement;
    const clickedInside: boolean = nativeElement.contains(event.target);
    if (clickedInside === false)
      this.rotatedDirection = false;
  }
}
