import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SideBarService } from './services/sidebar.service';
import { AuthGuard } from './services/auth.guard';
import { LocalService } from './services/local-storage.service';
import { BlockUIService } from './services/blockui.service';
import { AppComponent } from './app.component';
import { GetStartedGuard } from './services/get-started.guard';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        TranslateModule.forRoot({})
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AuthGuard,
        LocalService,
        BlockUIService,
        SideBarService,
        MessageService,
        GetStartedGuard,
        TranslateService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
