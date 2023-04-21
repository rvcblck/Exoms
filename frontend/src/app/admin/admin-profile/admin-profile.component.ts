import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from 'src/app/profile.model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({});

  user!: Profile;
  private apiUrl = 'http://localhost:8000/api';
  public imageUrl: any;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.profileForm = this.formBuilder.group({
      fname: ['', Validators.required],
      mname: [''],
      lname: ['', Validators.required],
      suffix: [''],
      barangay: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      address: ['', Validators.required],
      gender: [''],
      bday: ['', Validators.required],
      mobile_no: ['', Validators.required],
      email: ['', Validators.required],
      profile_pic: ['']
    });
  }

  getImage() {
    const filename = 'samplepic.jpg';
    return this.http.get(`${this.apiUrl}/images/${filename}`, { responseType: 'blob' });
  }

  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.profileService.getUserInfo(user_id).subscribe(
        (user) => {
          this.user = user;
          console.log(this.user);

          const address = this.user.address;
          if (address) {
            const addressParts = address.split(', ');
            const addressObject = {
              barangay: addressParts[0],
              city: addressParts[1],
              province: addressParts[2]
            };
            this.profileForm.patchValue({
              barangay: addressObject.barangay,
              city: addressObject.city,
              province: addressObject.province
            });
          }

          this.profileForm.patchValue({
            fname: this.user.fname,
            mname: this.user.mname,
            lname: this.user.lname,
            suffix: this.user.suffix,
            gender: this.user.gender,
            bday: this.user.bday,
            mobile_no: this.user.mobile_no,
            email: this.user.email,
            profile_pic: this.user.profile_pic
          });
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }

    this.getImage().subscribe((data: Blob) => {
      const imageUrl = URL.createObjectURL(data);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    });

    // this.profileForm
    // this.profileForm.patchValue({ fname: this.user.fname });
  }
  onSubmit(): void {}
}
