import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

declare let ga: Function;

@Component({
  selector: 'app-payment-error',
  templateUrl: './payment-error.component.html',
  styleUrls: ['./payment-error.component.css']
})
export class PaymentErrorComponent implements OnInit {

  dummySubject: string[];
  userName: string;
  expert: any

  constructor(private router: Router,  @Inject(PLATFORM_ID) private platformId: Object) {

  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name');
    this.dummySubject = ["Math", "Science", "Social"];
    if (isPlatformBrowser(this.platformId)) {
      this.expert = JSON.parse(sessionStorage.getItem('checkout')).expert;
    }
   
  }

  navigateUrl() {
     this.router.navigate(['/user/sessions/upcoming'])
  }


}
