import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      (error) => {
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
    localStorage.setItem('password', this.password);
    this.authService.sendEmail(this.email).subscribe(
      (response) => {
        if (response.success) {
          this.router.navigate(['/verify-email']);
        } else {
        }
      },
      (error) => {
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
}
