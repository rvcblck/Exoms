import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// import { Program } from 'src/app/program.model';
import { Profile } from 'src/app/profile.model';
import { ViewProgram } from 'src/app/program.model';
import { ProgramService } from 'src/app/program.service';
import { CreateProgramComponent } from '../create-program/create-program.component';
import { forkJoin } from 'rxjs';
import { ImageService } from 'src/app/image.service';
import { AuthService } from 'src/app/auth.service';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { SuccessComponent } from 'src/app/dialog/success/success.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';

@Component({
  selector: 'app-view-program',
  templateUrl: './view-program.component.html',
  styleUrls: ['./view-program.component.css']
})
export class ViewProgramComponent implements OnInit {
  program: ViewProgram[] = [];
  users!: Profile;
  previousCount: number = 0;
  ongoingCount: number = 0;
  upcomingCount: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ViewProgramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { program: ViewProgram },
    private programService: ProgramService,
    private dialog: MatDialog,
    private imageService: ImageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // console.log(this.data.program.members);
    // console.log(this.data.users);
    setTimeout(() => {
      const invIcon = document.getElementById('viewInvIcon');
      const file = this.data.program.invitation_content.fileExtension;
      if (invIcon && file) {
        if (file === 'pdf') {
          invIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f; font-size: 25px"></i>';
        } else if (['png', 'jpg', 'jpeg'].includes(file)) {
          invIcon.innerHTML = '<i class="fa-regular fa-file-image" style="color: #ff5a2f; font-size: 25px"></i>';
        } else if (file === 'docx') {
          invIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f; font-size: 25px"></i>';
        } else {
          invIcon.innerHTML = '';
        }
      }
    }, 0);

    setTimeout(() => {
      const viewCertSize = document.getElementById('viewInvSize');
      const file = this.data.program.invitation_content.fileSize;
      if (viewCertSize) {
        viewCertSize.innerHTML = (file / (1024 * 1024)).toFixed(2) + ' MB';
      }
    }, 0);

    setTimeout(() => {
      const viewCertSize = document.getElementById('viewCertSize');
      const file = this.data.program.certificate_content.fileSize;
      if (viewCertSize) {
        viewCertSize.innerHTML = (file / (1024 * 1024)).toFixed(2) + ' MB';
      }
    }, 0);

    setTimeout(() => {
      const certIcon = document.getElementById('viewCertIcon');
      const file = this.data.program.certificate_content.fileExtension;
      if (certIcon && file) {
        if (file === 'pdf') {
          certIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f; font-size: 25px"></i>';
        } else if (['png', 'jpg', 'jpeg'].includes(file)) {
          certIcon.innerHTML = '<i class="fa-regular fa-file-image" style="color: #ff5a2f; font-size: 25px"></i>';
        } else if (file === 'docx') {
          certIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f; font-size: 25px"></i>';
        } else {
          certIcon.innerHTML = '';
        }
      }
    }, 0);
  }

  downloadInvitation() {
    this.imageService.downloadFile(this.data.program.program_id).subscribe((response) => {
      const contentDispositionHeader = response.headers?.get('Content-Disposition');
      let fileName = '';
      if (contentDispositionHeader) {
        fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        // ...
      }

      if (response.body instanceof Blob) {
        const downloadLink = URL.createObjectURL(response.body);
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = this.data.program.invitation_content.fileName;
        link.click();
      }
    });
  }

  downloadCertificate() {
    this.imageService.downloadCertFile(this.data.program.program_id).subscribe((response) => {
      const contentDispositionHeader = response.headers?.get('Content-Disposition');
      let fileName = '';
      if (contentDispositionHeader) {
        fileName = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        // ...
      }

      if (response.body instanceof Blob) {
        const downloadLink = URL.createObjectURL(response.body);
        const link = document.createElement('a');
        link.href = downloadLink;
        link.download = this.data.program.certificate_content.fileName;
        link.click();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editProgram(program_id: string) {
    this.dialogRef.close();

    forkJoin([this.programService.getProgramInfo(program_id), this.programService.getAutoComplete()]).subscribe(
      ([program, autocomplete]) => {
        const dialogRef = this.dialog.open(CreateProgramComponent, {
          data: { program: program, autocomplete: autocomplete },
          maxWidth: '90%',
          minWidth: '40%'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  formatTime(timeString: string): string {
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10));
      time.setMinutes(parseInt(minutes, 10));
      return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return '';
    }
  }

  archive(): void {
    const message = 'Are you sure you want to archive this Program?';
    const header = 'Archive Program';
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
    const program_id = this.data.program.program_id;
    this.programService.archive(program_id).subscribe(
      (program) => {
        const message = 'Program archived successfully';
        const header = 'Success';
        const dialogRef = this.dialog.open(SuccessComponent, {
          width: '300px',
          data: {
            header: header,
            message: message
          }
        });
        this.dialogRef.close(true);
      },
      (error) => {
        // TODO: Handle error
        const message = 'Error archiving program';
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
