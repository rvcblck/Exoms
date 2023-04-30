import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SuccessComponent } from '../dialog/success/success.component';
import { ErrorComponent } from '../dialog/error/error.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  emailForm: FormGroup = new FormGroup({});
  errorMessage: string = '';
  successMessage: string = '';
  loading = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.loading = true;
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      localStorage.setItem('email', email);
      this.authService.sendPasswordResetEmail(email).subscribe(
        (response: any) => {
          this.loading = false;
          const message = `${response.message}`;
          const header = 'Success';
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
          console.log(response.message);
        },
        (error: any) => {
          this.loading = false;
          const message = `Error verifying email, ${error.error.message}`;
          const header = 'Error';
          const dialogRef = this.dialog.open(ErrorComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
          console.log(error.error.message);
        }
      );
    }
  }
}
