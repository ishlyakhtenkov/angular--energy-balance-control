import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { Messages } from 'src/app/enums/messages';
import { NotificationType } from 'src/app/enums/notification-type';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TestDataCheckingService } from 'src/app/services/test-data-checking.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { StringUtil } from 'src/app/utils/string-util';
import { UserTo } from 'src/app/common/user-to';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: User;
  changePasswordFormGroup: FormGroup;
  profileEditFormGroup: FormGroup;

  constructor(private profileService: ProfileService, private notificationService: NotificationService, private errorHandlingService: ErrorHandlingService,
              private authenticationService: AuthenticationService, private location: Location, private router: Router, private formBuilder: FormBuilder, 
              private testDataCheckingService: TestDataCheckingService) { }

  ngOnInit(): void {
    this.handleUserProfile();
    this.makeChangePasswordFormGroup();
  }

  private handleUserProfile() {
    this.profileService.getProfile().subscribe(
      (response: User) => {
        this.profile = response;
        this.makeProfileEditFormGroup();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );
  }

  private makeProfileEditFormGroup() {
    this.profileEditFormGroup = this.formBuilder.group({
      profileGroup: this.formBuilder.group({
        id: [this.profile.id],
        nameEdited: new FormControl(this.profile.name, [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        sexEdited: new FormControl(this.profile.sex, [Validators.required]),
        weightEdited: new FormControl(this.profile.weight, [Validators.required, Validators.min(10), Validators.max(1000)]),
        growthEdited: new FormControl(this.profile.growth, [Validators.required, Validators.min(30), Validators.max(250)]),
        ageEdited: new FormControl(this.profile.age, [Validators.required, Validators.min(1), Validators.max(120)]),
      })
    });
  }

  makeChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword') })
    });
  }

  private checkIfMatchingPasswords(passwordKey: string, repeatPasswordKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let repeatPasswordInput = group.controls[repeatPasswordKey];
      if (!repeatPasswordInput.value) {
        return repeatPasswordInput.setErrors({ required: true });
      }
      if (passwordInput.value !== repeatPasswordInput.value) {
        return repeatPasswordInput.setErrors({ notEquivalent: true });
      }
      else {
        return repeatPasswordInput.setErrors(null);
      }
    }
  }

  // Submit Change Password Form
  onChangePassword(): void {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
    } else {
      if (!this.testDataCheckingService.checkTestUser(this.profile.id, Messages.TEST_DATA_CANNOT_BE_CHANGED)) {
        let newPassword = this.changePasswordFormGroup.get('changedPassword.newPassword').value;
        this.profileService.changePassword(newPassword).subscribe(
          response => {
            document.getElementById("change-password-modal-close").click();
            this.notificationService.sendNotification(NotificationType.SUCCESS, Messages.PASSWORD_CHANGED);
          },
          (errorResponse: HttpErrorResponse) => {
            this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "change-password-modal-close");
          }
        );
      }
    }
  }

  logOut(): void {
    this.authenticationService.logout();
    this.notificationService.sendNotification(NotificationType.SUCCESS, Messages.LOGGED_OUT);
    this.router.navigateByUrl("/login");
  }

  back(): void {
    this.location.back();
  }

  onDeleteProfile(): void {
    if (!this.testDataCheckingService.checkTestUser(this.profile.id, Messages.TEST_DATA_CANNOT_BE_CHANGED)) {
      this.profileService.deleteProfile().subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Your profile has been deleted!`);
          this.authenticationService.logout();
          this.router.navigateByUrl("/login");
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 422) {
            this.authenticationService.logout();
            this.router.navigateByUrl("/login");
            this.notificationService.sendNotification(NotificationType.ERROR, `Profile not found!`);
          }
          this.errorHandlingService.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  // Submit Profile Edit Form
  onProfileUpdate() {
    if (this.profileEditFormGroup.invalid) {
      this.profileEditFormGroup.markAllAsTouched();
    } else {
      if (!this.testDataCheckingService.checkTestUser(this.profile.id, Messages.TEST_DATA_CANNOT_BE_CHANGED)) {
        let updatedProfile = new UserTo(this.id.value, this.nameEdited.value, this.sexEdited.value, this.weightEdited.value, this.growthEdited.value, this.ageEdited.value);
        this.profileService.updateProfile(updatedProfile).subscribe(
          response => {
            this.ngOnInit();
            this.notificationService.sendNotification(NotificationType.SUCCESS, `Your profile has been updated`);
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status == 422) {
              this.authenticationService.logout();
              this.router.navigateByUrl("/login");
              this.notificationService.sendNotification(NotificationType.ERROR, `Profile not found!`);
              }
              this.errorHandlingService.handleErrorResponse(errorResponse);
          }
        );
      }
    }
  }

  prepareRolesForShowing(roles: string[]): string {
    if (roles != null) {
      let preparedRoles = [];
      for (let role of roles) {
        role = StringUtil.UpperCaseFirstLettersOfWords(role.replace('_', ' '));
        preparedRoles.push(role);
      }
      return preparedRoles.sort().join(', ');  
    }
    return '';
  }

  isSaveButtonDisable(): boolean {
    if (this.profileEditFormGroup.valid){
      if (this.profile?.name != this.nameEdited.value || this.profile?.sex != this.sexEdited.value || this.profile?.weight != this.weightEdited.value 
            || this.profile?.growth != this.growthEdited.value || this.profile?.age != this.ageEdited.value) {
        return false;
      }
      return true;
    } else {
      return true;
    }
  }

  // Getters for changePasswordFormGroup values
  get newPassword() {
    return this.changePasswordFormGroup.get('changedPassword.newPassword');
  }
  get repeatNewPassword() {
    return this.changePasswordFormGroup.get('changedPassword.repeatNewPassword');
  }

  // Getters for profileEditFormGroup values
  get id() {
    return this.profileEditFormGroup.get('profileGroup.id');
  }
  get nameEdited() {
    return this.profileEditFormGroup.get('profileGroup.nameEdited');
  }
  get sexEdited() {
    return this.profileEditFormGroup.get('profileGroup.sexEdited');
  }
  get weightEdited() {
    return this.profileEditFormGroup.get('profileGroup.weightEdited');
  }
  get growthEdited() {
    return this.profileEditFormGroup.get('profileGroup.growthEdited');
  }
  get ageEdited() {
    return this.profileEditFormGroup.get('profileGroup.ageEdited');
  }
}