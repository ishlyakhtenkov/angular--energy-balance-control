import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmailVerificationService } from 'src/app/services/email-verification.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

  constructor(private emailVerificationService: EmailVerificationService, private notificationService: NotificationService, private authenticationService: AuthenticationService, 
              private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl("/login");
    } else {
      this.activatedRoute.queryParams.subscribe(
        params => {
          const token = params['token'];
          this.verifyEmail(token);
        }
      );
    }
  }

  private verifyEmail(token: string) {
    this.router.navigateByUrl("/login");
    if (token) {
      this.emailVerificationService.verifyEmail(token).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, 'Your email has been verified');
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        }
      );
    } else {
      this.notificationService.sendNotification(NotificationType.ERROR, 'Bad email verification token');
    }
  }
}