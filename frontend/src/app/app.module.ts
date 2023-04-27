import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { ProgramManagementComponent } from './admin/program-management/program-management.component';
import { PartnerManagementComponent } from './admin/partner-management/partner-management.component';
import { AccountManagementComponent } from './admin/account-management/account-management.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { AccountInfoComponent } from './admin/modal/account-info/account-info.component';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { CreateAccountComponent } from './admin/modal/create-account/create-account.component';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateProgramComponent } from './admin/modal/create-program/create-program.component';
import { ViewProgramComponent } from './admin/modal/view-program/view-program.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ViewPartnerComponent } from './admin/modal/view-partner/view-partner.component';
import { CreatePartnerComponent } from './admin/modal/create-partner/create-partner.component';
import { ExtensionComponent } from './user/extension/extension.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { ConfirmComponent } from './dialog/confirm/confirm.component';
import { AttendanceComponent } from './user/attendance/attendance.component';
import { AddDateComponent } from './user/add-date/add-date.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ChangeEmailComponent } from './admin/modal/change-email/change-email.component';
import { ChangePasswordComponent } from './admin/modal/change-password/change-password.component';
import { EditImgComponent } from './admin/modal/edit-img/edit-img.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProgFlowComponent } from './user/prog-flow/prog-flow.component';

import * as CanvasJSAngularChart from '../assets/js/canvasjs/canvasjs.angular.component';
import { ProgTopicComponent } from './user/prog-topic/prog-topic.component';
import { SelectProgramComponent } from './user/modal/select-program/select-program.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
// import { DragulaService } from 'ng2-dragula';
import { DragAndDropModule } from 'angular-draggable-droppable';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    PublicLayoutComponent,
    AdminLayoutComponent,
    UserDashboardComponent,
    UserLayoutComponent,
    ProgramManagementComponent,
    PartnerManagementComponent,
    AccountManagementComponent,
    ReportsComponent,
    AdminProfileComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AccountInfoComponent,
    CreateAccountComponent,
    CreateProgramComponent,
    ViewProgramComponent,
    ViewPartnerComponent,
    CreatePartnerComponent,
    ExtensionComponent,
    UserProfileComponent,
    ConfirmComponent,
    AttendanceComponent,
    AddDateComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    EditImgComponent,
    CanvasJSChart,
    ProgTopicComponent,
    SelectProgramComponent,
    ProgFlowComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    NgxPaginationModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatDialogModule,
    MatCardModule,
    MatRippleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressBarModule,
    MatStepperModule,
    MatTabsModule,
    // DragulaModule
    // NgChartsModule
  ],
  exports: [MatTableModule, MatCheckboxModule, CreateProgramComponent],
  entryComponents: [AccountInfoComponent],
  providers: [DatePipe, MatDialogConfig],
  bootstrap: [AppComponent]
})
export class AppModule {}
