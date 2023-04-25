import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { DashboardService } from 'src/app/dashboard.service';
import { ResponseData } from 'src/app/dashboard.model';
import { ImageService } from 'src/app/image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { OperatorFunction, catchError } from 'rxjs';
import { of } from 'rxjs';
import { ChartData } from 'src/app/dashboard.model';

import quotes from 'quotesy/quotes.json';
import { Observable, map } from 'rxjs';
import { PartnerService } from 'src/app/partner.service';
import { ViewPartnerComponent } from '../modal/view-partner/view-partner.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private adminLayout: AdminLayoutComponent,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService,
    public imageService: ImageService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private dialog: MatDialog,
    private partnerService: PartnerService
  ) {
    // Chart.register(Annotation);
  }
  currentDate: Date = new Date();
  timeOfDay!: string;
  quote!: string;
  author!: string;
  public images!: any[];
  private newLabel? = 'New label';
  chartOptions: any;
  dashboard!: ResponseData;
  userChartOptions: any;
  programChart: ChartData[] = [];

  private apiUrl = 'http://localhost:8000/api';
  public imageUrl: any;

  // routeData: any;

  ngOnInit(): void {
    // this.adminLayout.pageTitle = 'Dashboard';
    // this.cdr.detectChanges();
    setInterval(() => {
      this.currentDate = new Date();
      const currentTime = new Date().getHours();
      if (currentTime >= 5 && currentTime < 12) {
        this.timeOfDay = 'morning';
      } else if (currentTime >= 12 && currentTime < 18) {
        this.timeOfDay = 'afternoon';
      } else {
        this.timeOfDay = 'evening';
      }
    }, 1000);

    const quote = localStorage.getItem('quote');
    if (!quote) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      this.quote = randomQuote.text;
      this.author = randomQuote.author;
      localStorage.setItem('quote', this.quote);
      localStorage.setItem('author', this.author);
    } else {
      // console.log(meron)
      const quote = localStorage.getItem('quote');
      if(quote){
        this.quote = quote;
      }
      const author = localStorage.getItem('author');
      if(author){
        this.author = author;
      }

    }

    this.getDashboard();

    const month = localStorage.getItem('month');

    if (!month) {
      const month = new Date().getMonth() + 1;
      localStorage.setItem('month', month.toString());
    }
  }

  getImages() {
    const userIds = this.dashboard.faculty.map((faculty) => faculty.user_id);
    // console.log(userIds);
    this.getUserImages(userIds).subscribe((images) => {
      if (images.length > 0) {
        this.images = images;
        // console.log(this.images);
      } else {
        console.log('No images retrieved.');
      }
    });
  }

  getUserImages(userIds: string[]): Observable<any[]> {
    const url = `${this.apiUrl}/users-profile-images`;
    const body = { user_ids: userIds };
    // console.log(body);
    return this.http.post(url, body).pipe(
      map((response: any) => {
        const images: any[] = [];
        const data = response as string[]; // cast to string[] type
        data.forEach((item: string) => {
          const imageUrl = 'data:image/png;base64,' + item;
          images.push(this.sanitizer.bypassSecurityTrustUrl(imageUrl));
        });
        return images;
      }),
      catchError(() => {
        return of([]); // return an empty array on error
      })
    );
  }

  getDashboard(): void {
    this.dashboardService.getDashboard().subscribe(
      (programs) => {
        this.dashboard = programs;
        console.log('Programs retrieved successfully');
        this.getImages();
        this.getChart();
        this.getUserChart();
      },
      (error) => {
        console.error('Error retrieving programs:', error);
      }
    );
  }
  getChart(): void {
    const month = localStorage.getItem('month');
    console.log(month);
    if (month) {
      this.dashboardService.getProgramChart(month).subscribe(
        (programs) => {
          this.programChart = programs;
          console.log(programs);
          this.getProgramChart();
          console.log('Programs retrieved successfully');
        },
        (error) => {
          console.error('Error retrieving programs:', error);
        }
      );
    }
  }

  getProgramChart() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const monthNum = localStorage.getItem('month');
    const monthName = months[Number(monthNum) - 1];

    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: `Program for month of ${monthName}`
      },
      axisY: {
        title: 'Number of Programs',
        valueFormatString: '#0',
        gridThickness: 0,
        gridDashType: 0
      },
      axisX: {
        valueFormatString: 'MMM DD'
      },
      data: [
        {
          type: 'splineArea',
          color: '#ff5a2f',
          xValueFormatString: 'MMM DD',
          markerSize: 5,
          lineThickness: 2,
          dataPoints: this.programChart.map((item) => ({ x: new Date(item.x), y: item.y }))
        }
      ]
    };
  }

  getUserChart() {
    // console.log(this.dashboard.user_status);
    const totalUsers = this.dashboard.user_status.reduce((total, status) => total + status.y, 0);
    this.userChartOptions = {
      animationEnabled: true,
      title: {
        text: 'User Status'
      },
      data: [
        {
          type: 'doughnut',
          yValueFormatString: "#,###.##'%'",
          indexLabel: '{name}: {y}',
          indexLabelFontSize: 16,
          indexLabelFontColor: '#555',
          toolTipContent: '{name}: {y} (#percent%)',
          dataPoints: this.dashboard.user_status.map((item, index) => ({
            y: item.y,
            name: item.name.toLowerCase(),
            color: index === 0 ? '#74d49b' : index === 1 ? '#e4b830' : '#f47393' // set color based on index
          }))
        }
      ],
      subtitles: [
        {
          text: `Users: ${totalUsers}`,
          verticalAlign: 'center',
          fontSize: 24,
          dockInsidePlotArea: true
        }
      ]
    };
  }

  previous(): void {
    let month = localStorage.getItem('month');
    if (month) {
      month = (parseInt(month) - 1).toString();
      localStorage.setItem('month', month);
    }
    this.chartOptions = '';
    this.getChart();
  }

  next(): void {
    let month = localStorage.getItem('month');
    if (month) {
      month = (parseInt(month) + 1).toString();
      localStorage.setItem('month', month);
    }
    this.chartOptions = '';
    this.getChart();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  ViewPartner(partner_id: string) {
    this.partnerService.getPartnerInfo(partner_id).subscribe(
      (partner) => {
        const dialogRef = this.dialog.open(ViewPartnerComponent, {
          data: { partner: partner },
          maxWidth: '90%',
          minWidth: '40%'
        });
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }
}
