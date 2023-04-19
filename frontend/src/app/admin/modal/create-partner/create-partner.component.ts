import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fileValidator } from 'src/app/file-type.validator';
import { DatePipe } from '@angular/common';
import { PartnerService } from 'src/app/partner.service';
import { FileUploader } from 'ng2-file-upload';
import { FileItem } from 'ng2-file-upload';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private partnerService: PartnerService, private dialog: MatDialog) {
    this.partnerForm = this.formBuilder.group({
      company_name: ['', Validators.required],
      address: [''],
      contact_person: [''],
      contact_no: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      moa_file: [null],
      address_street: [''],
      address_barangay: ['', Validators.required],
      address_city: ['', Validators.required],
      address_province: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.partnerForm.invalid) {
      return;
    }
    this.openConfirmationDialog();
  }

  onMoaFileSelected(event: any, controlName: string) {
    const file = event.target.files[0];
    const allowedExtensions = ['pdf', 'docx'];
    const maxSize = 5048; // in kilobytes

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop();

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      this.partnerForm.get(controlName)?.setErrors({ invalidExtension: true });
      event.target.value = ''; // clear the file input
    } else if (file.size > maxSize * 1024) {
      this.partnerForm.get(controlName)?.setErrors({ max: true });
      event.target.value = ''; // clear the file input
    } else {
      console.log(file);
      this.moaFile = file;
      const fileNameSpan = document.getElementById('fileName');
      if (fileNameSpan) {
        fileNameSpan.innerHTML = file.name; // set the file name or an empty string
      }
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

  submitForm(): void {
    const address =
      this.partnerForm.value.address_street +
      ', ' +
      this.partnerForm.value.address_barangay +
      ', ' +
      this.partnerForm.value.address_city +
      ', ' +
      this.partnerForm.value.address_province;
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

    this.partnerService.createPartner(formData).subscribe(
      (program) => {
        console.log('Program created successfully:', program);
        // TODO: Handle success
      },
      (error) => {
        console.error('Error creating program:', error);
        // TODO: Handle error
      }
    );
  }
}
