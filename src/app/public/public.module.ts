import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { BlockUIModule } from 'primeng/blockui';

import { TokenLoginComponent } from './token-login/token-login.component';
import { AuthEffects } from '../modules/auth/store/auth.effect';
import { InitAppEffect } from '../store/app.effect';

const routes: Routes = [
  {
    path: 'ThirdPartySync/tokenlogin', component: TokenLoginComponent
  }
];


@NgModule({
  declarations: [
    TokenLoginComponent
  ],
  imports: [
    CommonModule,
    BlockUIModule,
    EffectsModule.forFeature([AuthEffects, InitAppEffect]),
    RouterModule.forChild(routes)],
  exports: [],
  providers: [],
})
export class PublicModule { }