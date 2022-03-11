import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify-email', component: EmailVerificationComponent},
  {path: 'users', component: UserComponent, canActivate: [AdminGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }