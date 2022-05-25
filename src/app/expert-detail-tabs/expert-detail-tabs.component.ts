import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-expert-detail-tabs',
  templateUrl: './expert-detail-tabs.component.html',
  styleUrls: ['./expert-detail-tabs.component.css']
})
export class ExpertDetailTabsComponent implements OnInit {

  routeurl: string;
  isAdmin: any;
  constructor(private route: Router,
              private activatedRoute: ActivatedRoute) {
          this.isAdmin = localStorage.getItem('isadmin');
  }

  ngOnInit(): void {
      this.routeurl = this.route.url;
      this.route.events.subscribe( event => {
         if(event instanceof NavigationEnd)  {
           this.routeurl = this.route.url;
         }
      })
  }

  preventRoute(event){
    event.stopPropogation();
  }

  navigateUrl(url: string) {
    this.route.navigate([url], { relativeTo: this.activatedRoute })
  }

   currentRouteUrl(route) {
     let url = null;
     if(this.routeurl.indexOf("?") != -1){
      url = this.routeurl.split("?")[0];
     } else {
       url = this.routeurl;
     }
      if(url == route) {
         return 'border-bottom'
      }
       return '';
   }
}
