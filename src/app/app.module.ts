import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NotificationModule } from './notification.module';
import { AuthenticationService } from './services/authentication.service';
import { NotificationService } from './services/notification.service';
import { ProfileService } from './services/profile.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule
  ],
  providers: [AuthenticationService, ProfileService, UserService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
     AuthenticationGuard, AdminGuard, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
