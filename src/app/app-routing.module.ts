import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { EnergyBalanceComponent } from './components/energy-balance/energy-balance.component';
import { ExerciseTypeComponent } from './components/exercise-type/exercise-type.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { LoginComponent } from './components/login/login.component';
import { MealComponent } from './components/meal/meal.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ServerStatusComponent } from './components/server-status/server-status.component';
import { UserComponent } from './components/user/user.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthenticationGuard } from './guards/authentication.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify-email', component: EmailVerificationComponent},
  {path: 'reset-password', component: PasswordResetComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'users', component: UserComponent, canActivate: [AdminGuard]},
  {path: 'meals', component: MealComponent, canActivate: [AuthenticationGuard]},
  {path: 'exercise-types', component: ExerciseTypeComponent, canActivate: [AuthenticationGuard]},
  {path: 'exercises', component: ExerciseComponent, canActivate: [AuthenticationGuard]},
  {path: 'energy-balance', component: EnergyBalanceComponent, canActivate: [AuthenticationGuard]},
  {path: 'server-status', component: ServerStatusComponent, canActivate: [AdminGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }