import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { GenericApplicationSetting } from 'src/app/shared/generics/application-settings.generic';
import { getHasErrorSelector, getPeopleStatusByIdSelector, getPeopleStatusesSelector, isPeopleStatusLoadingSelector } from '../../store/people-status/people-status.selector';
import { IPeopleStatus } from '../../people.model';
import { addPeopleStatusAction, deletePeopleStatusAction, updatePeopleStatusAction } from '../../store/people-status/people-status.action';

@Component({
  selector: 'kp-people-settings',
  templateUrl: './people-settings.component.html',
  styleUrls: ['./people-settings.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class PeopleSettingsComponent extends GenericApplicationSetting implements OnInit {
  public selectedTabIndex: number = 0;
  public statuses: IPeopleStatus[] = [];
  public showPeopleStatusModal: boolean = false;
  public statusForm: FormGroup;
  public actionState: 'add' | 'edit' = 'add';
  public hasError: boolean = false;

  constructor(injector: Injector,
    public cdRef: ChangeDetectorRef,
    public fb: FormBuilder) {
    super(injector);
    this.statusForm = this.fb.group({
      id: new FormControl(0),
      name: new FormControl(undefined, Validators.required),
      description: new FormControl(undefined)
    });
  }

  public override ngOnInit(): void {
    combineLatest([
      this.store.pipe(select(getPeopleStatusesSelector)),
      this.store.pipe(select(getHasErrorSelector))
    ]).subscribe(([statuses]) => {
      this.statuses = statuses;
    });
  }

  public isLoadingAsync = () => this.store.pipe(select(isPeopleStatusLoadingSelector))

  public onAdd(): void {
    switch (this.selectedTabIndex) {
      case 0:
        this.onAddStatus();
        break;
      default:
        break;
    }
  }

  public onSaveChanges(): void {
    const payload = this.statusForm.value;
    switch (this.actionState) {
      case 'add':
        this.store.dispatch(addPeopleStatusAction({ payload }));
        break;
      case 'edit':
        this.store.dispatch(updatePeopleStatusAction({ payload }));
        break;
      default: break;
    }
    setTimeout(() => this.showPeopleStatusModal = false, 150);
  }

  public onAddStatus(): void {
    this.actionState = 'add';
    this.showPeopleStatusModal = true;
    this.statusForm.patchValue({ id: 0, name: undefined, description: undefined }, { emitEvent: true });
  }

  public onEditStatus(status: IPeopleStatus): void {
    this.store.pipe(select(getPeopleStatusByIdSelector(status.id)))
      .subscribe((status: IPeopleStatus) => {
        if (status) {
          this.actionState = 'edit';
          this.statusForm.patchValue(status);
          this.showPeopleStatusModal = true;
        }
      })
  }

  public onDeleteStatus(id: number): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove?`,
      accept: () => {
        this.store.dispatch(deletePeopleStatusAction({ id }));
      },
      reject: () => this.cd.reject()
    });
  }

  public handleTabChange(event: any): void {
    console.log('Not implemented', event);
  }
}
