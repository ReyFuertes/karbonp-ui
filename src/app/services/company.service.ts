import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  public apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveAvatar(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/auth/company/UpdateCompanyAvatar/', request).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
