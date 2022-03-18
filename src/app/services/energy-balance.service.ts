import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnergyBalanceReport } from '../common/energy-balance-report';

@Injectable({
  providedIn: 'root'
})
export class EnergyBalanceService {

  private energyBalanceUrl = `${environment.gatewayServerUrl}/energy-balance-service/api/energy-balance`;

  constructor(private httpClient: HttpClient) { }

  getEnergyBalanceReport(date: string): Observable<EnergyBalanceReport>{
    const dateQueryParam = `?date=${date}`;
    return this.httpClient.get<EnergyBalanceReport>(`${this.energyBalanceUrl}${dateQueryParam}`);
  }
}