import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

declare let ga: Function;

@Component({
  selector: 'app-expert-welcome-page',
  templateUrl: './expert-welcome-page.component.html',
  styleUrls: ['./expert-welcome-page.component.css']
})
export class ExpertWelcomePageComponent implements OnInit {

  expertId;
  expertEmail;
  expertMobile;
  expertName;
  isAdmin;
  isSignUp: any;
  isLoggedIn: string;

  constructor(
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    this.route.events.subscribe(event => {
      // I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
      if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
        console.log(ga); // Just to make sure it's actually the ga function
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  ngOnInit(){
    this.isAdmin = localStorage.getItem('isadmin');
    this.expertId = localStorage.getItem('id_expert');
    this.expertEmail = localStorage.getItem('expert_email');
    this.expertMobile = localStorage.getItem('expert_mobile');
    this.expertName = localStorage.getItem('expert_name');
    this.isSignUp = localStorage.getItem('isSignUp');
    this.isLoggedIn = localStorage.getItem('isLoggedIn');
  }

}
