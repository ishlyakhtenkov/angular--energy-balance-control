import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExerciseType } from '../common/exercise-type';
import { ExerciseTypeTo } from '../common/exercise-type-to';

@Injectable({
  providedIn: 'root'
})
export class ExerciseTypeService {

  private exerciseTypesUrl = `${environment.apiUrl}/training-service/api/exercise-types`;

  constructor(private httpClient: HttpClient) { }

  getExerciseTypeList(): Observable<ExerciseType[]> {
    return this.httpClient.get<ExerciseType[]>(this.exerciseTypesUrl);
  }

  createExerciseType(exerciseTypeTo: ExerciseTypeTo): Observable<ExerciseType> {
    return this.httpClient.post<ExerciseType>(this.exerciseTypesUrl, exerciseTypeTo);
  }

  updateExerciseType(exerciseTypeTo: ExerciseTypeTo): Observable<any> {
    return this.httpClient.put<any>(`${this.exerciseTypesUrl}/${exerciseTypeTo.id}`, exerciseTypeTo);
  }

  deleteExerciseType(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.exerciseTypesUrl}/${id}`);
  }
}