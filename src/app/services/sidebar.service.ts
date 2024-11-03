import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { AppMenuType } from "../models/generic.enum";

@Injectable()
export class SideBarService {
  private $sidebarState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private $sidebarActiveMenu: BehaviorSubject<AppMenuType> = new BehaviorSubject(null);

  public getSidebarState(): Observable<boolean> {
    return this.$sidebarState.asObservable();
  }

  public setSidebarState(value: boolean) {
    this.$sidebarState.next(value);
  }
  
  public get getSidebarActiveMenu(): Observable<AppMenuType> {
    return this.$sidebarActiveMenu.asObservable();
  }

  public setSidebarActiveMenu(value: AppMenuType) {
    this.$sidebarActiveMenu.next(value);
  }
}