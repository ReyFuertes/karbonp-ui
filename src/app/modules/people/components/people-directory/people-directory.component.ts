import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject, combineLatest, debounceTime, filter, map, takeUntil } from 'rxjs';
import { Paginator } from 'primeng/paginator';
import { Router } from '@angular/router';

import { GenericDestroy } from 'src/app/shared/generics/generic-destroy-page';
import { IEmployeePaginationPayload, IPeopleStatus } from '../../people.model';
import { LocalService } from 'src/app/services/local-storage.service';
import { IEmployee } from 'src/app/modules/employee/employee.model';
import { getEmployeeTotalItemsSelector, isEmployeeLoadingSelector } from 'src/app/modules/employee/store/employee/employee.selector';
import { getEmployeesAction, selectPeopleEmployeeByIdAction } from 'src/app/modules/employee/store/employee/employee.action';
import { AppState } from 'src/app/store';
import { getInitials, toCssClass } from 'src/app/shared/util/formatting';
import { getPeopleStatusesSelector } from '../../store/people-status/people-status.selector';
import { getPeopleByStatusesIdsAction } from '../../store/people-status/people-status.action';
import { getPeopleEmployeesSelector, getFilteredPeopleSelector } from '../../store/people/people.selector';
import { PeopleDirectoryFilterComponent } from '../people-directory-filter/people-directory-filter.component';
import { EmploymentStatusType } from 'src/app/models/generic.enum';

@Component({
  selector: 'kp-people-directory',
  templateUrl: './people-directory.component.html',
  styleUrls: ['./people-directory.component.scss']
})
export class PeopleDirectoryComponent extends GenericDestroy implements OnInit {
  @Input() public peopleEmployeePayload: IEmployeePaginationPayload;
  @ViewChild('paginator', { static: false }) paginator: Paginator;
  @ViewChild('peopleDirectoryFilter', { static: true }) peopleDirectoryFilter: PeopleDirectoryFilterComponent;

  public getInitials = getInitials;
  public toCssClass = toCssClass;
  public notInvited = EmploymentStatusType.NotInvited;
  public pending = EmploymentStatusType.Pending;
  public peopleEmployees: IEmployee[] = [];
  public pageNumber: number = 1;
  public pagesize: number = 20;
  public showMenu: boolean = false;
  public hasNoSearchResults: boolean = false;
  public searchText$ = new Subject();
  public inpuSearchValue: string = '';
  public statuses: IPeopleStatus[];
  public filterStatusIds: number[] = [];
  public statusDictionaries = new Map<number, IPeopleStatus>();
  public employeeTotalItems: number = 0;

  constructor(private store: Store<AppState>, private router: Router, private localService: LocalService) {
    super();
    this.searchText$
      .pipe(
        filter((keyword) => keyword !== ''),
        map((keyword: any) => keyword),
        debounceTime(1000),
        takeUntil(this.$unsubscribe),
      ).subscribe((searchText: string) => this.paginateEmployees({
        page: 0,
        rows: this.pagesize
      }, searchText));
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPeopleEmployeesSelector)),
      this.store.pipe(select(getEmployeeTotalItemsSelector)),
      this.store.pipe(select(getPeopleStatusesSelector)),
      this.store.pipe(select(getFilteredPeopleSelector))
    ]).pipe(
      takeUntil(this.$unsubscribe),
    ).subscribe(([employees, employeeTotalItems, statuses, filteredPeople]) => {
      if (JSON.stringify(employees) !== JSON.stringify(this.peopleEmployees)) {
        this.peopleEmployees = this.filterStatusIds?.length > 0
          ? filteredPeople
          : employees;
      }
      this.employeeTotalItems = employeeTotalItems;
      this.statusDictionaries.clear();
      statuses.forEach(status => this.statusDictionaries.set(status.id, status));
      this.statuses = this.statusDictionaries.values()
        ? Array.from(this.statusDictionaries.values())
          .map(status => Object.assign({}, status, { name: status.name.toLowerCase() }))
        : [];
    });
  }

  public isLoadingAsync = () => this.store.pipe(select(isEmployeeLoadingSelector));

  public handleAllFilterChange(isSelectAll: boolean): void {
    if (isSelectAll) {
      this.filterStatusIds = this.statuses?.map(status => status.id);
      this.store.dispatch(getPeopleByStatusesIdsAction({ ids: this.filterStatusIds }));
    }
    else {
      this.filterStatusIds = [];
      this.ngOnInit();
    }
  }

  public handleFilterStatusChange(ids: number[]): void {
    if (ids?.length !== this.statuses?.length)
      this.peopleDirectoryFilter.isStatusSelectAll = false;
    else
      this.peopleDirectoryFilter.isStatusSelectAll = true;
    this.filterStatusIds = ids;
    if (this.filterStatusIds?.length > 0)
      this.store.dispatch(getPeopleByStatusesIdsAction({ ids: this.filterStatusIds }));
    else {
      this.filterStatusIds = [];
      this.ngOnInit();
    }
  }

  public getEmployeeDetail(employee: IEmployee): void {
    this.localService.setItem('seId', JSON.stringify(employee?.id));
    const encEmployeeId = this.localService.getItem('seId');
    if (encEmployeeId) {
      this.store.dispatch(selectPeopleEmployeeByIdAction({ id: Number(this.localService.getEncItem('seId')) }));
      this.router.navigateByUrl(`employee/detail/${encEmployeeId}`);
    }
  }

  public onAddEmployee(): void {
    this.router.navigateByUrl('employee/menu');
  }

  public paginateEmployees(event: any, searchText: string = ''): void {
    this.peopleEmployees = [];
    this.store.dispatch(getEmployeesAction({
      payload: Object.assign({}, this.peopleEmployeePayload, {
        pageNumber: event?.page + 1,
        pagesize: event?.rows,
        searchText
      })
    }));
  }

  public onRefresh = () => {
    this.showMenu = false;
    this.inpuSearchValue = '';
    this.peopleEmployees = [];
    this.searchText$.next(this.inpuSearchValue);
    this.paginateEmployees({ pageNumber: 0, rows: this.pagesize }, '');
  }

  public isActive(employee: IEmployee): boolean {
    return employee.active === true;
  }

  public onShowMenu(): void {
    this.showMenu = !this.showMenu;
  }

  public handleInputChange(event: any): void {
    if (event.length > 2) {
      this.inpuSearchValue = event;
      this.searchText$.next(this.inpuSearchValue);
    }
    if (event.length === 0)
      this.onRefresh();
  }
}
