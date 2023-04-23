import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from 'src/app/profile.service';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-img',
  templateUrl: './edit-img.component.html',
  styleUrls: ['./edit-img.component.css']
})
export class EditImgComponent implements OnInit {
  changePicForm: FormGroup = new FormGroup({});
  profile_pic: any;
  submitted = false;

  @ViewChild('imgFileName', { static: false }) imgFileName!: ElementRef;
  @ViewChild('profile_pic') profile_pic_input!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<EditImgComponent>,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.changePicForm = this.formBuilder.group({
      profile_pic: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  onImgFileSelected(event: any, controlName: string) {
    // this.edithMoa = true;
    const file = event.target.files[0];
    const allowedExtensions = ['png', 'jpeg', 'jpg'];
    const maxFileSize = 5048; // in KB

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop();

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      this.changePicForm.get(controlName)?.setErrors({ invalidExtension: true });
      event.target.value = ''; // clear the file input
    } else if (file.size > maxFileSize * 1024) {
      this.changePicForm.get(controlName)?.setErrors({ max: true });
      event.target.value = ''; // clear the file input
    } else {
      this.profile_pic = file;
      console.log(file.name);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const previewImg = document.getElementById('preview-img');
        if (previewImg) {
          previewImg.setAttribute('src', reader.result as string);
        }
      };

      setTimeout(() => {
        this.imgFileName.nativeElement.innerHTML = file.name;
      }, 0);
    }
  }

  removeImg() {
    this.profile_pic = null;
    // this.moaFile = null;
    // this.edithMoa = false;
    const inputElement = document.getElementById('profile-img') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    this.imgFileName.nativeElement.innerHTML = '';
  }
  onSubmit(): void {
    this.submitted = true;
    const formData = new FormData();
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      formData.append('user_id', user_id);
    }

    if (this.profile_pic) {
      formData.append('profile_pic', this.profile_pic);
    }
    this.profileService.updateProfilePic(formData).subscribe(
      (program) => {
        console.log('Program created successfully:', program);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error creating program:', error);
      }
    );
  }
}
