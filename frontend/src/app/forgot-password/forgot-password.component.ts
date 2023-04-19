import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailForm: FormGroup = new FormGroup({});
  errorMessage: string = '';
  successMessage: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.authService.sendPasswordResetEmail(email).subscribe(
        (response: any) => {
          if (response && response.message) {
            this.successMessage = response.message;
            this.errorMessage = "";
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        },
        (error: any) => {
          this.successMessage = "";
          if (error.status === 404) {
            this.errorMessage = 'This email is not registered.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      );
    }
  }


}
