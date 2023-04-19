import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

const COUNTER_KEY = 'my-counter';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  title = 'Verify Your Email';
  message = 'Please wait while we verify your email address.';
  info = '';
  verificationCode = '';
  email = '';
  password = '';
  minutes = '';
  seconds = '';
  timer: any;
  timerRunning = false;


  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') ?? '';
    const countDownTime = window.sessionStorage.getItem(COUNTER_KEY) || 120;
    this.startCountdown(parseInt(countDownTime.toString()));


  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  startCountdown(i: number) {
    this.timer = setInterval(() => {
      this.minutes = parseInt(String(i / 60), 10).toString();
      this.seconds = parseInt(String(i % 60), 10).toString();

      this.minutes = this.minutes.length < 2 ? '0' + this.minutes : this.minutes;
      this.seconds = this.seconds.length < 2 ? '0' + this.seconds : this.seconds;

      this.message = `Please wait while we verify your email address. Time left: ${this.minutes}:${this.seconds}`;

      if (--i < 0) {
        clearInterval(this.timer);
        this.timerRunning = false;
        window.sessionStorage.removeItem(COUNTER_KEY);
        // this.resendCode();
      } else {
        this.timerRunning = true;
        window.sessionStorage.setItem(COUNTER_KEY, i.toString());
      }
    }, 1000);
  }

  onSubmit() {


    const data = {
      email: this.email,
      code: this.verificationCode
    };
    this.authService.verifyCode(data.email, data.code).subscribe(
      (response) => {
        console.log('Code verified successfully');

        clearInterval(this.timer);
        window.sessionStorage.removeItem(COUNTER_KEY);

        this.password = localStorage.getItem('password') as string;
        // console.log(this.password);
        this.authService.login(this.email, this.password).subscribe(() => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/user/dashboard']);
          }
        });
      },
      (error) => {
        console.log('Error verifying code:', error);
        // Handle error here
      }
    );
  }

  resendCode() {
    if (this.timerRunning) {
      return;
    }
    // clearInterval(this.timer);
    // this.timerRunning = false;

    this.authService.resendVerificationCode(this.email).subscribe(() => {
      this.message = 'A new verification code has been sent to your email. Please enter the new code to verify your email address.';
      this.startCountdown(120);
    });
  }




}
