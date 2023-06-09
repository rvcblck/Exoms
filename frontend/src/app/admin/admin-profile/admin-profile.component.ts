import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from 'src/app/profile.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeEmailComponent } from '../modal/change-email/change-email.component';
import { ChangePasswordComponent } from '../modal/change-password/change-password.component';
import { EditImgComponent } from '../modal/edit-img/edit-img.component';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { SuccessComponent } from 'src/app/dialog/success/success.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';
import { environment } from 'src/environments/environment';
import { TitleService } from 'src/app/title.service';
// import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({});
  submitted = false;
  assetPath = environment.assetPath;

  public user: Profile | undefined;
  private apiUrl = environment.apiUrl;
  public imageUrl: any;
  showAccountInfo = false;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private adminLayout: AdminLayoutComponent,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef, // private titleCasePipe: TitleCasePipe
    private titleService: TitleService
  ) {
    this.profileForm = this.formBuilder.group({
      fname: ['', Validators.required],
      mname: [''],
      lname: ['', Validators.required],
      suffix: [''],
      address: [''],
      barangay: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      gender: ['', Validators.required],
      bday: ['', Validators.required],
      mobile_no: ['', Validators.required]
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return headers;
  }

  getImage() {
    const user_id = localStorage.getItem('user_id');
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/profile-image/${user_id}`, { headers, responseType: 'blob' });
  }

  ngOnInit(): void {
    const pageTitle = 'Profile';
    this.titleService.titleChange.emit(pageTitle);
    this.cdr.detectChanges();

    this.getProfile();

    this.refreshImage();

    const toggleCheckbox = document.getElementById('switch-toggle');
    const accountInfo = document.querySelector('.account-info');
    const breakpoint = 768; // Set your desired breakpoint for mobile devices here

    toggleCheckbox?.addEventListener('change', () => {
      if (window.innerWidth < breakpoint) {
        accountInfo?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  refreshImage() {
    this.getImage().subscribe((data: Blob) => {
      const imageUrl = URL.createObjectURL(data);

      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    });
  }

  getProfile() {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.profileService.getUserInfo(user_id).subscribe(
        (user) => {
          this.user = user;

          const address = user.address;
          var addressObject = { barangay: '', city: '', province: '' };
          if (address) {
            const addressParts = address.split(', ');
            addressObject = {
              barangay: addressParts[0],
              city: addressParts[1],
              province: addressParts[2]
            };
          }
          this.profileForm = this.formBuilder.group({
            fname: [user.fname, Validators.required],
            mname: [user.mname],
            lname: [user.lname, Validators.required],
            suffix: [user.suffix],
            address: [''],
            barangay: [addressObject.barangay, Validators.required],
            city: [addressObject.city, Validators.required],
            province: [addressObject.province, Validators.required],
            gender: [user.gender, Validators.required],
            bday: [user.bday, Validators.required],
            mobile_no: [user.mobile_no, Validators.required]
          });
        },
        (error) => {}
      );
    }
  }

  toggleAccountInfo(): boolean {
    const checkbox = document.getElementById('switch-toggle') as HTMLInputElement;
    return checkbox.checked;
  }

  getAge(birthdate: string): number {
    const today = new Date();
    const birthdateObj = new Date(birthdate);
    let age = today.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = today.getMonth() - birthdateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateObj.getDate())) {
      age--;
    }
    return age;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    this.openConfirmationDialog();
  }
  openConfirmationDialog(): void {
    const message = 'Are you sure you want to submit the form?';
    const header = 'Updating Profile';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        header: header,
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submitForm();
      }
    });
  }

  changeEmail(): void {
    const dialogRef = this.dialog.open(ChangeEmailComponent, {
      data: { email: this.user?.email },
      maxWidth: '90%',
      minWidth: '40%'
    });
  }
  changePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      maxWidth: '90%',
      minWidth: '40%'
    });
  }

  editImg() {
    const dialogRef = this.dialog.open(EditImgComponent, {
      maxWidth: '90%',
      minWidth: '40%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshImage();
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
    const address =
      this.profileForm.get('barangay')?.value + ', ' + this.profileForm.get('city')?.value + ', ' + this.profileForm.get('province')?.value;
    this.profileForm.patchValue({ address: address });

    const formattedData = {
      user_id: this.user?.user_id,
      fname: this.capitalizeWords(this.profileForm.get('fname')?.value),
      lname: this.capitalizeWords(this.profileForm.get('lname')?.value),
      mname: this.capitalizeWords(this.profileForm.get('mname')?.value),
      suffix: this.profileForm.get('suffix')?.value,
      gender: this.profileForm.get('gender')?.value,
      bday: this.profileForm.get('bday')?.value,
      mobile_no: this.profileForm.get('mobile_no')?.value,
      address: this.capitalizeWords(this.profileForm.get('address')?.value)
    };

    this.profileService.updateProfile(formattedData).subscribe(
      (response) => {
        const message = 'Profile updated successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
        this.getProfile();
        this.refreshImage();
      },
      (error) => {
        const message = 'Error Updating Accounts';
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
}
