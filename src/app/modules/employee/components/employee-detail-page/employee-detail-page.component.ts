import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, shareReplay, switchMap, takeUntil } from 'rxjs';
import * as moment from 'moment';

import { IOptionItem } from 'src/app/models/generic.model';
import { LocalService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { IPeopleEmployee } from '../../../people/people.model';
import { AppState } from 'src/app/store';
import { getOrganizationalUnitsSelector, getPayPeriodsSelector, getPayPointsSelector, getPaymentMethodsSelector } from 'src/app/store/app.selector';
import { calculateEmployeeDailyWageAction, getDocumentsNotesAction, getEmployeeByIdAction, selectPeopleEmployeeByIdAction } from '../../store/employee/employee.action';
import { IEmployee } from '../../employee.model';
import { getPeopleEmployeeClassificationSelector, getSelectedEmployeeSelector } from '../../store/employee/employee.selector';
import { getEmployeeLatestTimeBalanceAction, getEmployeeTimeOffActivitiesAction, getEmployeeTimeOffAdjustmentsAction, getEmployeeTimeOffBookingsAction, getEmployeeTimeOffPolicyAction, getEmployeeTimeOffTakeOnsAction, setEmployeeTimeOffLoadingAction } from '../../store/time-off/time-off.action';
import { EMPLOYEE_MENUS } from 'src/app/shared/constants/employee.constant';
import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';
import { AppMenuType } from 'src/app/models/generic.enum';
import { getPeopleStatusByIdSelector } from 'src/app/modules/people/store/people-status/people-status.selector';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kp-employee-page',
  templateUrl: './employee-detail-page.component.html',
  styleUrls: ['./employee-detail-page.component.scss']
})
export class EmployeeDetailPageComponent extends GenericMenuPage implements OnInit {
  public avatarPath: string = '';
  public imgPath: string = environment.imgPath;
  public form: FormGroup;
  public menus: IOptionItem[] = EMPLOYEE_MENUS;
  public employeeId: string = '';
  public employee$: Observable<IEmployee>;
  public peopleEmployee: IPeopleEmployee = undefined;

  constructor(
    injector: Injector,
    private store: Store<AppState>,
    private localService: LocalService,
    private route: ActivatedRoute,
    public fb: FormBuilder) {
    super(injector);
    this.setActiveMenu(AppMenuType.Dashboard);
    this.route.paramMap
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe(() => {
        const id = Number(this.localService.getEncItem('seId'));
        if (id) {
          this.store.dispatch(setEmployeeTimeOffLoadingAction({ loading: true }));
          this.store.dispatch(getEmployeeByIdAction({ id: Number(id) }));
          this.store.dispatch(getDocumentsNotesAction({
            payload: {
              categoryId: null,
              employeeId: id.toString(),
              pageNumber: 1,
              pagesize: 100,
              sortAscending: false,
              sortBy: "AddedDateTime"
            }
          }));
          this.store.dispatch(getEmployeeLatestTimeBalanceAction({
            payload: { employeeId: id }
          }));
          this.store.dispatch(getEmployeeTimeOffBookingsAction({
            payload: { employeeId: id, fromDate: moment(new Date()).format('DD/MM/yyyy'), toDate: moment(new Date()).format('DD/MM/yyyy') }
          }));
          this.store.dispatch(getEmployeeTimeOffAdjustmentsAction({ id }));
          this.store.dispatch(getEmployeeTimeOffPolicyAction({ id }));
          this.store.dispatch(getEmployeeTimeOffTakeOnsAction({ id }));
          this.store.dispatch(getEmployeeTimeOffActivitiesAction({ id }));
        }
      })
    this.loadEmployeeById();
    const employeeDetailSelectedMenu = localStorage.getItem('employeeDetailSelectedMenu');
    if (employeeDetailSelectedMenu)
      this.activeMenuOption = employeeDetailSelectedMenu;
    else
      this.activeMenuOption = 'personal_info';
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getSelectedEmployeeSelector)),
      this.store.pipe(select(getPayPeriodsSelector)),
      this.store.pipe(select(getPaymentMethodsSelector)),
      this.store.pipe(select(getPayPointsSelector)),
      this.store.pipe(select(getOrganizationalUnitsSelector)),
      this.store.pipe(select(getPeopleEmployeeClassificationSelector)),
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([employee, payPeriods, paymentMethods, payPoints, organizationalUnits, designation]) => {
        this.peopleEmployee = {
          employee,
          payPeriods,
          paymentMethods,
          payPoints,
          organizationalUnits,
          designation
        };
        this.store.dispatch(selectPeopleEmployeeByIdAction({ id: employee?.id }));//note: whats this?
        if (designation) {
          this.store.dispatch(calculateEmployeeDailyWageAction({
            payload: {
              employeeId: designation?.employeeId,
              paymentAmount: designation?.paymentAmount,
              paymentType: designation?.paymentType
            }
          }));
        }
      });
  }

  public getEmployeeStatus = this.store.pipe(select(getSelectedEmployeeSelector))
    .pipe(switchMap((employee) => this.store.pipe(select(getPeopleStatusByIdSelector(employee?.peopleStatus)))),
      shareReplay(1));

  public handleOnSavedFormChanges(event: boolean): void {
    if (event === true)
      this.loadEmployeeById();
  }

  public gotoMenu(selectedMenu: any): void {
    this.activeMenuOption = selectedMenu.value;
    localStorage.setItem('employeeDetailSelectedMenu', this.activeMenuOption);
  }

  public isFormDetailsValid(formName: IOptionItem): boolean | undefined {
    return this.form.get(formName.value || '')?.valid && !this.getCurrentMenu(formName);
  }

  public getCurrentMenu(menuItem: IOptionItem): boolean {
    return menuItem.value === this.activeMenuOption;
  }

  private loadEmployeeById(): void {

  }
}
