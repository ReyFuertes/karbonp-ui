


import { Directive, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { delay, takeUntil } from 'rxjs';

import { GenericDestroy } from './generic-destroy-page';
import { MessageErrorType } from 'src/app/models/generic.enum';
import { PAGINATION_VARS } from '../constants/generic.constant';
import { IPaginationPayload } from 'src/app/models/generic.model';

@Directive()
export class GenericEffect extends GenericDestroy {
  protected payload: IPaginationPayload = {
    pageNumber: PAGINATION_VARS.pageNumber,
    pagesize: PAGINATION_VARS.pagesize,
    sortBy: 'EndDate',
    sortAscending: true,
    payFrequencyId: null
  }
  private messageService: MessageService;
  private translateService: TranslateService;

  constructor(injector: Injector) {
    super();
    this.messageService = injector.get(MessageService);
    this.translateService = injector.get(TranslateService);
  }

  protected getPagination(response: any): any {
    return ({
      items: response?.body,
      totalItems: JSON.parse(response?.headers?.get('pagination'))?.totalItems
    })
  }

  protected getNotificationMessage(response: any, message?: string, life: number = 2000): void {
    const errorList: any[] = Object.prototype.hasOwnProperty.call(response, 'errors') ? response?.errors : []
    const hasError = errorList?.length && errorList?.length > 0
      || response?.status && response?.status === 401
      || Object.values(errorList)?.length > 0 //note: so much checking not structured response -_-
      || response?.errorList && response?.errorList !== ''
      || response?.errorMessage;
    const type = hasError ? MessageErrorType.Error : MessageErrorType.Success;
    const translationMessage = (message && !hasError)
      ? message
      : (hasError ? 'ErrorSaving' : 'SavedSuccessfully');
    this.translateService.get(translationMessage)
      .pipe(delay(300), takeUntil(this.$unsubscribe))
      .subscribe((translatedValue) => {
        this.messageService.add({ severity: type, summary: translatedValue, life });
      });
  }
}