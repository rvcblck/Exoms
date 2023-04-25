import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  errors: any = [];
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

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
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
        barangay: ['', [Validators.required]],
        city: ['', [Validators.required]],
        province: ['', [Validators.required]]
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const formattedData = {
      fname: this.registerForm.get('fname')?.value,
      lname: this.registerForm.get('lname')?.value,
      mname: this.registerForm.get('mname')?.value,
      suffix: this.registerForm.get('suffix')?.value,
      gender: this.registerForm.get('gender')?.value,
      bday: this.registerForm.get('bday')?.value,
      mobile_no: this.registerForm.get('mobile_no')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      address:
        this.registerForm.get('barangay')?.value + ', ' + this.registerForm.get('city')?.value + ', ' + this.registerForm.get('province')?.value
    };

    this.authService.register(formattedData).subscribe(
      (response) => {
        // console.log(response);
        // clear errors on success
        this.errors = [];
      },
      (error) => {
        this.errors.push(error);
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
}
