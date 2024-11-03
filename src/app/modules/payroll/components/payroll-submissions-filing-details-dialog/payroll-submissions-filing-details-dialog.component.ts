import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, takeUntil } from 'rxjs';
import { select } from '@ngrx/store';

import { GenericPage } from 'src/app/shared/generics/page.generic';
import { getStandardIndustrialClassificationLevel1Selector, getTradeClassificationGroupsSelector } from '../../store/payroll-filing-details/payroll-filing-details.selector';
import { IStandardIndustrialClassificationLevel } from '../../payroll.model';
import { getTradeClassificationGroupsAction, saveFilingdetailsSetupAction } from '../../store/payroll-filing-details/payroll-filing-details.action';

@Component({
  selector: 'kp-payroll-submissions-filing-details-dialog',
  templateUrl: './payroll-submissions-filing-details-dialog.component.html',
  styleUrls: ['./payroll-submissions-filing-details-dialog.component.scss']
})
export class PayrollSubmissionsFilingDetailsDialogComponent extends GenericPage implements OnInit {
  public showDialog: boolean = false;
  public standardIndustrialClassLevels = new Map<number, IStandardIndustrialClassificationLevel[]>();
  public tradeClassificationGroups: IStandardIndustrialClassificationLevel[];

  constructor(injector: Injector) {
    super(injector);
    this.store.dispatch(getTradeClassificationGroupsAction({ payload: { implementSortingAndPaging: false } }));
    this.form = new FormGroup({
      payeNumber: new FormControl(undefined, Validators.required),
      tradeClassificationGroupId: new FormControl(undefined, Validators.required),
      tradeClassificationId: new FormControl(undefined, Validators.required),
      diplomaticIndemnity: new FormControl(false),
      sicMainGroupId: new FormControl(undefined, Validators.required),
      sicLevel2Id: new FormControl(undefined, Validators.required),
      sicLevel3Id: new FormControl(undefined, Validators.required),
      sicLevel4Id: new FormControl(undefined, Validators.required),
      sicCodeId: new FormControl(undefined, Validators.required),
      sarsContactName: new FormControl(undefined),
      sarsContactPosition: new FormControl(undefined),
      sarsContactBusinessTelephoneNumber: new FormControl(undefined),
      sarsContactCellNumber: new FormControl(undefined),
      sarsContactFaxNumber: new FormControl(undefined),
      sarsContactEmail: new FormControl(undefined, [Validators.email]),
      uifNumber: new FormControl(undefined, Validators.required),
    })
  }

  ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getStandardIndustrialClassificationLevel1Selector)),
      this.store.pipe(select(getTradeClassificationGroupsSelector))
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe(([standardIndustrialClassLevels, tradeClassificationGroups]) => {
        if (standardIndustrialClassLevels) {
          this.standardIndustrialClassLevels = standardIndustrialClassLevels;
          const tradeClassifications = standardIndustrialClassLevels?.get(7);
          if (tradeClassifications) {
            this.form.patchValue(tradeClassifications[0]);
          }
        }
        this.tradeClassificationGroups = tradeClassificationGroups;
      })
  }
  //note: missmatching fields between sic & sIC -_-
  public onSaveFilingDetail(): void {
    if (this.form.valid)
      this.store.dispatch(saveFilingdetailsSetupAction({ payload: this.form.value }));
    else
      console.log('Error: Form invalid');
  }
}
