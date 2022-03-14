import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meal } from 'src/app/common/meal';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { MealService } from 'src/app/services/meal.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {
  meals: Meal[];

  mealAddFormGroup: FormGroup;
  mealEditFormGroup: FormGroup;
  editedMealDescription: string;

  refreshing: boolean;

  //pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;    

  constructor(private mealService: MealService, private notificationService: NotificationService, 
              private formBuilder: FormBuilder, private errorHandlingService: ErrorHandlingService) { }

  ngOnInit(): void {
    this.listMeals();
    this.makeMealAddFormGroup();
    this.makeMealEditFormGroup();
  }

  listMeals() {
    this.refreshing = true;
    this.mealService.getMealPage(this.pageNumber - 1, this.pageSize).subscribe(
      response => {
        this.meals = response.content;
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

  makeMealAddFormGroup() {
    this.mealAddFormGroup = this.formBuilder.group({
      meal: this.formBuilder.group({
        dateTime: new FormControl(formatDate(Date.now(), 'yyyy-MM-ddTHH:mm', 'en-Us'), [Validators.required]),
        description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(120), CustomValidators.notOnlyWhitespace]),
        calories: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5000)])
      })
    });
  }

  private makeMealEditFormGroup() {
    this.mealEditFormGroup = this.formBuilder.group({
      meal: this.formBuilder.group({
        id: [''],
        dateTimeEdited: new FormControl('', [Validators.required]),
        descriptionEdited: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(120), CustomValidators.notOnlyWhitespace]),
        caloriesEdited: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5000)])
      })
    });
  }

  prepareMealEditFormGroup(meal: Meal) {
    this.editedMealDescription = meal.description;
    this.mealEditFormGroup = this.formBuilder.group({
      meal: this.formBuilder.group({
        id: [meal.id],
        dateTimeEdited: new FormControl(meal.dateTime, [Validators.required]),
        descriptionEdited: new FormControl(meal.description, [Validators.required, Validators.minLength(2), Validators.maxLength(120), CustomValidators.notOnlyWhitespace]),
        caloriesEdited: new FormControl(meal.calories, [Validators.required, Validators.min(1), Validators.max(5000)])
      })
    });
  }

  // Submit Add Meal From
  onAddNewMeal() {
    if (this.mealAddFormGroup.invalid) {
      this.mealAddFormGroup.markAllAsTouched();
    } else {
      let newMeal = new Meal(null, this.dateTime.value, this.description.value, this.calories.value);
      this.mealService.createMeal(newMeal).subscribe(
        (response: Meal) => {
          document.getElementById("meal-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New meal '${response.description}' has been created`);
          this.listMeals();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "meal-add-modal-close");
        }
      );
    }
  }

  // Submit Meal Edit From
  onUpdateMeal() {
    if (this.mealEditFormGroup.invalid) {
      this.mealEditFormGroup.markAllAsTouched();
    } else {
      let updatedMeal = new Meal(this.id.value, this.dateTimeEdited.value, this.descriptionEdited.value, this.caloriesEdited.value);
      this.mealService.updateMeal(updatedMeal).subscribe(
        response => {
          document.getElementById("meal-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The meal '${updatedMeal.description}' has been updated`);
          this.listMeals();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listMeals();
          }
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "meal-edit-modal-close");
        }
      );
    }
  }

  deleteMeal(id: number, description: string) {
    if (confirm(`Are you sure want to delete the meal '${description}'?`)) {
      this.mealService.deleteMeal(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The meal '${description}' has been deleted`);
          this.listMeals();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.listMeals();
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  refresh() {
    this.refreshing = true;
    this.pageNumber = 1;
    this.listMeals();
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listMeals();
  }

  // Getters for mealAddFormGroup values
  get dateTime() {
    return this.mealAddFormGroup.get('meal.dateTime');
  }
  get description() {
    return this.mealAddFormGroup.get('meal.description');
  }
  get calories() {
    return this.mealAddFormGroup.get('meal.calories');
  }

  // Getters for mealEditFormGroup values
  get id() {
    return this.mealEditFormGroup.get('meal.id');
  }
  get dateTimeEdited() {
    return this.mealEditFormGroup.get('meal.dateTimeEdited');
  }
  get descriptionEdited() {
    return this.mealEditFormGroup.get('meal.descriptionEdited');
  }
  get caloriesEdited() {
    return this.mealEditFormGroup.get('meal.caloriesEdited');
  }
}