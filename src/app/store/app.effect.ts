import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, debounceTime, filter, map, of, switchMap, tap } from "rxjs";
import { Store, select } from "@ngrx/store";
import { JwtHelperService } from '@auth0/angular-jwt';

import { getCountriesAction, getCountriesSuccessAction, getOrganizationalUnitsAction, getOrganizationalUnitsSuccessAction, getPayPointsAction, getPayPointsSuccessAction, getPaymentMethodAction, getPaymentMethodSuccessAction, initAppAction, initAppSuccessAction, loginFailedAction, getMenuLocationsAction, getMenuLocationsSuccessAction, getAvailableExchangeRatesAction, getAvailableExchangeRatesSuccessAction, getEmployeeShiftsAction, getEmployeeShiftsSuccessAction, getPassportCountryCodesAction, getPassportCountryCodesSuccessAction, getLeaveSetupLocationAction, getLeaveSetupLocationSuccessAction, getLeaveTimeOffSetupsPoliciesAction, getLeaveTimeOffSetupsPoliciesSuccessAction, getPayPointsForCurrentUserAction, getPayPointsForCurrentUserSuccessAction, updateTokenWithLocationAction, updateTokenWithLocationSuccessAction, initSetTokenAction, getTodoListWidgetDataAction, getTodoListWidgetDataSuccessAction, getMultiSelectEmployeesAction, getMultiSelectEmployeesSuccessAction, getPayPeriodsAction, getPayPeriodsSuccessAction, getLeaveSetupsAction, getLeaveSetupsSuccessAction, getLoggedInUserAction, getLoggedInUserSuccessAction } from "./app.action";
import { ICommonResponse, ICountry, ILeaveSetup, ILocationNavMenu, IMultiSelectEmployee, IOrganizationalUnit, IPassportCountryCodes, IPaymentMethod, IPayPeriod, IPaypoint, ITokenDetails, IUser } from "../models/generic.model";
import { AuthService } from "../modules/auth/auth.service";
import { AppState } from ".";
import { CommonService } from "../services/common.service";
import { IEmployeeShift } from "../modules/employee/employee.model";
import { getTokenSelector } from "./app.selector";
import { getEmployeeAppsAction } from "../modules/employee/store/employee-apps/employee-apps.action";
import { getPeopleStatusesAction } from "../modules/people/store/people-status/people-status.action";
import { LocalService } from "../services/local-storage.service";
import { GenericEffect } from "../shared/generics/notification.generic";
import { clearEmployeesEntitiesAction, getEmployeesAction } from "../modules/employee/store/employee/employee.action";
import { SignalRService } from "../services/signalr.service";
import { ITodoListWidgetData } from "../models/dashboard.model";
import { EmployeeService } from "../modules/employee/employee.service";
import { LeaveSetupService } from "../modules/payroll/payroll.service";

@Injectable()
export class InitAppEffect extends GenericEffect {
  public getLoggedInUserAction$ = createEffect(() => this.actions$.pipe(
    ofType(getLoggedInUserAction),
    switchMap(() => this.authService.get('/user/getLoggedInUser')
      .pipe(
        map((response: IUser) => {
          return getLoggedInUserSuccessAction({ response });
        })
      ))
  ));

