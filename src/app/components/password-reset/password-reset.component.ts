import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PasswordResetService } from 'src/app/services/password-reset.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  token: string;
  resetPasswordFormGroup: FormGroup;

  constructor(private passwordResetService: PasswordResetService, private notificationService: NotificationService, private authenticationService: AuthenticationService,
              private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
    } else {
      this.activatedRoute.queryParams.subscribe(
        params => {
          this.token = params['token'];
          if (!this.token) {
            this.router.navigateByUrl("/login");
            this.notificationService.sendNotification(NotificationType.ERROR, 'Bad password reset token');
          }
        }
      );
      this.makeResetPasswordFormGroup();
    }
  }

  onResetPassword() {
    this.passwordResetService.resetPassword(this.token, this.newPassword.value).subscribe(
      response => {
        this.router.navigateByUrl("/login");
        this.notificationService.sendNotification(NotificationType.SUCCESS, 'Your password has been reset!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
      }
    );
  }

  private makeResetPasswordFormGroup() {
    this.resetPasswordFormGroup = this.formBuilder.group({
      resetedPassword: this.formBuilder.group({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        confirmNewPassword: new FormControl('', [Validators.required])
      }, { validator: this.checkIfMatchingPasswords('newPassword', 'confirmNewPassword') })
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

   // Getters for resetPasswordFormGroup values
   get newPassword() {
    return this.resetPasswordFormGroup.get('resetedPassword.newPassword');
  }
  get confirmNewPassword() {
    return this.resetPasswordFormGroup.get('resetedPassword.confirmNewPassword');
  }
}