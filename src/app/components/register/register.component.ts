import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUserTo } from 'src/app/common/new-user-to';
import { User } from 'src/app/common/user';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProfileService } from 'src/app/services/profile.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerFormGroup: FormGroup;

  constructor(private profileService: ProfileService, private notificationService: NotificationService, private authenticationService: AuthenticationService,
              private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
    } else {
      this.makeRegisterFormGroup();
    }
  }

  makeRegisterFormGroup() {
    this.registerFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(70), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(CustomValidators.emailValidationPattern)]),
        sex: new FormControl('', [Validators.required]),
        weight: new FormControl('', [Validators.required, Validators.min(10), Validators.max(1000)]),
        growth: new FormControl('', [Validators.required, Validators.min(30), Validators.max(250)]),
        age: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
        password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        confirmPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('password', 'confirmPassword') })
    });
  }

  private checkIfMatchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let confirmPasswordInput = group.controls[confirmPasswordKey];
      if (!confirmPasswordInput.value) {
        return confirmPasswordInput.setErrors({ required: true });
      }
      if (passwordInput.value !== confirmPasswordInput.value) {
        return confirmPasswordInput.setErrors({ notEquivalent: true });
      }
      else {
        return confirmPasswordInput.setErrors(null);
      }
    }
  }

  // Submit Register From
  onRegister() {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
    } else {
      let newUserTo = new NewUserTo(this.name.value, this.email.value, this.password.value, this.sex.value, this.weight.value, this.growth.value, this.age.value);
      this.profileService.register(newUserTo).subscribe(
        (response: User) => {
          this.router.navigateByUrl("/login");
          this.notificationService.sendNotification(NotificationType.SUCCESS, `You have been registered! Check your email to confirm registration!`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        }
      );
    }
  }

  // Getters for registerFormGroup values
  get name() {
    return this.registerFormGroup.get('user.name');
  }
  get email() {
    return this.registerFormGroup.get('user.email');
  }
  get sex() {
    return this.registerFormGroup.get('user.sex');
  }
  get weight() {
    return this.registerFormGroup.get('user.weight');
  }
  get growth() {
    return this.registerFormGroup.get('user.growth');
  }
  get age() {
    return this.registerFormGroup.get('user.age');
  }
  get password() {
    return this.registerFormGroup.get('user.password');
  }
  get confirmPassword() {
    return this.registerFormGroup.get('user.confirmPassword');
  }
}