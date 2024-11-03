import { Injectable, Injector } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { combineLatest, map, of, switchMap, tap } from "rxjs";

import { GenericEffect } from "src/app/shared/generics/notification.generic";
import { FilingDetailsSetupService, StandardIndustrialClassificationService, TradeclassificationgroupService, TradeclassificationsService } from "../../payroll.service";
import { IStandardIndustrialClassificationLevel } from "../../payroll.model";
import { getFilingdetailsSetupAction, getFilingdetailsSetupSuccessAction, getTradeClassificationGroupsAction, getTradeClassificationGroupsSuccessAction, getTradeClassificationsAction, getTradeClassificationsSuccessAction, saveFilingdetailsSetupAction, saveFilingdetailsSetupSuccessAction } from "./payroll-filing-details.action";
import { ICommonResponse } from "src/app/models/generic.model";


@Injectable()
export class PayrollFilingDetailEffect extends GenericEffect {
  saveFilingdetailsSetupAction$ = createEffect(() => this.actions$.pipe(
    ofType(saveFilingdetailsSetupAction),
    switchMap(({ payload }) => this.filingdetailSetupService.post(payload)
      .pipe(
        tap((response) => this.getNotificationMessage(response || {})),
        map((response: ICommonResponse) => saveFilingdetailsSetupSuccessAction({ response }))
      ))
  ));

  getTradeClassificationsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTradeClassificationsAction),
    switchMap(({ payload }) => this.tradeclassificationsService.post(payload, '/GetTradeClassifications')
      .pipe(
        map((response: IStandardIndustrialClassificationLevel[]) => getTradeClassificationsSuccessAction({ response }))
      ))
  ));

  getTradeClassificationGroupsAction$ = createEffect(() => this.actions$.pipe(
    ofType(getTradeClassificationGroupsAction),
    switchMap(({ payload }) => this.tradeclassificationgroupService.post(payload, '/GetTradeClassificationGroups')
      .pipe(
        map((response: IStandardIndustrialClassificationLevel[]) => getTradeClassificationGroupsSuccessAction({ response }))
      ))
  ));

  getFilingdetailsSetupAction$ = createEffect(() => this.actions$.pipe(
    ofType(getFilingdetailsSetupAction),
    switchMap(() => this.filingdetailSetupService.get()
      .pipe(
        switchMap((response) => {
          return combineLatest([
            this.standardIndustrialClassificationService.get(`/${response?.sicCodeId}`),
            this.tradeclassificationsService.post({
              implementSortingAndPaging: false, tradeClassificationGroupId: response?.tradeClassificationGroupId, tradeClassificationId: undefined
            }, '/GetTradeClassifications'),
            of(response)
          ]);
        }),
        switchMap(([{ sicGroupId, sicLevel2Id, sicLevel3Id, sicLevel4Id }, tradeClassifications, filingdetailSetup]) => {
          return combineLatest(['', sicGroupId, sicLevel2Id, sicLevel3Id, sicLevel4Id, '@@', '-_-']?.map((sicId, index) => {
            if (index <= 4)
              return this.standardIndustrialClassificationService.get(`/GetStandardIndustrialClassificationLevel/${(index + 1)}/${sicId}`)
            else if (index === 5)
              return of(tradeClassifications);
            else
              return of([filingdetailSetup]);
          }))
        }),
        map((response: IStandardIndustrialClassificationLevel[]) => {
          const dict = new Map<number, IStandardIndustrialClassificationLevel>();
          response.forEach((responseLevel, index) => {
            dict.set((index + 1), responseLevel)
          });
          return dict;
        }),
        map((response: Map<number, IStandardIndustrialClassificationLevel>) => {
          return getFilingdetailsSetupSuccessAction({ response })
        })
      ))
  ));

  constructor(
    injector: Injector,
    private actions$: Actions,
    private filingdetailSetupService: FilingDetailsSetupService,
    private tradeclassificationsService: TradeclassificationsService,
    private tradeclassificationgroupService: TradeclassificationgroupService,
    private standardIndustrialClassificationService: StandardIndustrialClassificationService) {
    super(injector);
  }
}