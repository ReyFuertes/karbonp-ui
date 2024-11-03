import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { SideBarService } from './services/sidebar.service';
import { combineLatest, filter, Observable, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Event, Router, RouterEvent } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AppState } from './store';
import { initAppAction, initSetTokenAction } from './store/app.action';
import { getLocationNavMenuSelector, isUserLoggedInSelector } from './store/app.selector';
import { GenericDestroy } from './shared/generics/generic-destroy-page';
import { LocalService } from './services/local-storage.service';
import { AppMenuConfigService } from './services/common.service';
import { AppDashboardType, AppMenuType, CountryIdType } from './models/generic.enum';
import { IApplication } from './modules/employee/employee.model';
import { getEmployeeApplicationsSelector } from './modules/employee/store/employee-apps/employee-apps.selector';
import { COMPANYSETTINGROUTE, DASHBOARDROUTE, SIGNUPROUTE } from './shared/constants/route.constant';
import { getEmployeeDynamicFieldsAction } from './modules/employee/store/employee/employee.action';
import { BlockUIService } from './services/blockui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends GenericDestroy implements AfterViewInit {
  public title: string = 'karbonpay-ui';
  public showSidebar: boolean = false;
  public svgPath: string = environment.svgPath;
  public imgPath: string = environment.imgPath;
  public isUserLoggedIn$: Observable<boolean>;
  public $isLoginFailed: Observable<boolean>;
  public sidebarMenuApps: IApplication[] = [];
  public logoNameExt: string = 'karbonpay-text-logo.png';
  public sidebarActiveMenu: AppMenuType;
  public topNavVisibility: boolean = true;
  public dashboardApp: IApplication;
  public isLoggedIn: boolean = false;
  public blockedPanel: boolean = false;

  constructor(
    public sideBarService: SideBarService,
    private store: Store<AppState>,
    private router: Router,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef,
    private localService: LocalService,
    private appMenuConfigSerive: AppMenuConfigService,
    private blockUIService: BlockUIService
  ) {
    super();
    this.configureReloadingToken();
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.sideBarService.getSidebarState()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(value => this.showSidebar = value);
    this.appMenuConfigSerive.getActiveApplication()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(applicationName => this.localService.setItem('applicationName',
        JSON.stringify(applicationName || AppDashboardType.Dashboard)));
    this.dashboardApp = {
      id: '', name: 'Dashboard', menuType: AppMenuType.Dashboard,
      options: { available: true, class: 'dashboard', icon: "speed", route: DASHBOARDROUTE }
    };
    this.blockUIService.getBlockUI()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(active => this.blockedPanel = active);
  }

  ngAfterViewInit(): void {
    this.isUserLoggedIn$ = this.store.pipe(select(isUserLoggedInSelector));
    this.isUserLoggedIn$
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        if (this.isLoggedIn)
          this.store.dispatch(initAppAction());
        else
          this.localService.clearItems();
      });
    this.router.events.pipe(
      filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent),
      takeUntil(this.$unsubscribe))
      .subscribe((e: RouterEvent) => {
        if (this.isLoggedIn) {
          this.localService.setItem('url', JSON.stringify(e.url));
          const excludedUrlsFroTopNav = [COMPANYSETTINGROUTE, SIGNUPROUTE];
          for (let index = 0; index <= excludedUrlsFroTopNav.length; index++) {
            if (excludedUrlsFroTopNav[index]?.includes(e?.url)) {
              this.topNavVisibility = false;
              return;
            }
            else
              this.topNavVisibility = true;
          }
        }
        this.cdRef.detectChanges();
      });
    combineLatest([
      this.store.pipe(select(getEmployeeApplicationsSelector)),
      this.sideBarService.getSidebarActiveMenu
    ]).pipe(
      takeUntil(this.$unsubscribe)
    ).subscribe(([applications, sidebarActiveMenu]) => {
      this.sidebarMenuApps = applications;
      this.sidebarActiveMenu = sidebarActiveMenu ?? AppMenuType.Dashboard;
      this.cdRef.detectChanges();
    });

    this.store.pipe(select(getLocationNavMenuSelector)).pipe(
      takeUntil(this.$unsubscribe)
    ).subscribe((locationNavMenu) => {
      const tokenDetails = this.localService.getEncItem('tokenDetails');
      if (locationNavMenu && tokenDetails) {
        //note: there is inconsistency here, token details sometimes returns LocationId or CurrentLocationId
        const currentLocationId: number = Number(JSON.parse(tokenDetails)?.CurrentLocationId);
        const locationId: number = Number(JSON.parse(tokenDetails)?.LocationId);
        const userLocationId = (locationId !== 0 ? locationId : 68) || currentLocationId || 68 //note: default to fingoHR
        const countryId: number = locationNavMenu?.data?.find(country => country?.navMenuViewModelItems?.find(item => {
          return item?.locationId === userLocationId
        }))?.countryId || CountryIdType.ZA; //default to ZA
        if (countryId && userLocationId) {
          this.store.dispatch(getEmployeeDynamicFieldsAction({ countryId, locationId: userLocationId }));
        }
      }
    });
  }

  public redirectTo(application: IApplication): void {
    const route = application.options?.route;
    if (['expenses', 'reports', ''].includes(route)) {
      alert('No route implemented');
      return;
    }
    this.router.navigateByUrl(`/${route}`);
  }

  private configureReloadingToken(): void {
    const token = localStorage.getItem('token');
    if (token)
      this.store.dispatch(initSetTokenAction({ token }));
    else
      this.store.dispatch(initSetTokenAction({ token: undefined }));
  }
}
