import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUserTo } from '../common/new-user-to';
import { User } from '../common/user';
import { UserTo } from '../common/user-to';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileUrl = `${environment.gatewayServerUrl}/user-service/api/profile`;

  constructor(private httpClient: HttpClient) { }

  register(newUserTo: NewUserTo): Observable<User> {
    return this.httpClient.post<User>(`${this.profileUrl}/register`, newUserTo);
  }

  sendEmailVerify(email: string): Observable<any> {
    const emailQueryParam = `?email=${email}`;
    return this.httpClient.put<any>(`${this.profileUrl}/email/verify${emailQueryParam}`, {});
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    const emailQueryParam = `?email=${email}`;
    return this.httpClient.put<any>(`${this.profileUrl}/password/reset${emailQueryParam}`, {});
  }

  getProfile(): Observable<User>{
    return this.httpClient.get<User>(this.profileUrl);
  }

  changePassword(newPassword: string): Observable<any> {
    const passwordQueryParam = `?password=${newPassword}`;
    return this.httpClient.patch<any>(`${this.profileUrl}/password${passwordQueryParam}`, {});
  }

  deleteProfile(): Observable<any> {
    return this.httpClient.delete<any>(this.profileUrl, {});
  }

  updateProfile(userTo: UserTo): Observable<any> {
    return this.httpClient.put<any>(this.profileUrl, userTo);
  }
}