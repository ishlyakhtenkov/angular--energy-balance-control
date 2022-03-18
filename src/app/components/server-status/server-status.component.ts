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
  refreshing: boolean = true;
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
    this.checkGatewayServerAndBehindGatewayServicesStatuses();
    this.checkEurekaServerServiceStatus();
    this.checkConfigServerServiceStatus();
  }

  private getRefreshingValue(): boolean {
    return (this.bxServiceStatus == null) || (this.configServerServiceStatus == null) || (this.emailVerificationServiceStatus == null) || (this.energyBalanceServiceStatus == null) ||
           (this.eurekaServerServiceStatus == null) || (this.gatewayServerServiceStatus == null) || (this.mealServiceStatus == null) || (this.passwordResetServiceStatus == null) ||
           (this.trainingServiceStatus == null) || (this.userServiceStatus == null)
  }

  refresh() {
    this.refreshing = true;
    this.bxServiceStatus = null;
    this.configServerServiceStatus = null;
    this.emailVerificationServiceStatus = null;
    this.energyBalanceServiceStatus = null;
    this.eurekaServerServiceStatus = null;
    this.gatewayServerServiceStatus = null;
    this.mealServiceStatus = null;
    this.passwordResetServiceStatus = null;
    this.trainingServiceStatus = null;
    this.userServiceStatus = null;
    this.ngOnInit();
  }

  updateConfiguration() {
    if (confirm(`Are you sure want to update services configuration?`)) {
      this.updating = true;
      this.bxServiceStatus = null;
      this.configServerServiceStatus = null;
      this.emailVerificationServiceStatus = null;
      this.energyBalanceServiceStatus = null;
      this.eurekaServerServiceStatus = null;
      this.gatewayServerServiceStatus = null;
      this.mealServiceStatus = null;
      this.passwordResetServiceStatus = null;
      this.trainingServiceStatus = null;
      this.userServiceStatus = null;
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

  private checkConfigServerServiceStatus() {
    this.serverStatusService.checkConfigServerServiceHealth().subscribe(
      response => {
        this.configServerServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.configServerServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkEurekaServerServiceStatus() {
    this.serverStatusService.checkEurekaServerServiceHealth().subscribe(
      response => {
        this.eurekaServerServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.eurekaServerServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkGatewayServerAndBehindGatewayServicesStatuses() {
    this.serverStatusService.checkGatewayServerServiceHealth().subscribe(
      response => {
        this.gatewayServerServiceStatus = response.status == 'UP';
        if (this.gatewayServerServiceStatus == true) {
          this.checkBehindGatewayServicesStatuses();
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.gatewayServerServiceStatus = false;
        this.setBehindGatewayServicesStatusesDown();
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkBehindGatewayServicesStatuses() {
    this.checkBxServiceStatus();
    this.checkEmailVerificationServiceStatus();
    this.checkEnergyBalanceServiceStatus();
    this.checkMealServiceStatus();
    this.checkPasswordResetServiceStatus();
    this.checkTrainingServiceStatus();
    this.checkUserServiceStatus();
  }

  private setBehindGatewayServicesStatusesDown() {
    this.bxServiceStatus = false;
    this.emailVerificationServiceStatus = false;
    this.energyBalanceServiceStatus = false;
    this.mealServiceStatus = false;
    this.passwordResetServiceStatus = false;
    this.trainingServiceStatus = false;
    this.userServiceStatus = false;
  }

  private checkBxServiceStatus() {
    this.serverStatusService.checkBxServiceHealth().subscribe(
      response => {
        this.bxServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.bxServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkEmailVerificationServiceStatus() {
    this.serverStatusService.checkEmailVerificationServiceHealth().subscribe(
      response => {
        this.emailVerificationServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.emailVerificationServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkEnergyBalanceServiceStatus() {
    this.serverStatusService.checkEnergyBalanceServiceHealth().subscribe(
      response => {
        this.energyBalanceServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.energyBalanceServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkMealServiceStatus() {
    this.serverStatusService.checkMealServiceHealth().subscribe(
      response => {
        this.mealServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.mealServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkPasswordResetServiceStatus() {
    this.serverStatusService.checkPasswordResetServiceHealth().subscribe(
      response => {
        this.passwordResetServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.passwordResetServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkTrainingServiceStatus() {
    this.serverStatusService.checkTrainingServiceHealth().subscribe(
      response => {
        this.trainingServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.trainingServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }

  private checkUserServiceStatus() {
    this.serverStatusService.checkUserServiceHealth().subscribe(
      response => {
        this.userServiceStatus = response.status == 'UP';
        this.refreshing = this.getRefreshingValue();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorHandlingService.handleErrorResponseWithoutNotification(errorResponse);
        this.userServiceStatus = false;
        this.refreshing = this.getRefreshingValue();
      }
    );
  }
}