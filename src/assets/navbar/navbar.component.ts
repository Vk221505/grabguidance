import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy{

  @Input('isFromLogin') isFromLogin: Boolean;
  dropdownData: string[];
  filteredResults: any[];
  isUserLoggedIn: string;
  loggedInUserName: string;
  id_expert: any
  isAdmin: any;
  id_user: any;
  Imgurl: string;
  userType: string;
  userStatus: Subscription;
  searchCriteriaSub: Subscription;
  currentUrl: string = "";
  criteria: any;
  open: boolean = false;
  username: string;

  constructor(
    private route: Router,
    private apiService: ApiService,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = localStorage.getItem('isadmin');
    this.isUserLoggedIn = "false";
    this.userType = localStorage.getItem('user_role');
    this.username = localStorage.getItem('user_name');
    this.route.events.subscribe( event => {
      if(event instanceof NavigationEnd) {
         this.currentUrl = event.url.split("/")[1];
      }
   })
  }

openSideNav() {
  this.open = !this.open
}

  ngOnDestroy() {
    if(this.userStatus) {
      this.userStatus?.unsubscribe();
    }
    if(this.searchCriteriaSub) {
      this.searchCriteriaSub?.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.userStatus = this.dataService.isUserLoggedInSub$
         .subscribe( data => {
            this.isUserLoggedIn = data;
            this.fetchDataFromLocalStorage();
         })

    this.searchCriteriaSub = this.dataService.searchCriteriaSub$.subscribe( searchCriteria => {
          this.criteria = searchCriteria;
    })
  }

  fetchDataFromLocalStorage() {
    this.userType = localStorage.getItem('user_role');
    this.id_user = localStorage.getItem('id_user');
    this.id_expert = localStorage.getItem('id_expert');
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
    this.apiService.fetchProfilePitcher(this.id_expert)
      .subscribe((data: any) => {
        if (data.code == 1000) {
          this.Imgurl = data.file;
        } else {
          this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
        }
      })
  }

  fetchUserProfilePitcher() {
    if (this.id_user) {
      this.apiService.getUserProfilePitcher(this.id_user)
        .subscribe(data => {
          if (data.code == 1000) {
            this.Imgurl = data.file;
          } else {
            this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
          }
        })
    }
  }

  dashBoard() {
    if (this.userType == 'admin') {
      this.route.navigate(['admin/dashboard']);
    } else if (this.userType == 'user') {
      this.route.navigate(['user/dashboard']);
    } else {
      this.route.navigate(['expert/dashboard'])
    }
  }

  createImgUrl() {
    if (this.Imgurl) {
      return this.Imgurl
    } else {
      return "../../assets/images/Grabguidance PP@2x.png";
    }
  }

  search(event) {
    let filtered: any[] = [];
    for (let i = 0; i < this.dropdownData.length; i++) {
      let data = this.dropdownData[i];
      if (data.indexOf(event.query) == 0) {
        filtered.push(data);
      }
    }
    this.filteredResults = filtered;
  }

  loginScreen() {
    this.apiService.openExpertSignInModal("User Login");
  }

  becomeAnExpert() {
    this.apiService.openExpertSignInModal("Expert Login");
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
      this.Imgurl = null;
      this.dataService.setUserLoggingStatus(null);
      this.route.navigate(['/']);
    }
  }

  editProfile() {
    if (this.userType == 'user') {
      this.route.navigate(['/user/profile']);
    } else {
      this.route.navigate(['/expert/profile']);
    }
  }

  navigate() {
    this.route.navigate(['/']);
  }

}
