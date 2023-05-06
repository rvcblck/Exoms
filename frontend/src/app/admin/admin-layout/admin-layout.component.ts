import { Component, OnInit, ChangeDetectorRef, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from 'src/app/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
// import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { ImageService } from 'src/app/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from 'src/app/dialog/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { TitleService } from 'src/app/title.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  authService: AuthService;
  showSideNav = false;
  pageName!: string;
  pageTitle = '';
  firstName = '';
  role = '';
  assetPath = environment.assetPath;

  // imageUrl!: string;

  private apiUrl = environment.apiUrl;

  public imageUrl: any;
  // route: any;

  // handshakeIcon = HandshakeOutlinedIcon;

  @ViewChild('homeSection') homeSection!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.homeSection.nativeElement.contains(event.target)) {
      // Close the sidebar
      const sidebar = document.querySelector('.sidebar');

      const burgerMenu = document.querySelector('.burger-menu');
      const closeBtn = document.querySelector('#btn');
      const navList = document.querySelector('.nav-list');
      const logo = document.querySelector('.cict-logo');
      const profile = document.querySelector('.dropdown-container');

      sidebar?.classList.remove('open');
      burgerMenu?.classList.remove('open');
      navList?.classList.remove('open');
      logo?.classList.remove('open');
      profile?.classList.remove('show');
    }
  }

  constructor(
    private _authService: AuthService,
    public imageService: ImageService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private titleReloadService: TitleService
  ) {
    this.authService = _authService;
  }

  // onTitleChange(event: Event) {
  //   console.log('nasa admin layout');
  //   const title = (event.target as HTMLTitleElement).textContent;
  //   if (title) {
  //     this.pageTitle = title;
  //     this.titleService.setTitle(title);
  //   }
  // }

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

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          console.log(routeTitle, 'eto yun');
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(title);
          this.pageTitle = title;
        }
      });

    this.titleReloadService.titleChange.subscribe((title: string) => {
      this.pageTitle = title;
      this.titleService.setTitle(title);
      this.cdr.detectChanges();
    });

    this.getImage().subscribe((data: Blob) => {
      const imageUrl = URL.createObjectURL(data);

      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    });

    const fname = localStorage.getItem('firstName');
    const role = localStorage.getItem('role');
    if (fname) {
      this.firstName = fname;
    }
    if (role) {
      this.role = role;
    }
  }

  ngAfterViewInit() {
    const sidebar = document.querySelector('.sidebar');
    const burgerMenu = document.querySelector('.burger-menu');
    const closeBtn = document.querySelector('#btn');
    const navList = document.querySelector('.nav-list');
    const logo = document.querySelector('.cict-logo');
    const pageTitle = document.querySelector('.page-title');

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        sidebar?.classList.toggle('open');
        pageTitle?.classList.toggle('open');

        menuBtnChange();
      });
    }
    if (burgerMenu) {
      burgerMenu.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        burgerMenu.classList.toggle('open');
        navList?.classList.toggle('open');
        logo?.classList.toggle('open');
        pageTitle?.classList.toggle('open');
      });
    }

    function menuBtnChange() {
      if (sidebar?.classList.contains('open')) {
        closeBtn?.classList.replace('bx-menu', 'bx-menu-alt-right');
      } else {
        closeBtn?.classList.replace('bx-menu-alt-right', 'bx-menu');
      }
    }

    const profile = document.querySelector('.profile');
    const dropdownContainer = document.querySelector('.dropdown-container');

    if (profile) {
      profile.addEventListener('click', function () {
        dropdownContainer?.classList.toggle('show');
      });
    }
  }

  profile(event: Event) {
    const profile = document.querySelector('.dropdown-container');
    if (profile) {
      profile?.classList.toggle('show');
    }
  }

  onLogout() {
    this.openConfirmationDialog();
  }

  capitalizeFirstLetter(str: string): string {
    str = str.replace(/-/g, ' '); // Replace all occurrences of '-' with ' '
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  openConfirmationDialog(): void {
    const message = 'Are you sure you want to logout?';
    const header = 'Logout';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '300px',
      data: {
        header: header,
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
