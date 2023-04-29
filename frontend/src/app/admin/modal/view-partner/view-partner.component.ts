import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ViewPartner } from 'src/app/partner.model';
import { PartnerService } from 'src/app/partner.service';
import { CreatePartnerComponent } from '../create-partner/create-partner.component';
import { ImageService } from 'src/app/image.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';
import { SuccessComponent } from 'src/app/dialog/success/success.component';

@Component({
  selector: 'app-view-partner',
  templateUrl: './view-partner.component.html',
  styleUrls: ['./view-partner.component.css']
})
export class ViewPartnerComponent implements OnInit {
  @ViewChild('moaFileName', { static: false }) moaFileName!: ElementRef;
  @ViewChild('moaFileSize') moaFileSize!: ElementRef;

  extendForm: FormGroup = new FormGroup({});
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<ViewPartnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { partner: ViewPartner },
    private partnerService: PartnerService,
    private dialog: MatDialog,
    private imageService: ImageService,
    private formBuilder: FormBuilder
  ) {
    this.extendForm = this.formBuilder.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.moaFileName && this.moaFileSize) {
        this.moaFileName.nativeElement.innerHTML = this.data.partner.moaFile_content.fileName;
        this.moaFileSize.nativeElement.innerHTML = (this.data.partner.moaFile_content.fileSize / (1024 * 1024)).toFixed(2) + ' MB';
        console.log('tae', this.data.partner);

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
      }
    }, 0);
  }

  viewFiles() {}

  dlMoa() {
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.extendForm.invalid) {
      return;
    }

    this.openConfirmationDialog();
  }

  openConfirmationDialog(): void {
    const message = 'Are you sure you want to submit the form?';
    const header = 'Extend Contract';
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
    const formattedData = {
      partner_id: this.data.partner.partner_id,
      start_date: this.extendForm.get('start_date')?.value,
      end_date: this.extendForm.get('end_date')?.value
    };

    this.partnerService.extend(formattedData).subscribe(
      (program) => {
        console.log('Program created successfully:', program);
        const message = 'Program created successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error creating program:', error);
        // TODO: Handle error
        const message = 'Error creating program';
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

  closeDialog() {
    this.dialogRef.close();
  }

  editProgram(partner_id: string) {
    this.dialogRef.close();
    this.partnerService.getPartnerInfo(partner_id).subscribe(
      (partner) => {
        const dialogRef = this.dialog.open(CreatePartnerComponent, {
          data: { partner: partner },
          maxWidth: '90%',
          minWidth: '40%'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );

    // call the edit page
  }

  archive(): void {
    const message = 'Are you sure you want to archive this partner?';
    const header = 'Archive Partner';
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
        this.archiveConfirmed();
      }
    });
  }

  archiveConfirmed() {
    const partner_id = this.data.partner.partner_id;
    this.partnerService.archive(partner_id).subscribe(
      (program) => {
        console.log('Program created successfully:', program);
        const message = 'Program created successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error creating program:', error);
        // TODO: Handle error
        const message = 'Error creating program';
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
