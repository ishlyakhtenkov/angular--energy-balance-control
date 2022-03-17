import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ServerStatusService } from 'src/app/services/server-status.service';

@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.css']
})
export class ServerStatusComponent implements OnInit {
  refreshing: boolean;
  updating: boolean;
  bxServiceStatus: boolean;
  configServerServiceStatus: boolean;
  emailVerificationServiceStatus: boolean;
  energyBalanceServiceStatus: boolean;
  eurekaServerServiceStatus: boolean;
  gatewayServerServiceStatus: boolean;
  mealServiceStatus: boolean;
  passwordResetServiceStatus: boolean;
  trainingServiceStatus: boolean;
  userServiceStatus: boolean;

  constructor(private serverStatusService: ServerStatusService, private errorHandlingService: ErrorHandlingService, 
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.checkBxServiceStatus();
    this.checkConfigServerServiceStatus();
    this.checkEmailVerificationServiceStatus();
    this.checkEnergyBalanceServiceStatus();
    this.checkEurekaServerServiceStatus();
    this.checkGatewayServerServiceStatus();
    this.checkMealServiceStatus();
    this.checkPasswordResetServiceStatus();
    this.checkTrainingServiceStatus();
    this.checkUserServiceStatus();
  }

  refresh() {
    this.refreshing = true;
    this.ngOnInit();
  }

  updateConfiguration() {
    if (confirm(`Are you sure want to update services configuration?`)) {
      this.updating = true;
      this.serverStatusService.updateConfiguration().subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Services confuguration has been updated!`);
          this.updating = false;
          this.ngOnInit();
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorHandlingService.handleErrorResponse(errorResponse);
          this.updating = false;
          this.ngOnInit();
        }
      );
    }
  }

  checkBxServiceStatus() {
    this.serverStatusService.checkUserServiceHealth().subscribe(
      response => {
        this.userServiceStatus = response.status == 'UP';
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.userServiceStatus = false;
      }
    );
  }

  checkUserServiceStatus() {
    this.serverStatusService.checkUserServiceHealth().subscribe(
      response => {
        this.userServiceStatus = response.status == 'UP';
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.userServiceStatus = false;
      }
    );
  }
}