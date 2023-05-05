import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showValidateButton: boolean = false;
  assetPath = environment.assetPath;
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  hidePassword = true;
  loading = false;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (response) => {
        this.loading = false;
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      (error) => {
        this.loading = false;
        if (error === 'Invalid email or password') {
          this.errorMessage = 'Invalid credentials';
        } else if (error === 'Email is not yet validated') {
          this.errorMessage = 'Email is not yet validated';
          this.showValidateButton = true;
        } else {
          this.errorMessage = 'An error occurred while logging in';
        }
      }
    );
  }

  sendEmail() {
    localStorage.setItem('password', this.loginForm.value.password);
    this.loading = true;
    this.authService.sendEmail(this.loginForm.value.email).subscribe(
      (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/verify-email']);
        } else {
        }
      },
      (error) => {
        this.loading = false;
        if (error === 'Invalid email or password') {
          this.errorMessage = 'Invalid credentials';
        } else if (error === 'Email is not yet validated') {
          this.errorMessage = 'Email is not yet validated';
          this.showValidateButton = true;
        } else {
          this.errorMessage = 'An error occurred while logging in';
        }
      }
    );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
