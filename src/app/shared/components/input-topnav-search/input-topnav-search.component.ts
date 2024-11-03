import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { select, Store } from '@ngrx/store';
import { debounceTime, filter, map, shareReplay, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

import { searchOptions } from '../../mock/dashboard.mock';
import { environment } from 'src/environments/environment';
import { GenericBlockUI } from '../../generics/blockui-generic';
import { BlockUIService } from 'src/app/services/blockui.service';
import { ISearchOptions } from 'src/app/models/options.model';
import { getInitials } from '../../util/formatting';
import { AppState } from 'src/app/store';
import { clearSelectEmployeeAction, performSearchEmployeesAction, selectPeopleEmployeeByIdAction } from 'src/app/modules/employee/store/employee/employee.action';
import { PAGINATION_VARS } from '../../constants/generic.constant';
import { getSearchedEmployeesSelector } from 'src/app/modules/employee/store/employee/employee.selector';
import { LocalService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'kp-input-topnav-search',
  templateUrl: './input-topnav-search.component.html',
  styleUrls: ['./input-topnav-search.component.scss']
})
export class InputTopnavSearchComponent extends GenericBlockUI {
  @ViewChild("op") public op: OverlayPanel | undefined;

  public imgPath: string = environment.imgPath;
  public showBlockUIEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public options: ISearchOptions[] = searchOptions;
  public getInitials = getInitials;
  public searchText$ = new Subject();

  constructor(
    private store: Store<AppState>,
    private localService: LocalService,
    private router: Router,
    blockUIService: BlockUIService,
    elementRef: ElementRef,) {
    super(blockUIService, elementRef);
    this.searchText$
      .pipe(
        filter((keyword) => keyword !== ''),
        map((keyword: any) => keyword),
        debounceTime(350),
        takeUntil(this.$unsubscribe),
      ).subscribe((searchText: string) => {
        this.store.dispatch(performSearchEmployeesAction({
          payload: {
            active: true,
            sortBy: 'lastName',
            searchText,
            sortAscending: false,
            pageNumber: PAGINATION_VARS.pageNumber,
            pagesize: PAGINATION_VARS.pagesize
          }
        }))
      });
  }

  public getSearchedEmployeesAsync = () => this.store.pipe(select(getSearchedEmployeesSelector), shareReplay(1));

  public onFocus(event: any): void {
    this.op?.show(event);
  }

  public gotoEmployeeDetail(employeeId: number): void {
    this.localService.setItem('seId', JSON.stringify(employeeId));
    const encEmployeeId = this.localService.getEncItem('seId');
    console.log(encEmployeeId)
    if (encEmployeeId) {
      this.store.dispatch(clearSelectEmployeeAction());
      this.store.dispatch(selectPeopleEmployeeByIdAction({ id: Number(this.localService.getEncItem('seId')) }));
      this.router.navigateByUrl(`employee/detail/${encEmployeeId}`);
    }
  }

  public onInput(event: any): void {
    const value: string = event.target?.value;
    if (value?.trim()?.length > 2)
      this.searchText$.next(value);
  }

  public onBlur(event: any): void {
    setTimeout(() => {
      this.op?.hide();
      event.target.value = '';
    }, 100);
  }
}
