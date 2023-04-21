import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fileValidator } from 'src/app/file-type.validator';
import { DatePipe } from '@angular/common';
import { PartnerService } from 'src/app/partner.service';
import { FileUploader } from 'ng2-file-upload';
import { FileItem } from 'ng2-file-upload';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewPartner } from 'src/app/partner.model';
import { ImageService } from 'src/app/image.service';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.css']
})
export class CreatePartnerComponent implements OnInit {
  partnerForm: FormGroup = new FormGroup({});
  submitted = false;
  moaFile: any;
  profileFile: any;
  invalidExtension = false;
  edithMoa = false;

  @ViewChild('moaFileName', { static: false }) moaFileName!: ElementRef;
  @ViewChild('moaFileSize') moaFileSize!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private partnerService: PartnerService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CreatePartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { partner: ViewPartner },
    private imageService: ImageService
  ) {
    if (data) {
      const address = data.partner.address;
      const addressParts = address.split(', ');
      const addressObject = {
        barangay: addressParts[0],
        city: addressParts[1],
        province: addressParts[2]
      };

      const latestContract = data.partner.contracts.reduce((latest, current) => {
        const latestStartDate = new Date(latest.start_date);
        const currentStartDate = new Date(current.start_date);
        return currentStartDate > latestStartDate ? current : latest;
      }, data.partner.contracts[0]);

      const startDate = latestContract.start_date;
      const endDate = latestContract.end_date;

      if (data.partner.moa_file) {
        this.edithMoa = true;
        // this.dlInv = true;
        this.viewFiles();
      }
      console.log(this.data.partner.moaFile_content.fileName, this.data.partner.moaFile_content.fileSize, this.data.partner.moaFile_content.fileExt);

      this.partnerForm = this.formBuilder.group({
        company_name: [data.partner.company_name, Validators.required],
        address: [''],
        contact_person: [data.partner.contact_person, Validators.required],
        contact_no: [data.partner.contact_no, Validators.required],
        start_date: [startDate, Validators.required],
        end_date: [endDate, Validators.required],
        moa_file: [null],
        address_barangay: [addressObject.barangay, Validators.required],
        address_city: [addressObject.city, Validators.required],
        address_province: [addressObject.province, Validators.required]
      });
    } else {
      this.partnerForm = this.formBuilder.group({
        company_name: ['', Validators.required],
        address: [''],
        contact_person: ['', Validators.required],
        contact_no: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        moa_file: [null],
        address_barangay: ['', Validators.required],
        address_city: ['', Validators.required],
        address_province: ['', Validators.required]
      });
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.data) {
      if (this.partnerForm.invalid) {
        return;
      }
    } else {
      if (this.partnerForm.invalid || !this.moaFile) {
        return;
      }
    }

    this.openConfirmationDialog();
  }

  viewFiles() {
    if (this.data) {
      setTimeout(() => {
        this.moaFileName.nativeElement.innerHTML = this.data.partner.moaFile_content.fileName;
      }, 0);
      setTimeout(() => {
        this.moaFileSize.nativeElement.innerHTML = (this.data.partner.moaFile_content.fileSize / (1024 * 1024)).toFixed(2) + ' MB';
      }, 0);
      setTimeout(() => {
        const extension = this.data.partner.moaFile_content.fileExt;
        const invIcon = document.getElementById('moaIcon');
        if (invIcon) {
          if (extension === 'pdf') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f;"></i>';
          } else if (extension === 'docx') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f;"></i>';
          } else {
            invIcon.innerHTML = '';
          }
        }
      }, 0);
    }
  }

  onMoaFileSelected(event: any, controlName: string) {
    this.edithMoa = true;
    const file = event.target.files[0];
    const allowedExtensions = ['pdf', 'docx'];
    const maxFileSize = 5048; // in KB

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop();

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      this.partnerForm.get(controlName)?.setErrors({ invalidExtension: true });
      event.target.value = ''; // clear the file input
    } else if (file.size > maxFileSize * 1024) {
      this.partnerForm.get(controlName)?.setErrors({ max: true });
      event.target.value = ''; // clear the file input
    } else {
      this.moaFile = file;
      console.log(file.name);
      setTimeout(() => {
        this.moaFileName.nativeElement.innerHTML = file.name;
      }, 0);
      setTimeout(() => {
        this.moaFileSize.nativeElement.innerHTML = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      }, 0);
      setTimeout(() => {
        const invIcon = document.getElementById('moaIcon');
        if (invIcon) {
          if (extension === 'pdf') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f;"></i>';
          } else if (extension === 'docx') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f;"></i>';
          } else {
            invIcon.innerHTML = '';
          }
        }
      }, 0);
    }
  }

  removeMoa() {
    this.moaFile = null;
    this.edithMoa = false;
    const inputElement = document.getElementById('moa-upload') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    this.moaFileName.nativeElement.innerHTML = '';
    this.moaFileSize.nativeElement.innerHTML = '';
    const invIcon = document.getElementById('moaIcon');
    if (invIcon) {
      invIcon.innerHTML = '';
    }
  }

  downloadMoa() {
    if (this.data) {
      this.imageService.downloadMoaFile(this.data.partner.partner_id).subscribe((response) => {
        if (response.body instanceof Blob) {
          const downloadLink = URL.createObjectURL(response.body);
          const link = document.createElement('a');
          link.href = downloadLink;
          link.download = this.data.partner.moaFile_content.fileName;
          link.click();
        }
      });
    }
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

  closeDialog() {
    this.dialogRef.close();
  }

  submitForm(): void {
    const address =
      this.partnerForm.value.address_barangay + ', ' + this.partnerForm.value.address_city + ', ' + this.partnerForm.value.address_province;
    this.partnerForm.patchValue({ address: address });

    const startDateValue = this.partnerForm.get('start_date')?.value;
    const endDateValue = this.partnerForm.get('end_date')?.value;

    const startDate = this.datePipe.transform(this.partnerForm.get('start_date')?.value, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.partnerForm.get('end_date')?.value, 'yyyy-MM-dd');

    const formData = new FormData();
    formData.append('company_name', this.partnerForm.get('company_name')?.value);
    formData.append('address', this.partnerForm.get('address')?.value);
    formData.append('contact_person', this.partnerForm.get('contact_person')?.value);
    formData.append('contact_no', this.partnerForm.get('contact_no')?.value);
    if (startDate && endDate) {
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
    }

    if (this.moaFile) {
      formData.append('moa_file', this.moaFile, this.moaFile.name);
    }

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    if (this.data) {
      formData.append('partner_id', this.data.partner.partner_id);
      this.partnerService.updatePartner(formData).subscribe(
        (program) => {
          console.log('Program created successfully:', program);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error creating program:', error);
          // TODO: Handle error
        }
      );
    } else {
      this.partnerService.createPartner(formData).subscribe(
        (program) => {
          console.log('Program created successfully:', program);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error creating program:', error);
          // TODO: Handle error
        }
      );
    }
  }
}
