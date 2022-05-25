import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent implements OnInit {

  isAdmin: string;
  userType: string;
  userId: string ;
  Imgurl: any;

  constructor(private route: Router,
              private dataService: DataService,
              private apiService: ApiService,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
   this.userType = localStorage.getItem('user_role');
   this.isAdmin = localStorage.getItem('isadmin');
   this.userId = localStorage.getItem('id_user');
   if(this.userType == "admin") {
      if(localStorage.getItem('admin_pic')) {
         this.Imgurl = localStorage.getItem('admin_pic');
      } else {
        this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
      }

   } else {
      this.fetchProfilePitcher();
   }
  }

  editProfile() {
     this.route.navigate(['/user/profile']);
  }

  fetchProfilePitcher() {
    console.log("dsafsd");
    this.apiService.getUserProfilePitcher(this.userId)
       .subscribe( data => {
         if(data.code == 1000) {
           this.Imgurl = data.file;
          } else {
            this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
          }
       })
     }


dashboard() {
  if(this.userType = "admin" && this.isAdmin) {
    this.route.navigate(['/admin/dashboard']);
  } else {
    this.route.navigate(['/user/dashboard'])
  }
}

  logout(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
      this.dataService.setUserLoggingStatus(null);
      this.route.navigate(['/']);
    }
  }

  bookSession() {
     this.route.navigate(['/']);
  }

}
