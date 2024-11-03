import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest, skipWhile, takeUntil } from 'rxjs';

import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { getInitials } from 'src/app/shared/util/formatting';
import { AppState } from 'src/app/store';
import { LocalService } from 'src/app/services/local-storage.service';
import { IEmployee } from '../../../employee/employee.model';
import { clearSelectEmployeeAction, getEmployeesAction, selectPeopleEmployeeByIdAction } from '../../../employee/store/employee/employee.action';
import { getEmployeesSelector, getEmployeeTotalItemsSelector, isEmployeeLoadingSelector } from '../../../employee/store/employee/employee.selector';

@Component({
  selector: 'kp-dashboard-people',
  templateUrl: './dashboard-people.component.html',
  styleUrls: ['./dashboard-people.component.scss']
})
export class DashboardPeopleComponent extends GenericDestroy implements AfterViewInit {
  public peopleEmployees: IEmployee[] = [];
  public employeeTotalItems: number = 0;
  public getInitials = getInitials;
  public pageNumber: number = 1;
  public pagesize: number = 20;

  constructor(private store: Store<AppState>,
    private router: Router,
    private localService: LocalService) {
    super();
    this.store.dispatch(getEmployeesAction({
      payload: {
        sortBy: "LastName",
        sortAscending: true,
        pageNumber: 1,
        pagesize: 20 //note: we need to set this in the settings at some point
      }
    }));
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.store.pipe(select(getEmployeesSelector)),
      this.store.pipe(select(getEmployeeTotalItemsSelector)),
    ]).pipe(
      skipWhile((result, index) => index === 0 && result[0].length === 0),
      takeUntil(this.$unsubscribe)
    ).subscribe(([employees, employeeTotalItems]) => {
      this.peopleEmployees = employees;
      this.employeeTotalItems = employeeTotalItems;
    });
  }

  public isLoadingAsync = () => this.store.pipe(select(isEmployeeLoadingSelector));

  public getEmployeeDetail(employee: IEmployee): void {
    this.localService.setItem('seId', JSON.stringify(employee?.id));
    const encEmployeeId = this.localService.getItem('seId');
    if (encEmployeeId) {
      this.store.dispatch(clearSelectEmployeeAction());
      this.store.dispatch(selectPeopleEmployeeByIdAction({ id: Number(this.localService.getEncItem('seId')) }));
      this.router.navigateByUrl(`employee/detail/${encEmployeeId}`);
    }
  }

  public redirectTo(route: string): void {
    if (route === '/') {
      alert('No route implemented');
      return;
    }
    this.router.navigateByUrl(route);
  }

  public gotoEmployeeMenu(): void {
    this.router.navigateByUrl('/employee/menu');
  }
}
