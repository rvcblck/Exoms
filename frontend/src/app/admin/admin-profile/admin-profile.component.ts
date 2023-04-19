import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  profileForm: FormGroup = new FormGroup({});

  constructor(private profileService: ProfileService, private formBuilder: FormBuilder) {
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

  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.profileService.getUserInfo(user_id).subscribe(
        (program) => {
          // console.log(program);
        },
        (error) => {
          console.log('Error:', error);
        }
      );
    }
  }
  onSubmit(): void {}
}
