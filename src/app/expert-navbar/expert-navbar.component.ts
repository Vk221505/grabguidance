import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import {isPlatformBrowser} from "@angular/common";


@Component({
  selector: 'app-expert-navbar',
  templateUrl: './expert-navbar.component.html',
  styleUrls: ['./expert-navbar.component.css']
})
export class ExpertNavbarComponent implements OnInit {

  expertId: string;
  expertName: string;
  Imgurl: any;
  isAdmin: any;
  userType: string;
  expertSubscription: Subscription;

  constructor(
    private route: Router,
    private apiService: ApiService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = localStorage.getItem('isadmin');
  }

  ngOnInit(): void {
    this.userType = localStorage.getItem('user_role');
    this.expertId = localStorage.getItem('id_expert');
    this.expertName = localStorage.getItem('expert_name');
    if (this.userType == 'expert') {
      this.fetchProfilePitcher();
    } else {
      this.Imgurl = localStorage.getItem('admin_pic');
      if (!this.Imgurl) {
        this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
      }
    }
  }

  fetchProfilePitcher() {
    this.apiService.fetchProfilePitcher(this.expertId)
      .subscribe((data: any) => {
        if (data.code == 1000) {
          this.Imgurl = data.file;
        } else {
          this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
        }
      })
  }


  viewPublicProfile() {
    this.route.navigateByUrl('/expert/' + this.expertId + '/' + this.expertName);
  }

  logout() {
    if(isPlatformBrowser(this.platformId)){
      localStorage.clear();
      sessionStorage.clear();
      this.dataService.setUserLoggingStatus(null);
      this.route.navigate(['/']);
    }
  }

  editProfile() {
    this.route.navigate(['/expert/profile']);
  }

  dashboard() {
    if (this.userType == 'admin') {
      this.route.navigate(['admin/dashboard']);
    } else if (this.userType == 'user') {
      this.route.navigate(['user/dashboard']);
    } else {
      this.route.navigate(['expert/dashboard'])
    }
  }

  navigateToLogin() {
    this.route.navigate(['/']);
  }

  navigateUrl(route: string) {
    this.route.navigate([route], { relativeTo: this.activatedRoute })
  }
}
