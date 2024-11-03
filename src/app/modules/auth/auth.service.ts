
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from 'src/app/services/base.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService<any> {
  constructor(http: HttpClient) {
    super(http, 'auth');
  }
}
