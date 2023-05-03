import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ErrorComponent } from '../dialog/error/error.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessComponent } from '../dialog/success/success.component';
import { environment } from 'src/environments/environment';

interface RegisterResponse {
  success: boolean;
  message: string;
  email: string;
  password: string;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  errors: any = [];
  submitted = false;
  loadDialog = false;
  assetPath = environment.assetPath;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        fname: ['', [Validators.required]],
        lname: ['', [Validators.required]],
        mname: [''],
        suffix: [''],
        gender: ['', [Validators.required]],
        bday: ['', [Validators.required]],
        mobile_no: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), this.passwordValidator]],
        password_confirmation: ['', Validators.required],
        barangay: ['', [Validators.required]],
        city: ['', [Validators.required]],
        province: ['', [Validators.required]]
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  passwordValidator(control: { value: string }) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(control.value) ? null : { passwordInvalid: true };
  }

  capitalizeWords(value: string): string {
    if (value) {
      return value.replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      return value;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const formattedData = {
      fname: this.capitalizeWords(this.registerForm.get('fname')?.value),
      lname: this.capitalizeWords(this.registerForm.get('lname')?.value),
      mname: this.capitalizeWords(this.registerForm.get('mname')?.value),
      suffix: this.registerForm.get('suffix')?.value,
      gender: this.registerForm.get('gender')?.value,
      bday: this.registerForm.get('bday')?.value,
      mobile_no: this.registerForm.get('mobile_no')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      address:
        this.capitalizeWords(this.registerForm.get('barangay')?.value) +
        ', ' +
        this.capitalizeWords(this.registerForm.get('city')?.value) +
        ', ' +
        this.capitalizeWords(this.registerForm.get('province')?.value)
    };
    this.loadDialog = true;
    this.authService.register(formattedData).subscribe(
      (response) => {
        this.loadDialog = false;
        // console.log(response.message, 'eto yun');
        const message = `${response.message}`;
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      },
      (error) => {
        this.errors.push(error);
        console.log(error);

        this.loadDialog = false;
        const message = `${error.error.message}`;
        const header = 'Error';
        const dialogRef = this.dialog.open(ErrorComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
      }
    );
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const password_confirmation = control.get('password_confirmation');

    if (password && password_confirmation && password.value !== password_confirmation.value) {
      password_confirmation.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (password_confirmation) {
        // remove the passwordMismatch error
        password_confirmation.setErrors(null);
      }
      return null;
    }
  };

  get password_confirmation(): AbstractControl | null {
    return this.registerForm.get('password_confirmation');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
