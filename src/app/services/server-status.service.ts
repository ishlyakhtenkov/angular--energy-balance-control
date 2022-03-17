import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerStatusService {

  private configUpdateUrl = `${environment.configServerUrl}/actuator/busrefresh`;

  constructor(private httpClient: HttpClient) { }

  updateConfiguration(): Observable<any> {
    return this.httpClient.post<any>(this.configUpdateUrl, {});
  }

  checkBxServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.bxServiceUrl}/actuator/health`);
  }

  checkConfigServerServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.configServerUrl}/actuator/health`);
  }

  checkEmailVerificationServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.emailVerificationServiceUrl}/actuator/health`);
  }

  checkEnergyBalanceServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.energyBalanceServiceUrl}/actuator/health`);
  }

  checkEurekaServerServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.eurekaServerUrl}/actuator/health`);
  }

  checkGatewayServerServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.gatewayServerUrl}/actuator/health`);
  }

  checkMealServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.mealServiceUrl}/actuator/health`);
  }

  checkPasswordResetServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.passwordResetServiceUrl}/actuator/health`);
  }

  checkTrainingServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.trainingServiceUrl}/actuator/health`);
  }

  checkUserServiceHealth(): Observable<any> {
    return this.httpClient.get<any>(`${environment.userServiceUrl}/actuator/health`);
  }
}