import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {

  private passwordResetUrl = `${environment.gatewayServerUrl}/password-reset-service/api/password/reset`;

  constructor(private httpClient: HttpClient) { }

  resetPassword(token: string, password: string): Observable<any> {
    const passwordResetQueryParams = `?token=${token}&password=${password}`;
    return this.httpClient.post<any>(`${this.passwordResetUrl}${passwordResetQueryParams}`, {});
  }
}