import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {

  authService: AuthService;
  authenticatedUserInfo: any;

  constructor(private _authService: AuthService) {
    this.authService = _authService;

  }


  ngOnInit() {
    this.authenticatedUserInfo = this.authService.getAuthenticatedUserInfo();

    if(this.authenticatedUserInfo.role === "user"){
      this.authenticatedUserInfo.role = "faculty";
    }




  }
  ngAfterViewInit() {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btns");
    const searchBtn = document.querySelector(".bx-search");

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        sidebar?.classList.toggle("open");
        menuBtnChange();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        sidebar?.classList.toggle("open");
        menuBtnChange();
      });
    }

    function menuBtnChange() {
      if (sidebar?.classList.contains("open")) {
        closeBtn?.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        closeBtn?.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    }

    // do something with the selected elements
  }

  onLogout() {
    this.authService.logout();
  }

}
