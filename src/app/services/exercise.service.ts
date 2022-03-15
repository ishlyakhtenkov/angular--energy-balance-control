import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exercise } from '../common/exercise';
import { ExerciseTo } from '../common/exercise-to';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private exercisesUrl = `${environment.apiUrl}/training-service/api/exercises`;

  constructor(private httpClient: HttpClient) { }

  getExercisePage(page: number, size: number): Observable<GetResponseExercises> {
    const paginateQueryParams = `?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseExercises>(`${this.exercisesUrl}${paginateQueryParams}`);
  }

  createExercise(exerciseTo: ExerciseTo): Observable<Exercise> {
    return this.httpClient.post<Exercise>(this.exercisesUrl, exerciseTo);
  }

  updateExercise(exerciseTo: ExerciseTo): Observable<any> {
    return this.httpClient.put<any>(`${this.exercisesUrl}/${exerciseTo.id}`, exerciseTo);
  }

  deleteExercise(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.exercisesUrl}/${id}`);
  }
}

interface GetResponseExercises {
  content: Exercise[],
  pageable: {
    page: number,
    size: number
  },
  total: number
}