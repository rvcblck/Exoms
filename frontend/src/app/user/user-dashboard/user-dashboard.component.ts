import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
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

}
