import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from 'src/app/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
// import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import { ImageService } from 'src/app/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  authService: AuthService;
  authenticatedUserInfo: any;
  showSideNav = false;
  pageName!: string;
  // imageUrl!: string;

  private apiUrl = 'http://localhost:8000/api';
  public imageUrl: any;
  // route: any;

  // handshakeIcon = HandshakeOutlinedIcon;

  constructor(
    private _authService: AuthService,
    public imageService: ImageService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.authService = _authService;
  }

  getImage() {
    const filename = 'logo.png';
    return this.http.get(`${this.apiUrl}/images/${filename}`, { responseType: 'blob' });
  }

  ngOnInit() {
    this.authenticatedUserInfo = this.authService.getAuthenticatedUserInfo();

    if (this.authenticatedUserInfo.role === 'user') {
      this.authenticatedUserInfo.role = 'faculty';
    }

    this.getImage().subscribe((data: Blob) => {
      const imageUrl = URL.createObjectURL(data);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    });

    if (this.route.firstChild) {
      this.route.firstChild.url.subscribe((url) => {
        const pageName = url[url.length - 1].path;
        this.pageName = this.capitalizeFirstLetter(pageName);
      });
    }

    console.log(this.pageName, 'eto yun');
  }
  ngAfterViewInit() {
    const sidebar = document.querySelector('.sidebar');
    const burgerMenu = document.querySelector('.burger-menu');
    const closeBtn = document.querySelector('#btn');
    const navList = document.querySelector('.nav-list');
    const logo = document.querySelector('.cict-logo');
    // const profileLink = document.querySelector('.profile-link');
    // const searchBtn = document.querySelector('.bx-search');

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        sidebar?.classList.toggle('open');
        menuBtnChange();
      });
    }
    if (burgerMenu) {
      burgerMenu.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        burgerMenu.classList.toggle('open');
        navList?.classList.toggle('open');
        logo?.classList.toggle('open');

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

  profile(event: Event) {}

  onLogout() {
    this.authService.logout();
  }

  capitalizeFirstLetter(str: string): string {
    str = str.replace(/-/g, ' '); // Replace all occurrences of '-' with ' '
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
