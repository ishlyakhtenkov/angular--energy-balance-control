import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/common/user';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProfileService } from 'src/app/services/profile.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading: boolean;
  private subscriptions: Subscription[] = [];
  sendNewVerifyEmailFormGroup: FormGroup;
  sendPasswordResetEmailFormGroup: FormGroup;

  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService, private formBuilder: FormBuilder, 
              private profileService: ProfileService) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.navigateByUrlAccordingToTheRole();
    } else {
      this.makeSendNewVerifyEmailFormGroup();
      this.makeSendPasswordResetEmailFormGroup();
    }
  }

  onLogin(email: string, password: string): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(email, password).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get('Authorization-Token');
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body);
          this.navigateByUrlAccordingToTheRole();
          this.showLoading = false;
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Welcome, ${response.body.name}!`);
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 403) {
            this.showLoading = false;
            document.getElementById("emailNotVerified-modal-open").click();
          } else {
            this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
            this.showLoading = false;  
          }
        }
      )
    );
  }

  private navigateByUrlAccordingToTheRole() {
    let url: string;
    if (this.authenticationService.isAdmin()) {
      url = '/users';
    } else {
      // url = '/energy-balance';
      url = '/profile';
    }
    this.router.navigateByUrl(url);
  }

  makeSendNewVerifyEmailFormGroup() {
    this.sendNewVerifyEmailFormGroup = this.formBuilder.group({
      newVerifyEmail: this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(CustomValidators.emailValidationPattern)]),
      })
    });
  }

  makeSendPasswordResetEmailFormGroup() {
    this.sendPasswordResetEmailFormGroup = this.formBuilder.group({
      passwordResetEmail: this.formBuilder.group({
        emailForPassReset: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(CustomValidators.emailValidationPattern)]),
      })
    });
  }

  // Submit Send New Verify Email Form
  onSendNewVerifyEmail() {
    if (this.sendNewVerifyEmailFormGroup.invalid) {
      this.sendNewVerifyEmailFormGroup.markAllAsTouched();
    } else {
      let email = this.email.value;
      this.profileService.sendEmailVerify(email).subscribe(
        response => {
          document.getElementById("sendNewVerifyEmail-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `New email verification sent. Check your email!`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        }
      );
    }
  }

  // Submit Password Reset Email Form
  onSendPasswordResetEmail() {
    if (this.sendPasswordResetEmailFormGroup.invalid) {
      this.sendPasswordResetEmailFormGroup.markAllAsTouched();
    } else {
      let email = this.emailForPassReset.value;
      this.profileService.sendPasswordResetEmail(email).subscribe(
        response => {
          document.getElementById("sendPasswordResetEmail-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Password reset email sent. Check your email!`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());   
  }

  // Getters for sendNewVerifyEmailFormGroup value
  get email() {
    return this.sendNewVerifyEmailFormGroup.get('newVerifyEmail.email');
  }

  // Getters for sendPasswordResetEmailFormGroup value
  get emailForPassReset() {
    return this.sendPasswordResetEmailFormGroup.get('passwordResetEmail.emailForPassReset');
  }
  
  loginAsAdmin(): void {
    this.onLogin('admin@gmail.com', 'admin');
  }

  loginAsUser(): void {
    this.onLogin('user@gmail.com', 'password');
  }
}