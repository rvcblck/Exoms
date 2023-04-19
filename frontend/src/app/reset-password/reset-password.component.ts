import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { mustMatch } from '../must-match.validator';




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
    private router: Router
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

    this.route.paramMap.subscribe(params => {
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

      this.route.paramMap.subscribe(params => {
      const resetToken = params.get('resetToken');
      console.log(resetToken);
      console.log(password);
      if (resetToken) {
        this.authService.resetPassword(resetToken, password).subscribe(
          (response) => {
            if (response.success) {
              this.isSuccess = true;
              this.successMessage = response.message;
              this.resetForm.reset();
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
