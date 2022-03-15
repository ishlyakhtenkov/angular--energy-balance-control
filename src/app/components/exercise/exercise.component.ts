import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Exercise } from 'src/app/common/exercise';
import { ExerciseTo } from 'src/app/common/exercise-to';
import { ExerciseType } from 'src/app/common/exercise-type';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { ExerciseTypeService } from 'src/app/services/exercise-type.service';
import { ExerciseService } from 'src/app/services/exercise.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent implements OnInit {
  exercises: Exercise[];
  exerciseTypes: ExerciseType[];

  exerciseAddFormGroup: FormGroup;
  exerciseEditFormGroup: FormGroup;
  editedExerciseDescription: string;

  refreshing: boolean;

  //pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(private exerciseService: ExerciseService, private exerciseTypeService: ExerciseTypeService, private notificationService: NotificationService, 
              private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService) { }

  ngOnInit(): void {
    this.listExercises();
    this.makeExerciseAddFormGroup();
    this.makeExerciseEditFormGroup();
  }

  listExercises() {
    this.refreshing = true;
    this.exerciseService.getExercisePage(this.pageNumber - 1, this.pageSize).subscribe(
      response => {
        this.exercises = response.content;
        this.pageNumber = response.pageable.page + 1;
        this.pageSize = response.pageable.size;
        this.totalElements = response.total;
        this.refreshing = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
        this.refreshing = false;
      }
    );
  }

  private getExerciseTypes() {
    this.exerciseTypeService.getExerciseTypeList().subscribe(
      (response: ExerciseType[]) => {
        this.exerciseTypes = response;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  makeExerciseAddFormGroup() {
    this.getExerciseTypes();
    this.exerciseAddFormGroup = this.formBuilder.group({
      exercise: this.formBuilder.group({
        dateTime: new FormControl(formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-Us'), [Validators.required]),
        exerciseType: new FormControl('', [Validators.required]),
        amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100000)])
      })
    });
  }

  private makeExerciseEditFormGroup() {
    this.exerciseEditFormGroup = this.formBuilder.group({
      exercise: this.formBuilder.group({
        id: [''],
        dateTimeEdited: new FormControl('', [Validators.required]),
        exerciseTypeEdited: new FormControl('', [Validators.required]),
        amountEdited: new FormControl('', [Validators.required, Validators.min(1), Validators.max(100000)])
      })
    });
  }

  prepareExerciseEditFormGroup(exercise: Exercise) {
    this.editedExerciseDescription = exercise.exerciseType.description;
    this.exerciseTypeService.getExerciseTypeList().subscribe(
      (response: ExerciseType[]) => {
        this.exerciseTypes = response;
        let selectedExerciseType = this.getSelectedExerciseType(exercise);
        this.exerciseEditFormGroup = this.formBuilder.group({
          exercise: this.formBuilder.group({
            id: [exercise.id],
            dateTimeEdited: new FormControl(exercise.dateTime, [Validators.required]),
            exerciseTypeEdited: new FormControl(selectedExerciseType, [Validators.required]),
            amountEdited: new FormControl(exercise.amount, [Validators.required, Validators.min(1), Validators.max(100000)])
          })
        });
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  //TODO Add deleted exercise type to exercise types array
  private getSelectedExerciseType(exercise: Exercise): ExerciseType {
    let selectedExerciseTypeIndex = this.exerciseTypes.findIndex(exerciseType => exerciseType.id === exercise.exerciseType.id);
    if (selectedExerciseTypeIndex != -1) {
      return this.exerciseTypes[selectedExerciseTypeIndex];
    } else {
      this.exerciseTypes.push(exercise.exerciseType);
      return exercise.exerciseType;
    }
  }

  // Submit Add Exercise Form
  onAddNewExercise() {
    if (this.exerciseAddFormGroup.invalid) {
      this.exerciseAddFormGroup.markAllAsTouched();
    } else {
      let newExerciseTo = new ExerciseTo(null, this.dateTime.value, this.amount.value, this.exerciseType.value.id);
      this.exerciseService.createExercise(newExerciseTo).subscribe(
        (response: Exercise) => {
          document.getElementById("exercise-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New exercise '${response.exerciseType.description}' has been created`);
          this.listExercises();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "exercise-add-modal-close");
        }
      );
    }
  }

  // Submit Exercise Edit Form
  onUpdateExercise() {
    if (this.exerciseEditFormGroup.invalid) {
      this.exerciseEditFormGroup.markAllAsTouched();
    } else {
      let updatedExerciseTo = new ExerciseTo(this.id.value, this.dateTimeEdited.value, this.amountEdited.value, this.exerciseTypeEdited.value.id);
      this.exerciseService.updateExercise(updatedExerciseTo).subscribe(
        response => {
          document.getElementById("exercise-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The exercise '${this.exerciseTypeEdited.value.description}' has been updated`);
          this.listExercises();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listExercises();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "exercise-edit-modal-close");
        }
      );
    }
  }

  deleteExercise(id: number, description: string) {
    if (confirm(`Are you sure want to delete the exercise '${description}'?`)) {
      this.exerciseService.deleteExercise(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The exercise '${description}' has been deleted`);
          this.listExercises();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listExercises();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  refresh() {
    this.refreshing = true;
    this.pageNumber = 1;
    this.listExercises();
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listExercises();
  }

  // Getters for exerciseAddFormGroup values
  get dateTime() {
    return this.exerciseAddFormGroup.get('exercise.dateTime');
  }
  get exerciseType() {
    return this.exerciseAddFormGroup.get('exercise.exerciseType');
  }
  get amount() {
    return this.exerciseAddFormGroup.get('exercise.amount');
  }

  // Getters for exerciseEditFormGroup values
  get id() {
    return this.exerciseEditFormGroup.get('exercise.id');
  }
  get dateTimeEdited() {
    return this.exerciseEditFormGroup.get('exercise.dateTimeEdited');
  }
  get exerciseTypeEdited() {
    return this.exerciseEditFormGroup.get('exercise.exerciseTypeEdited');
  }
  get amountEdited() {
    return this.exerciseEditFormGroup.get('exercise.amountEdited');
  }
}