import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from "@angular/common/http";
import { last, map, Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { ICommonResponse, IUserAvatar } from "../models/generic.model";
import { AuthService } from "../modules/auth/auth.service";

@Injectable({ providedIn: 'root' })
export class UserService {
  public uploadProgress: string = '0%';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public saveUserAvatar(request: IUserAvatar): Observable<ICommonResponse> {
    return this.authService.post(request, '/auth/user/UpdateUserAvatar');
  }

  public uploadAvatar(formData: any) {
    this.uploadProgress = '';
    return this.http.request(new HttpRequest('POST', environment.cloudinaryUploadUrl, formData, {
      reportProgress: true
    })).pipe(
      map(event => this.getEventMessage(event)),
      last()
    );
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.uploadProgress = `${event.total ? Math.round(100 * event.loaded / event.total) : 0}%`;
        return;
      case HttpEventType.Response:
        return event.body;
      default:
        return;
    }
  }
}
