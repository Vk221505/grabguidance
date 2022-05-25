import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { UtilityService } from 'src/services/utility.service';
import * as moment from 'moment';
import { CurrentSessionResponse } from '../models/admin.model';
import { isPlatformBrowser } from "@angular/common";

declare var $: any;
declare let ga: Function;


@Component({
  selector: 'app-expert-dasboard-page',
  templateUrl: './expert-dasboard-page.component.html',
  styleUrls: ['./expert-dasboard-page.component.css']
})
export class ExpertDasboardPageComponent implements OnInit {

  dummyJSONData: any;
  summaryData: any;
  expertId: string;
  expertDetails: any;
  overallRating: number;
  sessionData: any;
  documents: any[] = [];
  currentSessions: any[] = [];
  emptySessions: any[] = [];
  expertIn: any;
  imgUrl: any;
  isAdmin: any;
  currentMonth: string;
  slotDisplay = [];
  userId = null;
  address
  pan
  constructor(
    private route: Router,
    private apiService: ApiService,
    private utilityService: UtilityService,
    private utilitySerive: UtilityService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = localStorage.getItem('isadmin');
  }

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

  ngOnInit() {

    this.expertId = localStorage.getItem('id_expert');
    this.expertIn = [];
    this.fetchExpertDetails();
    this.fetchProfilePitcher();
    this.fetchProfileDocument();
    this.slots();
  }

  editListing() {
    this.navigateToEditProfile('/expert/profile');
  }

  downloadSessionDetails() {
    this.apiService.downloadExpertSessions(this.expertId)
      .subscribe(response => {
        this.downLoadFile(response, "text/csv; charset=utf-8", "sessions_report.csv")
      })
  }

  downLoadFile(data: any, type: string, filename: string) {
    const blob = new Blob([data], { type: type });
    if (isPlatformBrowser(this.platformId)) {

      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }

  }


  getCurrentMonth() {
    return moment().format('MMMM');
  }

  addBankDetails() {
    if (isPlatformBrowser(this.platformId)) {
      $("#addBankDetailsModal").modal("show");
    }
  }

  setTwoPointer(value: string) {
    return parseFloat(value).toFixed(2);
  }

  fetchExpertDetails() {
    this.apiService.fetchUserExpertDetails(this.expertId, this.userId).subscribe(res => {
      if (res.code == 1000) {
        this.expertDetails = res['experts'];
        this.address = this.expertDetails.address
        this.pan = this.expertDetails.pan

        console.log("hjhj ", this.pan)
        this.overallRating = this.calculateOverallRating(this.expertDetails.review);
        this.expertDetails.subject.forEach(subject => {
          this.expertIn.push(subject.subject_name);
        });
        this.expertDetails.personalGuidance.forEach(personalGuidance => {
          this.expertIn.push(personalGuidance.guidance_name);
        });
      }
    });
    this.getRecentSessions();
  }

  calculateOverallRating(reviews: any[]) {
    if (reviews && reviews.length > 0) {
      let ratingCount = reviews.length;
      let sum: number = 0;
      reviews.forEach(review => {
        sum = sum + (+review.rating);
      })
      return (sum / ratingCount);
    }
    return 0;
  }


  fetchProfilePitcher() {
    this.apiService.fetchProfilePitcher(this.expertId)
      .subscribe((data: any) => {
        if (data.code == 1000) {
          this.imgUrl = data.file;
        } else {
          this.imgUrl = "../../assets/images/image.png";
        }
      })
  }

  fetchProfileDocument() {
    this.apiService.fetchDocumentPitcher(this.expertId)
      .subscribe((data: any) => {
        if (data.code == 1000) {
          this.documents = data.documents;
        }
      })
  }

  createTimeFormat(date: any) {
    return this.utilitySerive.createTimeFormats(date);
  }

  slots() {
    this.apiService.slots(this.expertId).subscribe(res => {
      let slots = res.slots
      if (Object.keys(slots).length === 0) {
        this.slotDisplay = null;
      } else {
        console.log(slots);
        for (let day in slots) {
          this.slotDisplay.push({
            'weekday': day,
            'timing': slots[day]
          })
        }
      }
    })
  }

  upcomingSession(data) {
    this.route.navigate(['/expert/sessions/upcoming']);
  }

  getRecentSessions() {
    this.apiService.getRecentSessions(this.expertId)
      .subscribe((data: CurrentSessionResponse) => {
        if (data.code == 1000) {
          if (data.recentRecords.length > 3) {
            this.currentSessions = data.recentRecords.slice(0, 3);
          } else {
            this.currentSessions = data.recentRecords;
            let remaining = (3 - data.recentRecords.length)
            this.emptySessions = new Array(remaining);
          }
        } else {
          this.emptySessions = new Array(3);
        }
      })
  }

  formatSessionDate(date: string) {
    return this.utilityService.formatSessionDate(date);
  }


  calculateSessionDuration(sessionStart: string, sessionEnd: string, sessionDate: string) {
    return this.utilityService.calculateSessionDuration(sessionStart, sessionEnd, sessionDate);
  }


  navigateToEditProfile(route: string) {
    this.route.navigate([route]);
  }

}

