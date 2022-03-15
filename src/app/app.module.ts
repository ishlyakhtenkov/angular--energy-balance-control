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
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './components/user/user.component';
import { HeaderComponent } from './components/header/header.component';
import { RegisterComponent } from './components/register/register.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { EmailVerificationService } from './services/email-verification.service';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ErrorHandlingService } from './services/error-handling.service';
import { TestDataCheckingService } from './services/test-data-checking.service';
import { PasswordResetService } from './services/password-reset.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MealComponent } from './components/meal/meal.component';
import { MealService } from './services/meal.service';
import { ExerciseTypeComponent } from './components/exercise-type/exercise-type.component';
import { ExerciseTypeService } from './services/exercise-type.service';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { ExerciseService } from './services/exercise.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EnergyBalanceComponent } from './components/energy-balance/energy-balance.component';

FullCalendarModule.registerPlugins([interactionPlugin, dayGridPlugin]);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    HeaderComponent,
    RegisterComponent,
    EmailVerificationComponent,
    PasswordResetComponent,
    ProfileComponent,
    MealComponent,
    ExerciseTypeComponent,
    ExerciseComponent,
    EnergyBalanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotificationModule,
    NgbModule,
    NgSelectModule,
    FullCalendarModule
  ],
  providers: [AuthenticationService, ProfileService, UserService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
     AuthenticationGuard, AdminGuard, NotificationService, EmailVerificationService, PasswordResetService, ErrorHandlingService, TestDataCheckingService, 
     MealService, ExerciseTypeService, ExerciseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