  public getLeaveSetupsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getLeaveSetupsAction),
    switchMap(({ payload }) => this.leaveSetupService.postObservePagination(payload, '/GetLeaveSetups')
      .pipe(
        map((response) => this.getPagination(response)),
        map((response) => {
          return getLeaveSetupsSuccessAction({ response });
        })
      ))
  ));

  public getMultiSelectEmployeesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getMultiSelectEmployeesAction),
    switchMap(() => this.employeeService.post({}, '/GetMultiselectEmployees')
      .pipe(
        map((response: IMultiSelectEmployee[]) => {
          return getMultiSelectEmployeesSuccessAction({ response });
        })
      ))
  ));

  public getTodoListWidgetDataAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTodoListWidgetDataAction),
    switchMap(() => this.commonService.get('HomeDashboard/GetToDoListWidgetData')
      .pipe(
        map((response: ITodoListWidgetData) => {
          return getTodoListWidgetDataSuccessAction({ response });
        })
      ))
  ));

  public updateTokenWithLocationAction$ = createEffect(() => this.actions$.pipe(
    ofType(updateTokenWithLocationAction),
    switchMap(({ locationId }) => {
      return this.authService.get(`/auth/UpdateTokenWithLocation/${locationId}`)
    })).pipe(
      filter(response => !!response),
      tap((response) => {
        const token = response.token;
        if (token) {
          const tokenDetails: ITokenDetails = this.jwtHelperService.decodeToken(token);
          if (tokenDetails?.CurrentLocationId)
            this.localService.setItem('locationId', JSON.stringify(tokenDetails.CurrentLocationId));
          if (tokenDetails.unique_name)
            this.localService.setItem('uniqueName', JSON.stringify(tokenDetails.unique_name));
          this.store.dispatch(initSetTokenAction({ token }));
          localStorage.setItem('token', token);
          this.localService.setItem('tokenDetails', JSON.stringify(tokenDetails));
        }
        else
          this.getNotificationMessage({ errors: [{}], message: 'Token invalid' })
      }),
      map((response: ICommonResponse) => {
        return updateTokenWithLocationSuccessAction({ response });
      })
    ))

  public getPayPointsForCurrentUserAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayPointsForCurrentUserAction),
    switchMap(() => this.commonService.get('paypoint/GetPayPointsForCurrentUser')
      .pipe(
        map((response: IPaypoint[]) => {
          return getPayPointsForCurrentUserSuccessAction({ response });
        })
      ))
  ));

  public getLeaveTimeOffSetupsPoliciesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getLeaveTimeOffSetupsPoliciesAction),
    switchMap(() => this.leaveSetupService.get(`/GetTimeOffSetupsWithPolicies`)
      .pipe(
        map((response: ILeaveSetup[]) => getLeaveTimeOffSetupsPoliciesSuccessAction({ response }))
      ))
  ));

  public getLeaveSetupLocationAction$ = createEffect(() => this.actions$.pipe(
    ofType(getLeaveSetupLocationAction),
    switchMap(() => this.leaveSetupService.get('/GetLeaveSetupsForCurrentLocation')
      .pipe(
        map((response: ILeaveSetup[]) => {
          return getLeaveSetupLocationSuccessAction({ response });
        })
      ))
  ));

  public getPassportCountryCodesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPassportCountryCodesAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'passportcountrycode/GetPassportCountryCodes')
      .pipe(
        map((passportCountryCodes: IPassportCountryCodes[]) => {
          return getPassportCountryCodesSuccessAction({ passportCountryCodes });
        })
      ))
  ));

  public getEmployeeShiftsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getEmployeeShiftsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'Shift/GetShifts')
      .pipe(
        map((employeeShifts: IEmployeeShift[]) => {
          return getEmployeeShiftsSuccessAction({ employeeShifts });
        })
      ))
  ));

  public getAvailableExchangeRatesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getAvailableExchangeRatesAction),
    switchMap(() => this.commonService.get('auth/ExchangeRate/GetAvailableExchangeRates')
      .pipe(
        map((availableExchangeRatesResponse: ICommonResponse) => {
          return getAvailableExchangeRatesSuccessAction({ availableExchangeRatesResponse });
        })
      ))
  ));

  public getMenuLocationsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getMenuLocationsAction),
    switchMap(() => this.commonService.get('auth/Location/GetLocationsForNavMenu')
      .pipe(
        map((locationNavMenu: ILocationNavMenu) => {
          return getMenuLocationsSuccessAction({ locationNavMenu });
        })
      ))
  ));
  //note: we need to refactor this, since this exist in payroll-settings-pay-period
  public getPayPeriodAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayPeriodsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'PayFrequency/GetPayFrequencies')
      .pipe(
        map((response: IPayPeriod[]) => {
          return getPayPeriodsSuccessAction({ response });
        })
      ))
  ));

  public getPayPointsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPayPointsAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'paypoint/GetPayPoints')
      .pipe(
        map((payPoints: IPaypoint[]) => {
          return getPayPointsSuccessAction({ payPoints });
        })
      ))
  ));

  public getPaymentMethodAction$ = createEffect(() => this.actions$.pipe(
    ofType(getPaymentMethodAction),
    switchMap(({ payload }) => this.commonService.post(payload, 'paymentmethod/GetPaymentMethods')
      .pipe(
        map((paymentMethods: IPaymentMethod[]) => {
          return getPaymentMethodSuccessAction({ paymentMethods });
        })
      ))
  ));

  public getOrganizationalUnitsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getOrganizationalUnitsAction),
    switchMap(() => this.commonService.get('organizationalUnits/GetAllOrganizationalUnits')
      .pipe(
        map((organizationalUnits: IOrganizationalUnit[]) => {
          return getOrganizationalUnitsSuccessAction({ organizationalUnits });
        })
      ))
  ));

  public getCountriesAction$ = createEffect(() => this.actions$.pipe(
    ofType(getCountriesAction),
    switchMap(() => this.authService.get('/country/getcountries')
      .pipe(
        map((countries: ICountry[]) => {
          return getCountriesSuccessAction({ countries });
        })
      ))
  ));

  public initAppAction$ = createEffect(() => this.actions$.pipe(
    ofType(initAppAction),
    switchMap(() => this.store.pipe(select(getTokenSelector)).pipe(
      filter((token) => !!token),
      debounceTime(300),
      map((token: string) => {
        if (token) {
          this.store.dispatch(getMenuLocationsAction());
          const payload = { active: true, sortBy: "Name", sortAscending: true };
          this.store.dispatch(getPaymentMethodAction({ payload }));
          this.store.dispatch(getPayPointsAction({ payload }));
          this.store.dispatch(getPayPointsForCurrentUserAction());
          this.store.dispatch(getOrganizationalUnitsAction());
          this.store.dispatch(getAvailableExchangeRatesAction());
          this.store.dispatch(getEmployeeShiftsAction({ payload: { active: true, excludeNightShift: true, implementSortingAndPaging: false, sortBy: "Name" } }));
          this.store.dispatch(getPassportCountryCodesAction({ payload: { active: true, implementSortingAndPaging: false } }));
          this.store.dispatch(getLeaveSetupLocationAction());
          this.store.dispatch(getCountriesAction());
          this.store.dispatch(getLeaveTimeOffSetupsPoliciesAction());
          this.store.dispatch(getEmployeeAppsAction({ payload: null }));
          this.store.dispatch(getPeopleStatusesAction());
          this.store.dispatch(clearEmployeesEntitiesAction());
          this.store.dispatch(getEmployeesAction({ payload: { sortBy: "LastName", sortAscending: true, pageNumber: 1, pagesize: 20 } })); //note: we need to set this in the settings at some point
          const tokenDetails = this.localService.getEncItem('tokenDetails');
          if (tokenDetails)
            this.signalRService.startConnection(Number(JSON.parse(tokenDetails).nameid));
          this.store.dispatch(getTodoListWidgetDataAction());
          this.store.dispatch(getMultiSelectEmployeesAction());
          this.store.dispatch(getLeaveSetupsAction({ payload: { implementSortingAndPaging: false } })); //note: looks like true fails
        }
        return initAppSuccessAction({ token });
      }),
      catchError((error: any) => {
        return of(loginFailedAction({ error: error.title }));
      })
    ))
  ));

  constructor(
    injector: Injector,
    private store: Store<AppState>,
    private actions$: Actions,
    private authService: AuthService,
    private jwtHelperService: JwtHelperService,
    private localService: LocalService,
    private commonService: CommonService,
    private signalRService: SignalRService,
    private leaveSetupService: LeaveSetupService,
    private employeeService: EmployeeService) {
    super(injector);
  }
}