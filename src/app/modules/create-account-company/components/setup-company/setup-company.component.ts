import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { IOptionItem } from 'src/app/models/generic.model';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kp-setup-company',
  templateUrl: './setup-company.component.html',
  styleUrls: ['./setup-company.component.scss']
})
export class SetupCompanyComponent extends GenericFormControls implements OnInit {
  @Output() public changePage = new EventEmitter<string>(undefined);

  public numberOfEmployeeOptions: IOptionItem[] = [{
    label: '1-5',
    value: '1'
  }, {
    label: '5-10',
    value: '2'
  }, {
    label: '10-50',
    value: '3'
  }, {
    label: '50+',
    value: '4'
  }];
  public processingStage: IOptionItem[] = [{
    label: 'processing',
    value: 'processing'
  }, {
    label: 'setting_up',
    value: 'setting_up'
  }, {
    label: 'dashboard_ready',
    value: 'dashboard_ready'
  }];
  public currentProcessingStage: IOptionItem;
  public imgPath: string = environment.imgPath;
  public isLoading: boolean = false; //note: should be implemented to state
  public processingSetup: boolean = false;
  public dateToday = new Date();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.currentProcessingStage = this.processingStage[0];
  }

  public get getCompanyForm(): AbstractControl {
    return this.form.get('company');
  }

  public onSetupCompany(): void {
    if (this.getCompanyForm.valid) {
      this.currentProcessingStage = this.processingStage[1];
      setTimeout(() => {
        this.currentProcessingStage = Object.assign({}, this.processingStage[2]);
      }, 3000);
    }
  }

  public gotoDashboard(): void {
    this.changePage.emit('goto-dashboard');
  }
}
