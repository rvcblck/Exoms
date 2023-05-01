import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent implements OnInit {
  isAuthenticated$: Observable<boolean> = of(false);
  assetPath = environment.assetPath;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    this.isAuthenticated$ = new Observable<boolean>((observer) => {
      observer.next(isAuthenticated);
      observer.complete();
    });
  }

  getDashboardLink(): string {
    if (this.authService.isAdmin()) {
      return '/admin/dashboard';
    } else {
      return '/user/dashboard';
    }
  }
}
