import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUserTo } from '../common/new-user-to';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileUrl = `${environment.apiUrl}/user-service/api/profile`;

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
}