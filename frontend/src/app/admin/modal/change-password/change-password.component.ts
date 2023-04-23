import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from 'src/app/profile.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePassForm: FormGroup = new FormGroup({});
  submited = false;
  oldPassErrors = '';
  newPassErrors = '';

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.changePassForm = this.formBuilder.group(
      {
        old_password: ['', [Validators.required, Validators.minLength(6)]],
        new_password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required]
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('new_password');
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
    return this.changePassForm.get('password_confirmation');
  }

  get password(): AbstractControl | null {
    return this.changePassForm.get('new_password');
  }

  onSubmit() {
    this.submited = true;
    this.oldPassErrors = '';
    this.newPassErrors = '';

    if (this.changePassForm.invalid || this.oldPassErrors) {
      return;
    }

    const user_id = localStorage.getItem('user_id');
    const formattedData = {
      user_id: user_id,
      old_password: this.changePassForm.get('old_password')?.value,
      new_password: this.changePassForm.get('new_password')?.value
    };

    this.profileService.changePass(formattedData).subscribe(
      (response) => {
        console.log('Email Updated successfully');

        this.dialogRef.close();
      },
      (error) => {
        console.log('error', error);

        if (error.error.message === 'Wrong Password') {
          this.oldPassErrors = error.error.message;
        } else if (error.error.message === 'You cant set the same password') {
          this.newPassErrors = error.error.message;
        } else {
          console.log('Something went wrong');
        }
      }
    );
  }
}