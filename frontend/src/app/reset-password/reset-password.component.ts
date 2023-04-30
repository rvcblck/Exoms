import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { mustMatch } from '../must-match.validator';
import { SuccessComponent } from '../dialog/success/success.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isTokenValid = true;
  errorMessage = '';
  isSuccess: boolean = false;
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: mustMatch('password', 'confirmPassword')
      }
    );

    this.route.paramMap.subscribe((params) => {
      const resetToken = params.get('resetToken');
      this.authService.checkResetToken(resetToken || '').subscribe(
        () => {
          this.isTokenValid = true;
        },
        (error) => {
          this.isTokenValid = false;
          this.errorMessage = error;
        }
      );
    });
  }

  onSubmit(): void {
    const group = this.resetForm.controls;

    if (this.resetForm.invalid) {
      return;
    }

    const password = group['password'].value;

    this.route.paramMap.subscribe((params) => {
      const resetToken = params.get('resetToken');

      if (resetToken) {
        this.authService.resetPassword(resetToken, password).subscribe(
          (response) => {
            if (response.success) {
              this.isSuccess = true;
              this.successMessage = response.message;
              this.resetForm.reset();

              const message = `${response.message}`;
              const header = 'Success';
              const dialogRef = this.dialog.open(SuccessComponent, {
                width: '300px',
                data: {
                  header: header,
                  message: message
                }
              });
              this.router.navigate(['/login']);
            }
          },
          (error) => {
            this.errorMessage = error;
          }
        );
      }
    });
  }
}
