import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthGuard, UserGuard, AdminGuard } from './auth.guard';
import { RegisterComponent } from './register/register.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { ProgramManagementComponent } from './admin/program-management/program-management.component';
import { PartnerManagementComponent } from './admin/partner-management/partner-management.component';
import { AccountManagementComponent } from './admin/account-management/account-management.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ExtensionComponent } from './user/extension/extension.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'verify-email',
        component: VerifyEmailComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'reset-password/:resetToken',
        component: ResetPasswordComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'program-management',
        component: ProgramManagementComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'partner-management',
        component: PartnerManagementComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'account-management',
        component: AccountManagementComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: 'admin-profile',
        component: AdminProfileComponent,
        canActivate: [AuthGuard, AdminGuard]
      }
    ]
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: UserDashboardComponent,
        canActivate: [AuthGuard, UserGuard]
      },
      {
        path: 'my-extension',
        component: ExtensionComponent,
        canActivate: [AuthGuard, UserGuard]
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [AuthGuard, UserGuard]
      }
    ]
  }

  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  // { path: '', component: HomeComponent },
  // { path: 'user/dashboard', component: UserComponent, canActivate: [AuthGuard, UserGuard] },
  // { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
