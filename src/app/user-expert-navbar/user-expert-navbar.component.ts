import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-user-expert-navbar',
  templateUrl: './user-expert-navbar.component.html',
  styleUrls: ['./user-expert-navbar.component.css']
})
export class UserExpertNavbarComponent implements OnInit, OnDestroy {

  expertId: string;
  loggedInUserName: string;
  Imgurl: any = null;
  isSignUp: any;
  isAdmin: any;
  userId: string;
  userType: string
  open: boolean = false;
  username: string;
  userStatus: Subscription;
  isUserLoggedIn: string;

  constructor(
    private route: Router,
    private apiService: ApiService,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
     this.isSignUp = localStorage.getItem('isSignUp');
     this.isAdmin = localStorage.getItem('isadmin');
     this.userType = localStorage.getItem('user_role');
     this.expertId = localStorage.getItem('id_expert');
     this.userId = localStorage.getItem('id_user');
     this.username = localStorage.getItem('user_name')
     this.isUserLoggedIn = "false";
     this.loggedInUserName = localStorage.getItem('expert_name');
  }

  ngOnInit(): void {

    this.userStatus = this.dataService.isUserLoggedInSub$
    .subscribe( data => {
       this.isUserLoggedIn = data;
       this.fetchDataFromLocalStorage();
    })

    if(this.userType == 'expert'){
      this.fetchExpertProfilePitcher();
    }
    if(this.userType == 'admin') {
      this.Imgurl = localStorage.getItem('admin_pic');
      if(!this.Imgurl) {
        this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
      }
    }
    if(this.userType == 'user') {
      this.fetchUserProfilePitcher()
    }

  }

  ngOnDestroy() {
    if(this.userStatus) {
      this.userStatus?.unsubscribe();
    }
  }


  fetchDataFromLocalStorage() {
    this.userType = localStorage.getItem('user_role');
    this.Imgurl = localStorage.getItem('admin_pic');
    if (this.userType && this.userType == "user") {
      this.fetchUserProfilePitcher();
    }
    if (this.userType && this.userType == "expert") {
      this.fetchExpertProfilePitcher();
    }
    if(!this.Imgurl) {
      this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
    }
  }

  fetchExpertProfilePitcher() {
    this.apiService.fetchProfilePitcher(this.expertId)
       .subscribe( (data: any)=> {
        if(data.code == 1000) {
          this.Imgurl = data.file;
         } else {
          this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
         }
       })
 }

 fetchUserProfilePitcher() {
  this.apiService.getUserProfilePitcher(this.userId)
     .subscribe( data => {
       if(data.code == 1000) {
        this.Imgurl = data.file;
        } else {
          this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
        }
     })
}


  logout(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
      this.dataService.setUserLoggingStatus(null);
      this.route.navigate(['/']);
    }
  }

  navigateToDashboard(){
    if(this.userType == 'admin'){
      this.route.navigateByUrl('/admin/dashboard');
    }  else if(this.userType == 'user') {
      this.route.navigateByUrl('/user/dashboard');
    } else {
      this.route.navigateByUrl('/expert/dashboard');
    }

  }

  navigate() {
    this.route.navigate(['/']);
  }

  openSideNav() {
    this.open = !this.open
  }

}
