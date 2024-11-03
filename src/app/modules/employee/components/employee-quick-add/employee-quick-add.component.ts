import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { filter, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { fadeInAnimation } from 'src/app/shared/animations/fade-in.animation';
import { AppState } from 'src/app/store';
import { GenericFormControls } from 'src/app/shared/generics/form-control.generic';
import { environment } from 'src/environments/environment';
import { clearInvitedEmployeesAction, quickInvitesAction } from '../../store/employee/employee.action';
import { getInvitedEmployeesSelector, isEmployeeLoadingSelector } from '../../store/employee/employee.selector';
import { IEmployee } from '../../employee.model';
import { MESSAGESERVICE_DELAY } from 'src/app/shared/constants/generic.constant';

@Component({
  selector: 'kp-employee-quick-add',
  templateUrl: './employee-quick-add.component.html',
  styleUrls: ['./employee-quick-add.component.scss'],
  animations: [fadeInAnimation(300)]
})
export class EmployeeQuickAddComponent extends GenericFormControls implements OnInit {
  @ViewChild("cd") public cd: ConfirmDialog | undefined;

  public avatarPath: string = '';
  public isChecked: boolean = true;
  public invitedEmployees = new Map<string, IEmployee>();

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private router: Router) {
    super();
    this.avatarPath = environment.imgPath + 'sample-employee-logo.png';
    this.form = new FormGroup({
      firstLastEmail: this.fb.array([
        this.fb.group({
          firstName: new FormControl(undefined, Validators.required),
          lastName: new FormControl(undefined, Validators.required),
          email: new FormControl(undefined, [Validators.required, Validators.email])
        })
      ]),
      sendImmediately: new FormControl(true)//note: need to clarify logic behind this
    });
  }

  ngOnInit(): void {
    this.store.pipe(select(getInvitedEmployeesSelector))
      .pipe(filter(value => value.length > 0), takeUntil(this.$unsubscribe))
      .subscribe(invitedEmployees => {
        invitedEmployees.forEach(employee => {
          this.invitedEmployees.set(employee.email, employee);
        });
        setTimeout(() => {
          this.onReset();
          localStorage.setItem('peopleSelectedMenu', 'directory');
          this.router.navigateByUrl('people');
        }, MESSAGESERVICE_DELAY);
      })
  }

  public isLoadingAsync = () => this.store.pipe(select(isEmployeeLoadingSelector));

  public onReset(): void {
    const formArray = (this.form.controls['firstLastEmail'] as FormArray);
    (this.form.controls['firstLastEmail'] as FormArray).reset();
    this.form.enable();
    for (let index = 1; index < formArray.length; index++)
      formArray.removeAt(index);
    this.store.dispatch(clearInvitedEmployeesAction());
  }

  public onAddEmployees(): void {
    if (this.form.valid) {
      this.form.disable();
      this.store.dispatch(quickInvitesAction({ payload: this.form.value.firstLastEmail }));
    }
  }

  public onRemove(index: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove?',
      accept: () => {
        this.getFirstLastEmail.removeAt(index);
      },
      reject: () => {
        this.cd.reject();
      }
    });
  }

  public addFirstLastAddress(): void {
    this.getFirstLastEmail.push(this.fb.group({
      firstName: new FormControl(undefined, Validators.required),
      lastName: new FormControl(undefined, Validators.required),
      email: new FormControl(undefined, [Validators.required, Validators.email])
    }));
    setTimeout(() => {
      const targetElement = document.querySelector(`.row-${this.getFirstLastEmail.value?.length - 1}`);
      if (targetElement) {
        try {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        } catch (e) { console.log(e) }
      }
    }, 150);
  }

  public get getFirstLastEmail(): FormArray {
    return this.form.get("firstLastEmail") as FormArray;
  }
}
