import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from 'src/app/account.service';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';
import { SuccessComponent } from 'src/app/dialog/success/success.component';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    public dialogRef: MatDialogRef<CreateAccountComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  registerForm: FormGroup = new FormGroup({});
  errors: any = [];
  submitted = false;
  emailError = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      mname: [''],
      suffix: [''],
      gender: ['', [Validators.required]],
      bday: ['', [Validators.required]],
      mobile_no: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      barangay: ['', [Validators.required]],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.openConfirmationDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openConfirmationDialog(): void {
    const message = 'Are you sure you want to submit the form?';
    const header = 'Creating new partner';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        header: header,
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // The user confirmed the action, submit the form
        this.submitForm();
      }
    });
  }
  capitalizeWords(value: string): string {
    if (value) {
      return value.replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      return value;
    }
  }

  submitForm() {
    const formattedData = {
      fname: this.capitalizeWords(this.registerForm.get('fname')?.value),
      lname: this.capitalizeWords(this.registerForm.get('lname')?.value),
      mname: this.capitalizeWords(this.registerForm.get('mname')?.value),
      suffix: this.registerForm.get('suffix')?.value,
      gender: this.registerForm.get('gender')?.value,
      bday: this.registerForm.get('bday')?.value,
      mobile_no: this.registerForm.get('mobile_no')?.value,
      email: this.registerForm.get('email')?.value,
      address:
        this.capitalizeWords(this.registerForm.get('barangay')?.value) +
        ', ' +
        this.capitalizeWords(this.registerForm.get('city')?.value) +
        ', ' +
        this.capitalizeWords(this.registerForm.get('province')?.value)
    };

    // console.log(formattedData);

    this.accountService.createAccount(formattedData).subscribe(
      (response) => {
        this.dialogRef.close(true);
        const message = 'Creating Account Successfully';
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
        if (error.error.error === 'Email is already registered') {
          this.emailError = 'Email is already registered';
        }
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
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
