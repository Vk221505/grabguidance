import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; 
import {isPlatformBrowser} from "@angular/common";

declare const ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  title = 'grabGuidance';
  constructor(private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object) {
   }

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)){
      window.addEventListener('storage', (event) => {
        if (event.storageArea == sessionStorage) {
          let token = sessionStorage.getItem('id_expert');
          token = localStorage.getItem('id_expert');
          if (token == undefined) {
            this.router.navigate(['/']);
          }
        }
      });
    }
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



}
