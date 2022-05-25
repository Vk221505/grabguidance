import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from "moment";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { UtilityService } from 'src/services/utility.service';
import { CurrentSession } from '../models/admin.model';
import { SigninComponent } from '../signin/signin.component';


declare let ga: Function;

@Component({
  selector: 'app-user-dashboard-page',
  templateUrl: './user-dashboard-page.component.html',
  styleUrls: ['./user-dashboard-page.component.css']
})
export class UserDashboardPageComponent implements OnInit {

  userId: string;
  modalRef: BsModalRef;
  dummyJSONData: any;
  userProfile: any;
  upcomingEvent: CurrentSession[];
  emptySessions: any[];
  favouriteExperts: any[];
  dummyData: { name: string; education: string; experience: string; rating: string; reviews: string; ratePerSession: string; place: string; }[];


  constructor(
    private modalService: BsModalService,
    private apiService: ApiService,
    private UtilityService: UtilityService,
    private route: Router,
    private tostr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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

  ngOnInit(): void {
    this.userId = localStorage.getItem('id_user');
    this.getUserProfile();
    this.getRecentSession();
    this.getSavedExpertList();
  }

  gotoProfile(id: number, name: String) {
    this.route.navigate(['/expert/' + id + '/' + name]);
  }

  bookmarkExpert() { }

  getUserProfile() {
    this.apiService.getUserProfile(this.userId)
      .subscribe(data => {
        this.userProfile = data.user[0];
      })
  }

  getGender(value: any) {
    return this.UtilityService.getGender(value);
  }

  mouseEnter(rowData, value) {
    //rowData.showBookNow = true;
    rowData.showBookNowBtn = true;
  }

  mouseLeave(rowData, value) {
    rowData.showBookNowBtn = false;
  }

  getRecentSession() {
    this.apiService.getUserRecentSessions(this.userId)
      .subscribe(data => {
        if (data.code == 1000) {
          if (data.recentRecords.length > 3) {
            this.upcomingEvent = data.recentRecords.slice(0, 4);
          } else {
            this.upcomingEvent = data.recentRecords;
            let remaining = (3 - data.recentRecords.length)
            this.emptySessions = new Array(remaining);
          }
        } else {
          this.emptySessions = new Array(3);
        }
      })
  }

  createImageUrl(data: any) {
    if (data) {
      return data;
    }
    return "../../assets/images/image.png";
  }

  formatSessionDate(date: string) {
    return this.UtilityService.formatSessionDate(date);
  }

  calculateSessionDuration(sessionStart: string, sessionEnd: string, sessionDate: string) {
    return this.UtilityService.calculateSessionDuration(sessionStart, sessionEnd, sessionDate);
  }

  createTimeFormat(session_start: string) {
    return this.UtilityService.createTimeFormat(session_start);
  }

  formatDate(date: string) {
    return moment(date).format("MMM DD, YYYY");
  }

  getSavedExpertList() {
    this.apiService.getUserSavedExpertList(this.userId)
      .subscribe(data => {
        this.favouriteExperts = data.experts;
      })
  }

  editUserInfo() {
    this.route.navigate(['/user/profile']);
  }

  join() {
    this.modalRef = this.modalService.show(SigninComponent);
  }

  removeFavourite(expert: any) {
    if (expert.selected == 1) {
      expert.selected = 0
    }
    this.apiService.saveUserExpert(expert.id, this.userId, expert.selected)
      .subscribe(data => {
        if (data.code == 1000) {
          this.favouriteExperts = this.favouriteExperts.filter((exp: any) => {
            return exp.id != expert.id
          })
          this.tostr.success("Expert removed from favourite");
        }
      }, (error) => {
        this.tostr.error("Error in removing the expert from favourite")
      }
      )
  }
}
