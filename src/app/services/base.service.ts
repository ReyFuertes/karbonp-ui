import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Directive } from '@angular/core';

@Directive()
export abstract class BaseService<T> {
  protected baseUrl: string;

  constructor(public http: HttpClient, private entity: string = '') {
    this.baseUrl = environment.apiUrl;
  }

  protected commonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.getToken}`,
    });
  }

  private get getToken(): string {
    return localStorage.getItem('token');
  }

  public postObservePagination(object?: T, param: string = ''): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.entity}${param}`,
      object, { observe: 'response', headers: this.commonHeaders() });
  }

  public post(object?: T, param: string = ''): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}${this.entity}${param}`,
      object, { headers: this.commonHeaders() });
  }

  public deleteUsingGet(id: string = ''): Observable<any> {
    return this.http.get(`${this.baseUrl}${this.entity}${id}`,
      { headers: this.commonHeaders() });
  }

  public delete(id?: string, param: string = ''): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.entity}${id}${param}`,
      { headers: this.commonHeaders() });
  }

  public patch(object: T | any, param: string = ''): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${this.entity}${param}`, object,
      { headers: this.commonHeaders() }
    );
  }

  public put(object: T | any, param: string = ''): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${this.entity}${param}`, object,
      { headers: this.commonHeaders() }
    );
  }

  public get(param: string = '', headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${this.entity}${param}`, {
      headers: headers
        ? headers
        : this.commonHeaders()
    });
  }

  public getAll(param: string = ''): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}${this.entity}${param}`, { headers: this.commonHeaders() });
  }
}
