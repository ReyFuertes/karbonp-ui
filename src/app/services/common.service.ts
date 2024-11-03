
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { IApplication } from '../modules/employee/employee.model';

@Injectable({ providedIn: 'root' })
export class BlockUIService {
  private $activeApplication: BehaviorSubject<IApplication> = new BehaviorSubject(undefined);
  private $redirectMenuState: BehaviorSubject<string> = new BehaviorSubject('');

  public getActiveApplication(): Observable<IApplication> {
    return this.$activeApplication.asObservable();
  }

  public setActiveApplication(application: IApplication) {
    this.$activeApplication.next(application);
  }

  public getRedirectMenuState(): Observable<string> {
    return this.$redirectMenuState.asObservable();
  }

  public setRedirectMenuState(value: string) {
    this.$redirectMenuState.next(value);
  }
}
@Injectable({ providedIn: 'root' })
export class PayRunService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'PayRun');
  }
}
@Injectable({ providedIn: 'root' })
export class TaxService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'tax');
  }
}
@Injectable({ providedIn: 'root' })
export class CurrencyService {
  public currencyChangeEmmitter = new EventEmitter<string>();
  public currentCurrency: string = '';

  constructor() { }

  public use(currency: string): void {
    this.currentCurrency = currency;
    this.currencyChangeEmmitter.emit(currency);
  }
}
@Injectable({ providedIn: 'root' })
export class CommonService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, '');
  }
}
@Injectable({ providedIn: 'root' })
export class AppMenuConfigService {
  private $activeApplication: BehaviorSubject<IApplication> = new BehaviorSubject(undefined);
  private $redirectMenuState: BehaviorSubject<string> = new BehaviorSubject('');

  public getActiveApplication(): Observable<IApplication> {
    return this.$activeApplication.asObservable();
  }

  public setActiveApplication(application: IApplication) {
    this.$activeApplication.next(application);
  }

  public getRedirectMenuState(): Observable<string> {
    return this.$redirectMenuState.asObservable();
  }

  public setRedirectMenuState(value: string) {
    this.$redirectMenuState.next(value);
  }
}