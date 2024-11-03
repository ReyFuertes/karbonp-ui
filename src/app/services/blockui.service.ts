import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class BlockUIService {
  private $showBlockUI: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public getBlockUI(): Observable<boolean> {
    return this.$showBlockUI.asObservable();
  }

  public setBlockUI(value: boolean) {
    this.$showBlockUI.next(value);
  }
}