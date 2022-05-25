import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private route: Router,
    private acrivatedRoute: ActivatedRoute) {

  }



  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {



    if (isPlatformBrowser(this.platformId)) {

      console.log("state", state.url)

      if (localStorage.getItem("token")) {
        let url = state.url;
        let userType: string = localStorage.getItem("user_role");
        if (userType == 'expert' && url == '/expert-signin') {
          this.route.navigate(["/expert/dashboard"])
        } else if (userType == 'user' && url == '/user-signin') {
          this.route.navigate(["/"])
        } else {
          return true;
        }
        return false;
      } else {
        return true;
      }
    }

    return true;
  }

}
