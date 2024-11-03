import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IApplication } from 'src/app/modules/employee/employee.model';
import { AppMenuConfigService } from 'src/app/services/common.service';

@Component({
  selector: 'kp-disable-app',
  templateUrl: './disable-app.component.html',
  styleUrls: ['./disable-app.component.scss']
})
export class DisabledAppComponent {
  @Input() disabled: boolean = false;
  @Input() redirectToMenu: string = '';
  @Input() description: string = '';
  @Input() btnClass: string = 'form-button-default';
  @Output() public disableChange = new EventEmitter<IApplication>(undefined);

  constructor(private appMenuConfig: AppMenuConfigService) { }

  public onDisabled(): void {
    if (this.redirectToMenu) {
      this.disableChange.emit();
      this.appMenuConfig.setRedirectMenuState(this.redirectToMenu);
    }
  }
}
