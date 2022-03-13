import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/common/user';
import { Messages } from 'src/app/enums/messages';
import { NotificationType } from 'src/app/enums/notification-type';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TestDataCheckingService } from 'src/app/services/test-data-checking.service';
import { UserService } from 'src/app/services/user.service';
import { StringUtil } from 'src/app/utils/string-util';
import { CustomValidators } from 'src/app/validators/custom-validators';
import * as $ from "jquery";
import { AdminUserTo } from 'src/app/common/admin-user-to';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[];
  refreshing: boolean;
  userAddFormGroup: FormGroup;
  userEditFormGroup: FormGroup;
  editedUserName: string;
  changePasswordFormGroup: FormGroup;
  rolesArray = [
    { value: 'ADMIN', name: 'Admin' }, 
    { value: 'USER', name: 'User' }
  ];

  searchModeActivated: boolean = false;
  keyword: string = null;

  //pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;


  constructor(private userService: UserService, private notificationService: NotificationService, private formBuilder: FormBuilder, 
              private errorHandlingService: ErrorHandlingService, private testDataCheckingService: TestDataCheckingService) { }

  ngOnInit(): void {
    this.listUsers();
    this.makeUserAddFormGroup();
    this.makeUserEditFormGroup();
    this.makeChangePasswordFormGroup();
  }

  listUsers() {
    this.refreshing = true;
    this.userService.getUserPage(this.pageNumber - 1, this.pageSize).subscribe(
      response => {
        this.users = response.content;
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

  listUsersByKeyword() {
    this.refreshing = true;
    if (this.keyword.length > 0) {
      this.userService.getUserPageByKeyword(this.pageNumber - 1, this.pageSize, this.keyword).subscribe(
        response => {
          this.users = response.content;
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
    } else {
      this.listUsers();
    }
  }

  searchUsersByKeyword(keyword: string) {
    this.searchModeActivated = true;
    this.pageNumber = 1;
    this.keyword = keyword.trim();
    this.listUsersByKeyword();
  }

  getUsersPage() {
    if (this.searchModeActivated) {
      this.listUsersByKeyword();
    } else {
      this.listUsers();
    }
  }

  makeUserAddFormGroup() {
    this.userAddFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(CustomValidators.emailValidationPattern)]),
        sex: new FormControl('', [Validators.required]),
        weight: new FormControl('', [Validators.required, Validators.min(10), Validators.max(1000)]),
        growth: new FormControl('', [Validators.required, Validators.min(30), Validators.max(250)]),
        age: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
        enabled: [false],
        roles: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('password', 'repeatPassword') })
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

  private makeUserEditFormGroup() {
    this.userEditFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        id: [''],
        nameEdited: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        emailEdited: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(CustomValidators.emailValidationPattern)]),
        sexEdited: new FormControl('', [Validators.required]),
        weightEdited: new FormControl('', [Validators.required, Validators.min(10), Validators.max(1000)]),
        growthEdited: new FormControl('', [Validators.required, Validators.min(30), Validators.max(250)]),
        ageEdited: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
        rolesEdited: new FormControl('', [Validators.required])
      })
    });
  }

  prepareUserEditFormGroup(user: User) {
    this.editedUserName = user.name;
    this.userEditFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        id: [user.id],
        nameEdited: new FormControl(user.name, [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        emailEdited: new FormControl(user.email, [Validators.required, Validators.maxLength(50), Validators.pattern(CustomValidators.emailValidationPattern)]),
        sexEdited: new FormControl(user.sex, [Validators.required]),
        weightEdited: new FormControl(user.weight, [Validators.required, Validators.min(10), Validators.max(1000)]),
        growthEdited: new FormControl(user.growth, [Validators.required, Validators.min(30), Validators.max(250)]),
        ageEdited: new FormControl(user.age, [Validators.required, Validators.min(1), Validators.max(120)]),
        rolesEdited: new FormControl(user.roles, [Validators.required])
      })
    });
  }

  private makeChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        userId: [''],
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword') })
    });
  }

  prepareChangePasswordFormGroup(userId: number) {
    document.getElementById("user-edit-modal-close").click();
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        userId: [userId],
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword') })
    });
  }

  enableUser(user: User) {
    this.userService.enableUser(user.id).subscribe(
      response => {
        $(document.getElementById(`${user.id}-checkbox`)).prop('disabled', true);      
        this.notificationService.sendNotification(NotificationType.SUCCESS, `User '${user.name}' has been enabled`);
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 422) {
          this.getUsersPage();
        }
        this.errorHandlingService.handleErrorResponse(errorResponse);
      }
    );  
  }

  deleteUser(id: number, name: string) {
    if (confirm(`Are you sure want to delete user '${name}'?`)) {
      if (!this.testDataCheckingService.checkTestUser(id, Messages.TEST_DATA_CANNOT_BE_CHANGED)) {
        this.userService.deleteUser(id).subscribe(
          response => {
            this.notificationService.sendNotification(NotificationType.SUCCESS, `The user '${name}' was deleted`);
            this.getUsersPage();
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status == 422) {
              this.getUsersPage();
            }
            this.errorHandlingService.handleErrorResponse(errorResponse);
          }
        );
      }
    }
  }

  // Submit Add User From
  onAddNewUser() {
    if (this.userAddFormGroup.invalid) {
      this.userAddFormGroup.markAllAsTouched();
    } else {
      let newUser = new User(null, this.name.value, this.email.value, this.sex.value, this.weight.value, this.growth.value, this.age.value, this.password.value, this.enabled.value, this.roles.value);
      this.userService.createUser(newUser).subscribe(
        (response: User) => {
          document.getElementById("user-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New user '${response.name}' was created`);
          this.getUsersPage();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "user-add-modal-close");
        }
      );
    }
  }

  // Submit User Edit Form
  onUpdateUser() {
    if (this.userEditFormGroup.invalid) {
      this.userEditFormGroup.markAllAsTouched();
    } else {
      if (!this.testDataCheckingService.checkTestUser(this.id.value, Messages.TEST_DATA_CANNOT_BE_CHANGED)) {
        let adminUserTo = new AdminUserTo(this.id.value, this.nameEdited.value, this.emailEdited.value, this.sexEdited.value, this.weightEdited.value, this.growthEdited.value, this.ageEdited.value, this.rolesEdited.value);
        this.userService.updateUser(adminUserTo).subscribe(
          response => {
            document.getElementById("user-edit-modal-close").click();
            this.notificationService.sendNotification(NotificationType.SUCCESS, `The user '${adminUserTo.name}' has been updated`);
            this.getUsersPage();
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status == 422) {
              this.getUsersPage();
            }
            this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "user-edit-modal-close");
          }
        );
      }
    }
  }

  // Submit Change Password Form
  onChangePassword() {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
    } else {
      let userId = this.changePasswordFormGroup.get('changedPassword.userId').value;
      if (!this.testDataCheckingService.checkTestUser(userId, "Test user's password cannot be changed!")) {
        let newPassword = this.newPassword.value;
        this.userService.changeUserPassword(userId, newPassword).subscribe(
          response => {
            document.getElementById("change-password-modal-close").click();
            this.notificationService.sendNotification(NotificationType.SUCCESS, `Password for '${this.nameEdited.value}' has been updated`);
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status == 422) {
              this.getUsersPage();
            }
            this.errorHandlingService.handleErrorResponseWithButtonClick(errorResponse, "change-password-modal-close");
          }
        );
      }
    }
  }

  refresh() {
    this.refreshing = true;
    (<HTMLInputElement>document.getElementById("inputkeywordField")).value = '';
    this.searchModeActivated = false;
    this.keyword = null;
    this.pageNumber = 1;
    this.listUsers();
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.getUsersPage();
  }

  prepareRoleForShowing(role: string): string {
    return StringUtil.UpperCaseFirstLettersOfWords(role.replace('_', ' '));
  }

  // Getters for userAddFormGroup values
  get name() {
    return this.userAddFormGroup.get('user.name');
  }
  get email() {
    return this.userAddFormGroup.get('user.email');
  }
  get sex() {
    return this.userAddFormGroup.get('user.sex');
  }
  get weight() {
    return this.userAddFormGroup.get('user.weight');
  }
  get growth() {
    return this.userAddFormGroup.get('user.growth');
  }
  get age() {
    return this.userAddFormGroup.get('user.age');
  }
  get enabled() {
    return this.userAddFormGroup.get('user.enabled');
  }
  get roles() {
    return this.userAddFormGroup.get('user.roles');
  }
  get password() {
    return this.userAddFormGroup.get('user.password');
  }
  get repeatPassword() {
    return this.userAddFormGroup.get('user.repeatPassword');
  }

  // Getters for userEditFormGroup values
  get id() {
    return this.userEditFormGroup.get('user.id');
  }
  get nameEdited() {
    return this.userEditFormGroup.get('user.nameEdited');
  }
  get emailEdited() {
    return this.userEditFormGroup.get('user.emailEdited');
  }
  get sexEdited() {
    return this.userEditFormGroup.get('user.sexEdited');
  }
  get weightEdited() {
    return this.userEditFormGroup.get('user.weightEdited');
  }
  get growthEdited() {
    return this.userEditFormGroup.get('user.growthEdited');
  }
  get ageEdited() {
    return this.userEditFormGroup.get('user.ageEdited');
  }
  get rolesEdited() {
    return this.userEditFormGroup.get('user.rolesEdited');
  }

  // Getters for changePasswordFormGroup values
  get newPassword() {
    return this.changePasswordFormGroup.get('changedPassword.newPassword');
  }
  get repeatNewPassword() {
    return this.changePasswordFormGroup.get('changedPassword.repeatNewPassword');
  }
}