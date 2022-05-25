import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {

    userDetails: any;

    constructor(private router: Router, private toastrService: ToastrService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.userDetails = JSON.parse(localStorage.getItem('id_expert'));
        let userId = localStorage.getItem('id_user');
        let expertId = localStorage.getItem('id_expert');
        let adminId = localStorage.getItem('id_admin')

        if (expertId || userId || adminId) {
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
