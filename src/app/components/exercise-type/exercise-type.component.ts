import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExerciseType } from 'src/app/common/exercise-type';
import { ExerciseTypeTo } from 'src/app/common/exercise-type-to';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { ExerciseTypeService } from 'src/app/services/exercise-type.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-exercise-type',
  templateUrl: './exercise-type.component.html',
  styleUrls: ['./exercise-type.component.css']
})
export class ExerciseTypeComponent implements OnInit {
  exerciseTypes: ExerciseType[];

  exerciseTypeAddFormGroup: FormGroup;
  exerciseTypeEditFormGroup: FormGroup;
  editedExerciseTypeDescription: string;

  refreshing: boolean;

  constructor(private exerciseTypeService: ExerciseTypeService, private notificationService: NotificationService, 
              private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService) { }

  ngOnInit(): void {
    this.listExerciseTypes();
    this.makeExerciseTypeAddFormGroup();
    this.makeExerciseTypeEditFormGroup();
  }

  listExerciseTypes() {
    this.refreshing = true;
    this.exerciseTypeService.getExerciseTypeList().subscribe(
      (response: ExerciseType[]) => {
        this.exerciseTypes = response;
        this.refreshing = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
        this.refreshing = false;
      }
    );
  }

  makeExerciseTypeAddFormGroup() {
    this.exerciseTypeAddFormGroup = this.formBuilder.group({
      exerciseType: this.formBuilder.group({
        description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(120), CustomValidators.notOnlyWhitespace]),
        measure: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidators.notOnlyWhitespace]),
        caloriesBurned: new FormControl('', [Validators.required, Validators.min(1), Validators.max(1000)])
      })
    });
  }

  private makeExerciseTypeEditFormGroup() {
    this.exerciseTypeEditFormGroup = this.formBuilder.group({
      exerciseType: this.formBuilder.group({
        id: [''],
        descriptionEdited: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(120), CustomValidators.notOnlyWhitespace]),
        measureEdited: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidators.notOnlyWhitespace]),
        caloriesBurnedEdited: new FormControl('', [Validators.required, Validators.min(1), Validators.max(1000)])
      })
    });
  }

  // Submit Add Exercise Type Form
  onAddNewExerciseType() {
    if (this.exerciseTypeAddFormGroup.invalid) {
      this.exerciseTypeAddFormGroup.markAllAsTouched();
    } else {
      let newExerciseTypeTo = new ExerciseTypeTo(null, this.description.value, this.measure.value, this.caloriesBurned.value);
      this.exerciseTypeService.createExerciseType(newExerciseTypeTo).subscribe(
        (response: ExerciseType) => {
          document.getElementById("exerciseType-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New exercise type '${response.description}' has been created`);
          this.listExerciseTypes();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "exerciseType-add-modal-close");
        }
      );
    }
  }

  prepareExerciseTypeEditFormGroup(exerciseType: ExerciseType) {
    this.editedExerciseTypeDescription = exerciseType.description;
    this.exerciseTypeEditFormGroup = this.formBuilder.group({
      exerciseType: this.formBuilder.group({
        id: [exerciseType.id],
        descriptionEdited: new FormControl(exerciseType.description, [Validators.required, Validators.minLength(2), Validators.maxLength(120), CustomValidators.notOnlyWhitespace]),
        measureEdited: new FormControl(exerciseType.measure, [Validators.required, Validators.minLength(2), Validators.maxLength(40), CustomValidators.notOnlyWhitespace]),
        caloriesBurnedEdited: new FormControl(exerciseType.caloriesBurned, [Validators.required, Validators.min(1), Validators.max(1000)])
      })
    });
  }

  // Submit Exercise Type Edit From
  onUpdateExerciseType() {
    if (this.exerciseTypeEditFormGroup.invalid) {
      this.exerciseTypeEditFormGroup.markAllAsTouched();
    } else {
      let updatedExerciseTypeTo = new ExerciseTypeTo(this.id.value, this.descriptionEdited.value, this.measureEdited.value, this.caloriesBurnedEdited.value);
      this.exerciseTypeService.updateExerciseType(updatedExerciseTypeTo).subscribe(
        response => {
          document.getElementById("exerciseType-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The exercise type '${updatedExerciseTypeTo.description}' has been updated`);
          this.listExerciseTypes();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listExerciseTypes();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "exerciseType-edit-modal-close");
        }
      );
    }
  }

  deleteExerciseType(id: number, description: string) {
    if (confirm(`Are you sure want to delete the exercise type '${description}'?`)) {
      this.exerciseTypeService.deleteExerciseType(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The exercise type '${description}' has been deleted`);
          this.listExerciseTypes();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listExerciseTypes();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  refresh() {
    this.listExerciseTypes();
  }

  // Getters for exerciseTypeAddFormGroup values
  get description() {
    return this.exerciseTypeAddFormGroup.get('exerciseType.description');
  }
  get measure() {
    return this.exerciseTypeAddFormGroup.get('exerciseType.measure');
  }
  get caloriesBurned() {
    return this.exerciseTypeAddFormGroup.get('exerciseType.caloriesBurned');
  }

  // Getters for exerciseTypeEditFormGroup values
  get id() {
    return this.exerciseTypeEditFormGroup.get('exerciseType.id');
  }
  get descriptionEdited() {
    return this.exerciseTypeEditFormGroup.get('exerciseType.descriptionEdited');
  }
  get measureEdited() {
    return this.exerciseTypeEditFormGroup.get('exerciseType.measureEdited');
  }
  get caloriesBurnedEdited() {
    return this.exerciseTypeEditFormGroup.get('exerciseType.caloriesBurnedEdited');
  }
}