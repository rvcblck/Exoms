import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProgramService } from 'src/app/program.service';
import { DatePipe } from '@angular/common';
import { COMMA, ENTER, L } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AutoComplete } from 'src/app/program.model';
import { MatDialog } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ViewProgram } from 'src/app/program.model';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from 'src/app/image.service';
import { FileView } from 'src/app/file.model';
import { SuccessComponent } from 'src/app/dialog/success/success.component';
import { ErrorComponent } from 'src/app/dialog/error/error.component';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class CreateProgramComponent implements OnInit, AfterViewInit {
  @ViewChild('leaderInput') leaderInput!: ElementRef<HTMLInputElement>;
  @ViewChild('memberInput') memberInput!: ElementRef<HTMLInputElement>;
  @ViewChild('partnerInput') partnerInput!: ElementRef<HTMLInputElement>;
  @ViewChild('participantInput') participantInput!: ElementRef<HTMLInputElement>;
  @ViewChild('chipList') chipList!: ElementRef;
  @ViewChild('barangayInput') barangayInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cityInput') cityInput!: ElementRef<HTMLInputElement>;
  @ViewChild('provinceInput') provinceInput!: ElementRef<HTMLInputElement>;
  @ViewChild('invFile', { static: false }) invFile!: ElementRef;
  @ViewChild('certFile') certFile!: ElementRef;
  @ViewChild('invFileSize') invFileSize!: ElementRef;
  @ViewChild('certFileSize') certFileSize!: ElementRef;

  // @ViewChild('titleInput') titleInput: any;

  programForm: FormGroup = new FormGroup({});

  public hover = false;

  suggestions: any[] = [];
  options: any[] = [];
  partnerSuggestions: any[] = [];

  selectedMember: any[] = [];
  selectedLeader: any[] = [];
  participants: any[] = [];
  selectedPartners: any[] = [];

  invitation: File | null = null;
  certificate: File | null = null;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  showLeaderError = false;
  showMemberError = false;
  showPartnerError = false;
  submitAttempted = false;

  edithInv = false;
  edithCert = false;
  dlInv = false;
  dlCert = false;

  invName = '';
  invExt = '';
  certName = '';
  certExt = '';

  constructor(
    public dialogRef: MatDialogRef<CreateProgramComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { program: ViewProgram; autocomplete: AutoComplete },
    private formBuilder: FormBuilder,
    private programService: ProgramService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private imageService: ImageService
  ) {
    if (data.program) {
      const address = data.program.place;
      const addressParts = address.split(', ');
      const addressObject = {
        barangay: addressParts[0],
        city: addressParts[1],
        province: addressParts[2]
      };

      const leaderObject = {
        full_name: data.program.leader.fullName,
        user_id: data.program.leader.user_id
      };
      data.program.members.forEach((member) => {
        this.selectedMember.push({ user_id: member.user_id, full_name: member.fullName });
      });

      data.program.partners.forEach((partner) => {
        this.selectedPartners.push({ partner_id: partner.partner_id, name: partner.name });
      });

      data.program.participants.forEach((participant) => {
        this.participants.push(participant.name);
      });

      if (data.program.invitation) {
        this.edithInv = true;
        this.dlInv = true;
        this.viewFiles(data.program.invitation);
      }
      if (data.program.certificate) {
        this.edithCert = true;
        this.dlCert = true;
        this.certViewFiles(data.program.certificate);
      }

      this.selectedLeader.push(leaderObject);

      this.programForm = this.formBuilder.group({
        title: [data.program.title, Validators.required],
        details: [data.program.details, Validators.required],
        start_date: [data.program.start_date, Validators.required],
        end_date: [data.program.end_date, Validators.required],
        address: [addressObject.barangay + ' ' + addressObject.city + ' ' + addressObject.barangay],
        barangay: [addressObject.barangay, Validators.required],
        city: [addressObject.city, Validators.required],
        province: [addressObject.province, Validators.required],
        leader_id: [''],
        member_id: [''],
        participant: [''],
        partner_id: [''],
        invitation: [''],
        certificate: [''],
        start_time: [data.program.start_time],
        end_time: [data.program.end_time]
      });
    } else {
      this.programForm = this.formBuilder.group({
        title: ['', Validators.required],
        details: ['', Validators.required],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        address: [''],
        barangay: ['', Validators.required],
        city: ['', Validators.required],
        province: ['', Validators.required],
        leader_id: [''],
        member_id: [''],
        participant: [''],
        partner_id: [''],
        invitation: [''],
        certificate: [''],
        start_time: [''],
        end_time: ['']
      });
    }
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
        link.download = this.invName;
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
        link.download = this.certName;
        link.click();
      }
    });
  }

  viewFiles(filePaths: string) {
    const filePath = filePaths;
    this.imageService.viewFile(filePath).subscribe((file) => {
      this.invName = file.fileName;
      this.invExt = file.fileExtension;
      console.log(this.invitation);
      setTimeout(() => {
        this.invFile.nativeElement.innerHTML = file.fileName;
      }, 0);
      setTimeout(() => {
        this.invFileSize.nativeElement.innerHTML = (file.fileSize / (1024 * 1024)).toFixed(2) + ' MB';
      }, 0);
      setTimeout(() => {
        const invIcon = document.getElementById('invIcon');
        if (invIcon) {
          if (file.fileExtension === 'pdf') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f;"></i>';
          } else if (['png', 'jpg', 'jpeg'].includes(file.fileExtension)) {
            invIcon.innerHTML = '<i class="fa-regular fa-file-image" style="color: #ff5a2f;"></i>';
          } else if (file.fileExtension === 'docx') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f;"></i>';
          } else {
            invIcon.innerHTML = '';
          }
        }
      }, 0);
    });
  }

  certViewFiles(filePaths: string) {
    const filePath = filePaths;
    this.imageService.viewFile(filePath).subscribe((file) => {
      this.certExt = file.fileExtension;
      this.certName = file.fileName;
      setTimeout(() => {
        this.certFile.nativeElement.innerHTML = file.fileName;
      }, 0);
      setTimeout(() => {
        this.certFileSize.nativeElement.innerHTML = (file.fileSize / (1024 * 1024)).toFixed(2) + ' MB';
      }, 0);
      setTimeout(() => {
        const invIcon = document.getElementById('certIcon');
        if (invIcon) {
          if (file.fileExtension === 'pdf') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f;"></i>';
          } else if (['png', 'jpg', 'jpeg'].includes(file.fileExtension)) {
            invIcon.innerHTML = '<i class="fa-regular fa-file-image" style="color: #ff5a2f;"></i>';
          } else if (file.fileExtension === 'docx') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f;"></i>';
          } else {
            invIcon.innerHTML = '';
          }
        }
      }, 0);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.barangayInput.nativeElement.addEventListener('input', () => this.updateAddress());
    this.cityInput.nativeElement.addEventListener('input', () => this.updateAddress());
    this.provinceInput.nativeElement.addEventListener('input', () => this.updateAddress());
  }

  updateAddress() {
    const barangayInput = document.getElementById('barangay') as HTMLTextAreaElement;
    const cityInput = document.getElementById('city') as HTMLTextAreaElement;
    const provinceInput = document.getElementById('province') as HTMLTextAreaElement;

    // Get the current values of the input elements
    const barangay = barangayInput.value;
    const city = cityInput.value;
    const province = provinceInput.value;

    // Join the values of barangay, city, and province with a comma separator
    const address = `${barangay}, ${city}, ${province}`;

    // Update the value of the address control in the form group
    this.programForm.get('address')?.setValue(address);
  }

  onInvitationFileSelected(event: any, controlName: string) {
    this.edithInv = true;
    const file = event.target.files[0];
    const allowedExtensions = ['pdf', 'docx', 'png', 'jpeg', 'jpg'];
    const maxFileSize = 5048; // in KB

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop();

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      this.programForm.get(controlName)?.setErrors({ invalidExtension: true });
      event.target.value = ''; // clear the file input
    } else if (file.size > maxFileSize * 1024) {
      this.programForm.get(controlName)?.setErrors({ max: true });
      event.target.value = ''; // clear the file input
    } else {
      console.log(file);
      this.invitation = file;
      setTimeout(() => {
        this.invFile.nativeElement.innerHTML = file.name;
      }, 0);
      setTimeout(() => {
        this.invFileSize.nativeElement.innerHTML = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      }, 0);
      setTimeout(() => {
        const invIcon = document.getElementById('invIcon');
        if (invIcon) {
          if (extension === 'pdf') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f;"></i>';
          } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
            invIcon.innerHTML = '<i class="fa-regular fa-file-image" style="color: #ff5a2f;"></i>';
          } else if (extension === 'docx') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f;"></i>';
          } else {
            invIcon.innerHTML = '';
          }
        }
      }, 0);
    }
  }

  removeInvitation() {
    this.invitation = null;
    this.edithInv = false;
    const inputElement = document.getElementById('invitation-upload') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    const fileNameSpan = document.getElementById('fileName') as HTMLSpanElement;
    if (fileNameSpan) {
      fileNameSpan.innerHTML = '';
    }
  }
  removeCert() {
    this.certificate = null;
    this.edithCert = false;
    const inputElement = document.getElementById('cert-upload') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    const fileNameSpan = document.getElementById('fileNameCert') as HTMLSpanElement;
    if (fileNameSpan) {
      fileNameSpan.innerHTML = '';
    }
  }

  onCertificateFileSelected(event: any, controlName: string) {
    this.edithCert = true;
    const file = event.target.files[0];
    const allowedExtensions = ['pdf', 'docx', 'png', 'jpeg', 'jpg'];
    const maxFileSize = 5048; // in KB

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop();

    if (!allowedExtensions.includes(extension.toLowerCase())) {
      this.programForm.get(controlName)?.setErrors({ invalidExtension: true });
      event.target.value = ''; // clear the file input
    } else if (file.size > maxFileSize * 1024) {
      this.programForm.get(controlName)?.setErrors({ max: true });
      event.target.value = ''; // clear the file input
    } else {
      console.log(file);
      this.certificate = file;
      setTimeout(() => {
        this.certFile.nativeElement.innerHTML = file.name;
      }, 0);
      setTimeout(() => {
        this.certFileSize.nativeElement.innerHTML = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      }, 0);
      setTimeout(() => {
        const invIcon = document.getElementById('certIcon');
        if (invIcon) {
          if (extension === 'pdf') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-pdf" style="color: #ff5a2f;"></i>';
          } else if (['png', 'jpg', 'jpeg'].includes(extension)) {
            invIcon.innerHTML = '<i class="fa-regular fa-file-image" style="color: #ff5a2f;"></i>';
          } else if (extension === 'docx') {
            invIcon.innerHTML = '<i class="fa-regular fa-file-word" style="color: #ff5a2f;"></i>';
          } else {
            invIcon.innerHTML = '';
          }
        }
      }, 0);
    }
  }

  // for leader field

  checkLeader(event: any) {
    // this.showLeaderError = false;
    const searchText = event.target.value.toLowerCase();
    const usersArray = Object.values(this.data.autocomplete.users);
    const matchedUsers = usersArray.filter((user: any) => {
      return user.fname.toLowerCase().includes(searchText) || user.lname.toLowerCase().includes(searchText);
    });
    this.showLeaderError = false;
    if (searchText === '') {
      this.options = [];
    } else if (matchedUsers.length >= 1) {
      this.showLeaderError = true;
      const matchedFullNames = matchedUsers.map((user: any) => {
        return {
          user_id: user.user_id,
          full_name: `${user.fname} ${user.lname}`,
          ongoing: user.ongoing,
          upcoming: user.upcoming
        };
      });
      this.options = matchedFullNames.filter((leader: any) => {
        return !this.selectedLeader.includes(leader.user_id) && !this.selectedMember.some((member) => member.user_id === leader.user_id);
      });
    } else {
      if (this.leaderInput.nativeElement.value != '') {
        this.showLeaderError = true;
      }
      this.options = [];
      console.error('Error: No or multiple users match the input value');
    }
  }

  onLeaderSelected(event: MatAutocompleteSelectedEvent) {
    this.showLeaderError = false;
    const selectedOption = this.options.find((option) => option.user_id === event.option.value);
    console.log(selectedOption);
    if (selectedOption) {
      // this.programForm.patchValue({ leader_id: selectedOption.user_id });
      this.selectedLeader = [selectedOption];
      this.leaderInput.nativeElement.value = '';
    }
  }

  onLeaderRemoved(fullName: string) {
    const index = this.selectedLeader.indexOf(fullName);
    if (index >= 0) {
      this.selectedLeader.splice(index, 1);
      // this.programForm.patchValue({ leader_id: '' });
    }
  }

  // for member field

  checkMember(event: any) {
    const searchText = event.target.value.toLowerCase();
    const usersArray = Object.values(this.data.autocomplete.users);
    const matchedUsers = usersArray.filter((user: any) => {
      return user.fname.toLowerCase().includes(searchText) || user.lname.toLowerCase().includes(searchText);
    });
    this.showMemberError = false;
    if (searchText === '') {
      this.suggestions = [];
    } else if (matchedUsers.length >= 1) {
      this.showMemberError = true;
      const matchedFullNames = matchedUsers.map((user: any) => {
        return {
          user_id: user.user_id,
          full_name: `${user.fname} ${user.lname}`,
          ongoing: user.ongoing,
          upcoming: user.upcoming
        };
      });
      this.suggestions = matchedFullNames.filter((option: any) => {
        return (
          !this.selectedMember.some((member) => member.user_id === option.user_id) &&
          !this.selectedLeader.some((member) => member.user_id === option.user_id)
        );
      });
    } else {
      if (this.memberInput.nativeElement.value != '') {
        this.showMemberError = true;
      }

      this.suggestions = [];
      console.error('Error: No or multiple users match the input value');
    }
  }

  onMemberSelected(event: MatAutocompleteSelectedEvent) {
    this.showMemberError = false;
    const selectedOption = this.suggestions.find((option) => option.user_id === event.option.value);
    console.log(selectedOption);
    if (selectedOption) {
      this.selectedMember.push(selectedOption);
      const joinedMemberIds = this.selectedMember.map((member) => member.user_id).join(',');
      // this.programForm.patchValue({ member_id: joinedMemberIds });
      this.memberInput.nativeElement.value = '';
    }
  }

  onMemberRemoved(member: any) {
    const index = this.selectedMember.indexOf(member);
    if (index >= 0) {
      this.selectedMember.splice(index, 1);
      const joinedMemberIds = this.selectedMember.map((member) => member.user_id).join(',');
      // this.programForm.patchValue({ member_id: joinedMemberIds });
      console.log(this.programForm.value);
    }
  }

  // for Partner field

  checkPartner(event: any) {
    const searchText = event.target.value.toLowerCase();
    const usersArray = Object.values(this.data.autocomplete.partners);
    const matchedUsers = usersArray.filter((partners: any) => {
      return partners.name.toLowerCase().includes(searchText);
    });
    this.showPartnerError = false;
    if (searchText === '') {
      this.partnerSuggestions = [];
    } else if (matchedUsers.length >= 1) {
      this.showPartnerError = true;
      const matchedCompanyNames = matchedUsers.map((partner: any) => {
        return {
          partner_id: partner.partner_id,
          name: `${partner.name}`
        };
      });
      this.partnerSuggestions = matchedCompanyNames;

      // Remove already selected options and leaders from the matched options
      this.partnerSuggestions = matchedCompanyNames.filter((partner: any) => {
        return !this.selectedPartners.some((name) => name.partner_id === partner.partner_id);
      });
      // console.log(this.partnerSuggestions);

      // console.log(this.suggestions);
    } else {
      if (this.partnerInput.nativeElement.value != '') {
        this.showPartnerError = true;
      }

      this.partnerSuggestions = [];
      console.error('Error: No or multiple users match the input value');
    }
  }

  onPartnerSelected(event: MatAutocompleteSelectedEvent) {
    this.showPartnerError = false;
    const selectedOption = this.partnerSuggestions.find((partner) => partner.partner_id === event.option.value);
    if (selectedOption) {
      this.selectedPartners.push(selectedOption); // add the new selected full name to the array
      const joinedPartnerIds = this.selectedPartners.map((partner) => partner.partner_id).join(',');
      // this.programForm.patchValue({ partner_id: joinedPartnerIds });
      this.partnerInput.nativeElement.value = '';
    }
  }

  onPartnerRemoved(fullName: string) {
    const index = this.selectedPartners.indexOf(fullName);
    if (index >= 0) {
      this.selectedPartners.splice(index, 1);
      const joinedPartnerIds = this.selectedPartners.map((member) => member.user_id).join(',');
      // this.programForm.patchValue({ partner_id: joinedPartnerIds });
    }
  }

  //participants
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.participants.push(value);
      // this.programForm.patchValue({ participant: this.participants });
    }

    // Clear the input value
    event.chipInput!.clear();
    this.participantInput.nativeElement.value = '';
    console.log(this.participants);
  }

  remove(participant: string): void {
    const index = this.participants.indexOf(participant);

    if (index >= 0) {
      this.participants.splice(index, 1);
    }
  }

  getFirstErrorMessage(): string {
    const title = this.programForm.get('title');
    if (title?.invalid) {
      return 'Title is required.';
    }

    const start_date = this.programForm.get('start_date');
    if (start_date?.invalid) {
      return 'Start date is required.';
    }

    const end_date = this.programForm.get('end_date');
    if (end_date?.invalid) {
      return 'End date is required.';
    }

    const detailsTextarea = this.programForm.get('details');
    if (detailsTextarea?.invalid) {
      return 'Details is required.';
    }

    const barangayInput = this.programForm.get('barangay');
    if (barangayInput?.invalid) {
      return 'Barangay is required.';
    }

    const cityInput = this.programForm.get('city');
    if (cityInput?.invalid) {
      return 'City is required.';
    }

    const provinceInput = this.programForm.get('province');
    if (provinceInput?.invalid) {
      return 'Province is required.';
    }

    return '';
  }

  getFirstErrorMessagePage2(): string {
    if (this.selectedLeader.length === 0) {
      return 'Leader is required.';
    }
    if (this.showLeaderError && (this.leaderInput.nativeElement.value || this.selectedLeader.length === 0)) {
      return 'It should be a registered faculty.';
    }
    if (this.selectedMember.length === 0) {
      return 'Member is required.';
    }
    if (this.showMemberError && (this.memberInput.nativeElement.value || this.selectedMember.length === 0)) {
      return 'It should be a registered faculty.';
    }
    if (this.selectedPartners.length === 0) {
      return 'Partner is required.';
    }
    if (this.showPartnerError && (this.partnerInput.nativeElement.value || this.selectedPartners.length === 0)) {
      return 'It should be a registered Partner.';
    }
    if (this.programForm.get('invitation')?.errors?.['invalidExtension']) {
      return 'Invalid file type. Allowed extensions: pdf, docx, png, jpeg, jpg';
    }
    if (this.programForm.get('certificate')?.errors?.['invalidExtension']) {
      return 'Invalid file type. Allowed extensions: pdf, docx, png, jpeg, jpg';
    }
    return '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.updateAddress();
    this.submitAttempted = true;
    if (this.programForm.invalid || this.showMemberError || this.showLeaderError || this.showPartnerError) {
      console.log('not submit', this.showLeaderError, this.showMemberError, this.showPartnerError, this.programForm.invalid, this.selectedLeader);

      return;
    }

    const formData = new FormData();
    formData.append('title', this.programForm.get('title')?.value);
    formData.append('details', this.programForm.get('details')?.value);

    formData.append('start_date', this.programForm.get('start_date')?.value);
    formData.append('end_date', this.programForm.get('end_date')?.value);

    if (this.data.program) {
      formData.append('program_id', this.data.program.program_id);
    }
    const LeaderId = this.selectedLeader.map((leader) => leader.user_id).join(',');
    const joinedMemberIds = this.selectedMember.map((member) => member.user_id).join(',');
    const joinedPartnerIds = this.selectedPartners.map((partner) => partner.partner_id).join(',');
    const joineParticipantIds = this.participants.join(',');

    formData.append('start_time', this.programForm.get('start_time')?.value);
    formData.append('end_time', this.programForm.get('end_time')?.value);
    formData.append('leader_id', LeaderId);
    formData.append('member_id', joinedMemberIds);
    formData.append('partner_id', joinedPartnerIds);
    formData.append('participant', joineParticipantIds);
    formData.append('address', this.programForm.get('address')?.value);
    if (this.invitation) {
      formData.append('invitation', this.invitation);
    }
    if (this.certificate) {
      formData.append('certificate', this.certificate);
    }
    if (this.data.program) {
      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });
      this.programService.updateProgram(formData).subscribe(
        (program) => {
          console.log('Program created successfully:', program);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error creating program:', error);
        }
      );
    } else {
      this.programService.createProgram(formData).subscribe(
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
}
