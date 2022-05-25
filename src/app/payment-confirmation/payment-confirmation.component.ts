import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


declare let ga: Function;

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {

  dummySubject: string[];
  userName: string;
  expert: any;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      // I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
      if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
        console.log(ga); // Just to make sure it's actually the ga function
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name');
    this.dummySubject = ["Math", "Science", "Social"];
    if (isPlatformBrowser(this.platformId)) {
      this.expert = JSON.parse(sessionStorage.getItem('checkout')).expert;
    }
  }

  navigateUrl() {
    this.router.navigate(['user/sessions/upcoming'])
  }

}
