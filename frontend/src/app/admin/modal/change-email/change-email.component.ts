import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from 'src/app/profile.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { SuccessComponent } from 'src/app/dialog/success/success.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm: FormGroup = new FormGroup({});
  submited = false;
  emailErrors = '';
  passErrors = '';

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ChangeEmailComponent>,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { email: string }
  ) {
    this.changeEmailForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
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
    return this.changeEmailForm.get('password_confirmation');
  }

  get password(): AbstractControl | null {
    return this.changeEmailForm.get('password');
  }

  onSubmit() {
    this.submited = true;
    this.emailErrors = '';
    this.passErrors = '';

    if (this.changeEmailForm.invalid || this.passErrors || this.emailErrors) {
      return;
    }

    const user_id = localStorage.getItem('user_id');
    const formattedData = {
      user_id: user_id,
      email: this.changeEmailForm.get('email')?.value,
      password: this.changeEmailForm.get('password')?.value
    };

    this.profileService.changeEmail(formattedData).subscribe(
      (response) => {
        const message = 'Email Updated successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });

        this.dialogRef.close();

        localStorage.setItem('password', this.changeEmailForm.get('password')?.value);
        this.authService.sendEmail(this.changeEmailForm.get('email')?.value).subscribe(
          (response) => {
            if (response.success) {
              this.router.navigate(['/verify-email']);
              localStorage.removeItem('token');
              localStorage.removeItem('firstName');
              localStorage.removeItem('role');
            } else {
            }
          },
          (error) => {
            const message = 'Error: something went wrong';
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
      },
      (error) => {
        if (error.error.message === 'Not Available') {
          this.emailErrors = error.error.message;
        } else if (error.error.message === 'Wrong Password') {
          this.passErrors = error.error.message;
        } else {
          const message = 'There is something wrong';
          const header = 'Error';
          const dialogRef = this.dialog.open(ErrorComponent, {
            width: '300px',
            data: {
              header: header,
              message: message
            }
          });
        }
      }
    );
  }
}
