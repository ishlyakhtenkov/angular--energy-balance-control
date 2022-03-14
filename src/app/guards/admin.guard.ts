import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Messages } from '../enums/messages.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserAdmin();
  }

  private isUserAdmin(): boolean {
    if (this.authenticationService.isLoggedIn()) {
      if (this.authenticationService.isAdmin()) {
        return true;
      } else {
        this.router.navigateByUrl('/profile');
        this.notificationService.sendNotification(NotificationType.ERROR, Messages.NOT_HAVE_PERMISSIONS);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      this.notificationService.sendNotification(NotificationType.ERROR, Messages.NEED_LOGIN);
      return false;
    }
  }
}