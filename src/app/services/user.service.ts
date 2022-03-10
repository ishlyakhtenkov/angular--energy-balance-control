import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = `${environment.apiUrl}/user-service/api/users`;

  constructor(private httpClient: HttpClient) { }

  getUserPage(page: number, size: number): Observable<GetResponseUsers> {
    const paginateQueryParams = `?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseUsers>(`${this.usersUrl}${paginateQueryParams}`);
  }
}

interface GetResponseUsers {
  content: User[],
  pageable: {
    page: number,
    size: number
  },
  total: number
}