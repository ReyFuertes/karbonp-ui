import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, from, throwError, retry } from 'rxjs';
import { Router } from '@angular/router';

import { LocalService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  public isLoading = new BehaviorSubject(false);//note: need to refactor
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  protected durationInSeconds = 5;
  protected requests: HttpRequest<any>[] = [];

  constructor(private localService: LocalService, private loaderService: LoaderService, private router: Router) {
  }

  public removeRequest = (req: HttpRequest<any>) => {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    //this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token') || undefined;
    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    this.requests.push(request);
    //this.loaderService.isLoading.next(true);

    return next.handle(request).pipe(
      catchError(error => {
        // handle only 401 error
        if (error instanceof HttpErrorResponse && error.status === 401) {
          from(this.handle401Request(request));
          return throwError(error);
        }
        return next.handle(request);
      }),
      retry(1)
    )
  }

  private async handle401Request(request: HttpRequest<any>) {
    console.log('Not implemented', request)
  }
}
