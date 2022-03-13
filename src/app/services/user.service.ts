import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminUserTo } from '../common/admin-user-to';
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

  getUserPageByKeyword(page: number, size: number, keyword: string): Observable<GetResponseUsers> {
    const searchQueryParams = `?page=${page}&size=${size}&keyword=${keyword}`;
    return this.httpClient.get<GetResponseUsers>(`${this.usersUrl}/by${searchQueryParams}`);
  }

  enableUser(id: number): Observable<any> {
    return this.httpClient.patch<any>(`${this.usersUrl}/${id}`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.usersUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.usersUrl, user);
  }

  updateUser(adminUserTo: AdminUserTo): Observable<any> {
    return this.httpClient.put<any>(`${this.usersUrl}/${adminUserTo.id}`, adminUserTo);
  }

  changeUserPassword(id: number, newPassword: string): Observable<any> {
    const passwordQueryParam = `?password=${newPassword}`;
    return this.httpClient.patch<any>(`${this.usersUrl}/${id}/password${passwordQueryParam}`, {});
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