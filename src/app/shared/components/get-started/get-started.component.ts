import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IGettingStartedMock } from 'src/app/models/mock.model';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'kp-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss']
})
export class GetStartedComponent implements OnChanges {
  @Input() mock: IGettingStartedMock;
  @Input() public isStarted: boolean = false;
  @Output() public startedChange = new EventEmitter<boolean>(false);

  public imgPath: string = environment.imgPath;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.isStarted = changes['isStarted']?.currentValue;
    this.mock = changes['mock']?.currentValue;
  }

  public onGetStarted(): void {
    if (!this.isStarted)
      this.startedChange.emit(true);
    else
      alert('Not yet started..')
  }
}
