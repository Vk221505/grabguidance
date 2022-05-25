import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from "@angular/common";

declare let ga: Function;

@Component({
  selector: 'app-reservation-past',
  templateUrl: './reservation-past.component.html',
  styleUrls: ['./reservation-past.component.css']
})
export class ReservationPastComponent implements OnInit, AfterViewInit {
  pastSessions: any;
  expertId: any;
  userId: string;
  userType: string;
  sessionInfo: any;
  subjectGuidance: any;
  joiningList: { name: string; profession: string; pic: string }[] = [];
  sessionDetails: boolean = false;
  @ViewChildren('sessiontab') sessiontab: QueryList<ElementRef>;
  imgPath: any;
  heroes = [
    {
      id: 1,
      Name: "Workout",
      Time: "6:00 am",
      Location: "Newton Park",
      Description: "Health is Wealth.",
      Agenda: "300cAl burn."
    },
    {
      id: 2,
      Name: "Product review",
      Time: "10:30 am",
      Location: "TCS Sipcot",
      Description: "Reviewing the new version of the existing project.",
      Agenda: "Fulfill client's requirements."
    },
    {
      id: 3,
      Name: "Meeting",
      Time: "6:00 pm",
      Location: "Taj Residency",
      Description: "Very useless meeting, Could be emailed as well.",
      Agenda: "Same fking boot licking"
    }
  ];

  constructor(private apiService: ApiService, 
              private router: Router, 
              @Inject(PLATFORM_ID) private platformId: Object) {}
  

  ngOnInit(): void {
    this.expertId = localStorage.getItem('id_expert');
    this.userId = localStorage.getItem('id_user');
    this.userType = localStorage.getItem('user_role');
    this.getpastSession();
    this.getVieo();
  }

  getVieo() {
    var video = this.heroes.map(hero => hero.Name);
    console.log(video);
  }
  cardClick() {
    alert("entered");
  }

  ngAfterViewInit() {
    this.sessiontab.changes.subscribe(() => {
      this.sessiontab.first.nativeElement.click()
    })

    this.router.events.subscribe(event => {
      // I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
      if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
        console.log(ga); // Just to make sure it's actually the ga function
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  createImageUrl(data: any) {
    if (data) {
      return data;
    }
    return "../../assets/images/Asset 5.png";
  }

  viewImage() {
    this.openInNewTab(this.router, '/view-image');
  }

  openInNewTab(router: Router, namedRoute) {
    let newRelativeUrl = router.createUrlTree([namedRoute], {

      queryParams: { path: this.sessionInfo?.attachment },
      queryParamsHandling: "merge",
      preserveFragment: true
    });

    if(isPlatformBrowser(this.platformId)){
      let baseUrl = window.location.href.replace(router.url, '');
      window.open(baseUrl + newRelativeUrl, '_blank');
    }
  }

  appendAQueryParam() {

    const urlTree = this.router.createUrlTree([], {
      queryParams: { newParamKey: 'newValue' },
      queryParamsHandling: "merge",
      preserveFragment: true
    });

    this.router.navigateByUrl(urlTree);
  }

  getpastSession() {
    if (this.userType == 'expert' || this.userType == 'admin') {
      this.apiService.getPastReservationSession(this.expertId)
        .subscribe(data => {
          if (data.code == 1000) {
            this.formingSessionApi(data);
          }
        })
    }
    if (this.userType == 'user' || this.userType == 'admin') {
      this.apiService.getUserPastSessions(this.userId)
        .subscribe(data => {
          this.formingSessionApi(data);
        })
    }

    if (this.userType == 'admin') {
      this.apiService.getUserPastSessions(this.userId)
        .subscribe(data => {
          this.formingSessionApi(data);
        })
    }
  }

  formingSessionApi(data: any) {
    this.pastSessions = data.recentRecords;
    if (this.pastSessions && this.pastSessions.length > 0) {
      let firstsession = this.pastSessions[0];
      this.getSessionInfo(firstsession.multi, firstsession.id_session)
    }
  }

  formatSessionDate(date) {
    var todaysDate = moment(new Date()).format().split("T")[0];
    var endDate = moment(date).format().split("T")[0];
    var diff = moment(endDate).diff(moment(todaysDate), 'days');
    if (diff === 0) {
      return "Today";
    }
    return moment(date).format('Do MMM YYYY');
  }


  calculateSessionDuration(sessionStart, sessionEnd) {
    var dateTime = moment(new Date()).format().split("T");
    let startTime = dateTime[0] + "T" + sessionStart + "+05:30"
    let endTime = dateTime[0] + "T" + sessionEnd + "+05:30"
    return moment(endTime).diff(moment(startTime), "minutes");
  }

  createTimeFormat(date) {
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let currentDateTime = currentDate + "T" + date + "+05:30";
    return moment(currentDateTime).format('h:mm a');
  }

  createDayFromDate(date: any) {
    return moment(date).format('ddd');
  }

  getSessionInfo(multi: any, sessionId: any) {
    if (multi == 0) {
      if (sessionId) {
        this.apiService.getSingleSession(sessionId)
          .subscribe(data => {
            this.sessionDetails = true;
            this.sessionInfo = data.appointment;
            this.subjectGuidance = data.appointment.subject_guidance;
            this.joiningList[0] = { name: data.appointment.user_name, profession: "You", pic: data.appointment.user_pic }
            this.joiningList[1] = { name: data.appointment.expert_name, profession: 'expert', pic: data.appointment.expert_pic }
            this.joiningList[2] = { name: "GrabGuidance Moderator", profession: 'A supervisor from the company may join the room for quality & traning purposes', pic: null }

          })
      }
    } else {
      this.apiService.getMultiSession(sessionId)
        .subscribe(data => {
          console.log(data);
        })
    }

  }
}
