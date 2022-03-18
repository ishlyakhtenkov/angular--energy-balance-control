import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {

  private emailVerificationUrl = `${environment.gatewayServerUrl}/email-verification-service/api/email/verify`;

  constructor(private httpClient: HttpClient) { }

  verifyEmail(token: string): Observable<any> {
    const tokenQueryParam = `?token=${token}`;
    return this.httpClient.post<any>(`${this.emailVerificationUrl}${tokenQueryParam}`, {});
  }
}