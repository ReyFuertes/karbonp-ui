import { Component, Injector, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IEmployeePaginationPayload } from '../../people.model';
import { IOptionItem } from 'src/app/models/generic.model';
import { clearEmployeesEntitiesAction, getEmployeesAction } from 'src/app/modules/employee/store/employee/employee.action';
import { AppState } from 'src/app/store';
import { GenericMenuPage } from 'src/app/shared/generics/page-menu.generic';
import { AppMenuType } from 'src/app/models/generic.enum';

@Component({
  selector: 'kp-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.scss']
})
export class PeoplePageComponent extends GenericMenuPage implements OnInit {
  public menus: IOptionItem[] = [{
    label: 'Directory',
    value: 'directory'
  }, {
    label: 'Teams',
    value: 'teams'
  }];
  public peopleEmployeePayload: IEmployeePaginationPayload = {
    selfServiceEnabled: null,
    sortBy: "LastName",
    searchText: '',
    sortAscending: true,
    pageNumber: 1,
    pagesize: 20
  };

  constructor(injector: Injector, private store: Store<AppState>) {
    super(injector);
    this.setActiveMenu(AppMenuType.People);
    const employeeDetailSelectedMenu = localStorage.getItem('peopleSelectedMenu');
    if (employeeDetailSelectedMenu)
      this.activeMenuOption = employeeDetailSelectedMenu;
    else
      this.activeMenuOption = 'directory';
    this.store.dispatch(clearEmployeesEntitiesAction());
  }

  ngOnInit(): void {
    this.store.dispatch(getEmployeesAction({ payload: this.peopleEmployeePayload }));
  }

  public gotoMenu(selectedMenu: any): void {
    this.activeMenuOption = selectedMenu.value;
    localStorage.setItem('peopleSelectedMenu', this.activeMenuOption);
  }

  public getCurrentMenu(menuItem: IOptionItem): boolean {
    return menuItem.value === this.activeMenuOption;
  }
}
