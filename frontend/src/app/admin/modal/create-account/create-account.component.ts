import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountService } from 'src/app/account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {


  constructor(
    private fb: FormBuilder, private accountService: AccountService,
    public dialogRef: MatDialogRef<CreateAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  registerForm: FormGroup = new FormGroup({});
  errors: any = [];
  submitted = false;


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
      // password: ['', [Validators.required, Validators.minLength(6)]],
      // password_confirmation: ['', Validators.required],
      city: ['', [Validators.required]],
      province: ['', [Validators.required]],
    });
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
      // password: this.registerForm.get('password')?.value,
      address : this.registerForm.get('city')?.value + ', ' + this.registerForm.get('province')?.value

    };

    this.accountService.createAccount(formattedData).subscribe(
      (response) => {
        console.log(response);
        this.dialogRef.close();
        this.errors = [];
      },
      (error) => {
        this.errors.push(error);
      }
    );
  }

  // passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  //   const password = control.get('password');
  //   const password_confirmation = control.get('password_confirmation');

  //   if (password && password_confirmation && password.value !== password_confirmation.value) {
  //     password_confirmation.setErrors({ 'passwordMismatch': true });
  //     return { 'passwordMismatch': true };
  //   } else {
  //     if (password_confirmation) {
  //       // remove the passwordMismatch error
  //       password_confirmation.setErrors(null);
  //     }
  //     return null;
  //   }
  // };

  // get password_confirmation(): AbstractControl | null {
  //   return this.registerForm.get('password_confirmation');
  // }

  // get password(): AbstractControl | null {
  //   return this.registerForm.get('password');
  // }

  onCancel(): void {
    this.dialogRef.close();
  }

}
