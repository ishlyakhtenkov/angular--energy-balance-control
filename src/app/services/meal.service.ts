import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Meal } from '../common/meal';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private mealsUrl = `${environment.apiUrl}/meal-service/api/meals`;

  constructor(private httpClient: HttpClient) { }

  getMealPage(page: number, size: number): Observable<GetResponseMeals> {
    const paginateQueryParams = `?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseMeals>(`${this.mealsUrl}${paginateQueryParams}`);
  }

  createMeal(meal: Meal): Observable<Meal> {
    return this.httpClient.post<Meal>(this.mealsUrl, meal);
  }

  updateMeal(meal: Meal): Observable<any> {
    return this.httpClient.put<any>(`${this.mealsUrl}/${meal.id}`, meal);
  }

  deleteMeal(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.mealsUrl}/${id}`);
  }
}

interface GetResponseMeals {
  content: Meal[],
  pageable: {
    page: number,
    size: number
  },
  total: number
}