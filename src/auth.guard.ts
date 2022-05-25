import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {isPlatformBrowser} from "@angular/common";


@Injectable()
export class AuthGuard implements CanActivate {

    userDetails: any;

    constructor(private router: Router,  @Inject(PLATFORM_ID) private platformId: Object) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ) {
        if(isPlatformBrowser(this.platformId)){
            this.userDetails = JSON.parse(sessionStorage.getItem('id_expert'));
            let userId = sessionStorage.getItem('id_user');
            let expertId = sessionStorage.getItem('id_expert');
            let adminId = sessionStorage.getItem('id_admin')
    
            this.userDetails = JSON.parse(localStorage.getItem('id_expert'));
            userId = localStorage.getItem('id_user');
            expertId = localStorage.getItem('id_expert');
            adminId = localStorage.getItem('id_admin')
            if (expertId || userId || adminId) {
                return true;
            }
            // not logged in so redirect to login page
            this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
            return false;
        }
       
        
    }
}
