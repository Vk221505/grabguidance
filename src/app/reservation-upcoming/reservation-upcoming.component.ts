import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { isPlatformBrowser } from '@angular/common';


declare var $: any;
declare let ga: Function;


@Component({
  selector: 'app-reservation-upcoming',
  templateUrl: './reservation-upcoming.component.html',
  styleUrls: ['./reservation-upcoming.component.css']
})



export class ReservationUpcomingComponent implements OnInit {

  upcomingSessions: any[] = [];
  userType: string;
  expertId: any;
  userId: string
  sessionInfo: any;
  subjectGuidance: any;
  selectedSessionId: any;
  selectedMulti: number;
  joiningList: { name: string; profession: string; pic: any }[] = [];
  sessionDetails: boolean = false;
  userReasons: string[];
  expertReasons: string[];
  userResheduleText: string;
  userCancelText: string;
  expertResheduleText: string;
  expertCancelText: string;
  selectedReasons: string[];
  selectedText: string;
  reason: string = '';
  isReasonSelected: boolean = false;
  selectedSessionDuration: number;
  rescheduleAvaibility: any[];
  selectedSessionprice: string;
  sessionToBeReplaced: any;
  isEditSession: boolean = false;
  minLeftForSession: number;

  @ViewChildren('sessiontab') sessiontab: QueryList<ElementRef>;


  constructor(private apiService: ApiService,
    private tostr: ToastrService,
    private dataService: DataService,
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.userReasons = this.dataService.getUserReason();
    this.expertReasons = this.dataService.getExpertReason();
    this.userResheduleText = this.dataService.getUserRescheduleText();
    this.userCancelText = this.dataService.getUserCancelText();
    this.expertResheduleText = this.dataService.getExpertRescheduleText();
    this.expertCancelText = this.dataService.getExpertCancelText();
    this.userType = localStorage.getItem('user_role');
    this.expertId = localStorage.getItem('id_expert');
    this.userId = localStorage.getItem('id_user');
    this.getUpcomingSession();
    this.rescheduleAvaibility = [];
  }

  

  cardClick() {
    alert("entered")
  }

  ngAfterViewInit() {
    this.sessiontab.changes.subscribe(() => {
      this.sessiontab.first.nativeElement.click()
    })

    this.route.events.subscribe(event => {
      // I check for isPlatformBrowser here because I'm using Angular Universal, you may not need it
      if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
        console.log(ga); // Just to make sure it's actually the ga function
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }

  getUpcomingSession() {
    if (this.userType == 'user') {
      this.apiService.getUserUpcomingSessions(this.userId)
        .subscribe(data => {
          this.formingSessionApi(data);
        })
    } else {
      this.apiService.getUpcominReservationSession(this.expertId)
        .subscribe(data => {
          if (data.code == 1000) {
            this.formingSessionApi(data);
          }
        })
    }
  }

  formingSessionApi(data: any) {
    if (data) {
      this.upcomingSessions = data.recentRecords;
    }
    if (this.upcomingSessions && this.upcomingSessions?.length > 0) {
      let firstsession = this.upcomingSessions[0];
      this.getSessionInfo(firstsession.multi, firstsession.id_session)
    }

    if (this.upcomingSessions?.length == 0) {
      this.sessionDetails = false;
    }
  }

  formatSessionDate(date: string) {
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
    this.selectedSessionDuration = moment(endTime).diff(moment(startTime), "minutes");
    return this.selectedSessionDuration;
  }

  createTimeFormat(date) {
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let currentDateTime = currentDate + "T" + date + "+05:30";
    return moment(currentDateTime).format('h:mm a');
  }

  createDayFromDate(date: any) {
    return moment(date).format('ddd');
  }

  createImageUrl(data: any) {
    if (data) {
      return data;
    }
    return "../../assets/images/Grabguidance PP@2x.png";
  }


  getSessionInfo(multi: any, sessionId: any) {
    if (multi == 0) {
      this.apiService.getSingleSession(sessionId)
        .subscribe(data => {

          console.log("User data", data)
          this.sessionDetails = true;
          this.selectedSessionId = data.appointment.id_session
          this.selectedMulti = data.appointment.multi;
          this.sessionInfo = data.appointment;
          this.expertId = data.appointment.id_expert
          this.subjectGuidance = data.appointment.subject_guidance;
          this.joiningList[0] = { name: data.appointment.user_name, profession: "You", pic: data.appointment.user_pic }
          this.joiningList[1] = { name: data.appointment.expert_name, profession: 'expert', pic: data.appointment.expert_pic }
          this.joiningList[2] = { name: 'GrabGuidance Moderator', profession: 'A supervisor from the company may join the room for quality & traning purposes', pic: null }
          this.calculateTimeLeftForSession();
        })
    } else {
      this.apiService.getMultiSession(sessionId)
        .subscribe(data => {
          this.sessionDetails = true;
          this.selectedSessionId = data.appointment.id_session
          this.selectedMulti = data.appointment.multi;
          this.expertId = data.appointment.id_expert
          this.sessionInfo = data.appointment;
          this.subjectGuidance = data.appointment.subject_guidance;
          this.joiningList[0] = { name: data.appointment.user_name, profession: "You", pic: data.appointment.user_pic.data }
          this.joiningList[1] = { name: data.appointment.expert_name, profession: 'expert', pic: data.appointment.expert_pic.data }
          this.joiningList[2] = { name: "GrabGuidance Moderator", profession: 'A supervisor from the company may join the room for quality & traning purposes', pic: null }
          this.calculateTimeLeftForSession();
        })
    }
  }

  calculateTimeLeftForSession() {
    let today = moment();
    let sesiionDate = this.sessionInfo.date.split('T')[0];
    let sessionStartTime = moment(sesiionDate + "T" + this.sessionInfo.start_time);
    this.minLeftForSession = moment(sessionStartTime).diff(today, 'minutes');
  }

  joinSession() {
    let agoraObj = {
      sessionId: this.selectedSessionId,
      multi: this.selectedMulti,
      id_expert: this.expertId,
      expertName: this.sessionInfo.expert_name,
      expert_pic: this.sessionInfo.expert_pic,
      id_user: this.sessionInfo.id_user,
      userName: this.sessionInfo.user_name,
      user_pic: this.sessionInfo.user_pic,
      supervisor: this.sessionInfo.supervisior
    }
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('agoraObj', JSON.stringify(agoraObj));
      this.route.navigate(['/agora-test'])
    }
  }

  resheduleSession() {
    if (this.userType == 'user') {
      this.selectedText = this.userResheduleText;
      this.selectedReasons = this.userReasons;
    }
    if (this.userType == 'expert') {
      this.selectedText = this.expertResheduleText;
      this.selectedReasons = this.expertReasons;
    }
    this.reason = "";
    if (isPlatformBrowser(this.platformId)) {
      $("#resheduleSession").modal("show");
    }

  }

  reasonSelected() {
    this.isReasonSelected = true;
  }

  next() {
    if (isPlatformBrowser(this.platformId)) {
      $("#resheduleSession").modal("hide");
      if (this.selectedSessionDuration == 60) {
        let dateAfter15hours = moment(new Date()).add(15, "hours").format();
        let dateAfter15Days = moment(new Date()).add(15, "hours").format().split('T');
        let dateValue = dateAfter15Days[0];
        let timeValue = dateAfter15Days[1].split("+")[0];
        let dateAfter7Days = moment(dateAfter15hours).add(7, 'days').format("YYYY-MM-DD")
        this.apiService.userGetSixtySession(dateValue, timeValue, dateAfter7Days, this.expertId)
          .subscribe(data => {
            this.createAvailabalitySession(data.sixty);
            this.selectedSessionprice = data.price
            $("#resheduleAvaibilitySession").modal("show");
          })
      }
    }

    if (this.selectedSessionDuration == 40) {
      let dateAfter15hours = moment(new Date()).add(15, "hours").format();
      let dateAfter15Days = moment(new Date()).add(15, "hours").format().split('T');
      let dateValue = dateAfter15Days[0];
      let timeValue = dateAfter15Days[1].split("+")[0];
      let dateAfter7Days = moment(dateAfter15hours).add(7, 'days').format("YYYY-MM-DD")

      this.apiService.userGetFortySession(dateValue, timeValue, dateAfter7Days, this.expertId)
        .subscribe(data => {
          this.createAvailabalitySession(data.forty);
          this.selectedSessionprice = data.price
          if (isPlatformBrowser(this.platformId)) {
            $("#resheduleAvaibilitySession").modal("show");
          }
        })
    }

    if (this.selectedSessionDuration == 20) {
      let dateAfter15hours = moment(new Date()).add(15, "hours").format();
      let dateAfter15Days = moment(new Date()).add(15, "hours").format().split('T');
      let dateValue = dateAfter15Days[0];
      let timeValue = dateAfter15Days[1].split("+")[0];
      let dateAfter7Days = moment(dateAfter15hours).add(7, 'days').format("YYYY-MM-DD")
      this.apiService.userGetTwentySession(dateValue, timeValue, dateAfter7Days, this.expertId)
        .subscribe(data => {
          this.createAvailabalitySession(data.sixty);
          this.selectedSessionprice = data.price
          if (isPlatformBrowser(this.platformId)) {
            $("#resheduleAvaibilitySession").modal("show");
          }
        })
    }
  }

  createAvailabalitySession(showSessions: any) {
    let finalArray = [];
    showSessions.forEach((sessionArray: any) => {
      sessionArray.forEach((session: any) => {
        finalArray.push(session);
      })
    })
    this.rescheduleAvaibility = finalArray;
  }

  reschedulingSession() {
    this.apiService.resheduleSession(this.sessionInfo.id_session, this.sessionInfo.multi, this.sessionToBeReplaced.start_time,
      this.sessionToBeReplaced.end_time, this.sessionToBeReplaced.date, this.userType, this.reason)
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId)) {
          $("#resheduleSessionFinal").modal("hide");
          this.getUpcomingSession();
          this.tostr.success('Session Reschedule successfully');
        }
      }, (error) => {
        if (isPlatformBrowser(this.platformId)) {
          $("#resheduleSessionFinal").modal("hide");
          this.tostr.error('Error in rescheduling the session');
          $("#canceleSession").modal("hide");
        }
      })
  }


  openCancelSession(session: any) {
    if (this.userType == 'user') {
      this.selectedText = this.userCancelText;
      this.selectedReasons = this.userReasons;
    }
    if (this.userType == 'expert') {
      this.selectedText = this.expertCancelText;
      this.selectedReasons = this.expertReasons;
    }
    this.reason = "";
    if (isPlatformBrowser(this.platformId)) {
      $("#canceleSession").modal("show");
    }
  }

  cancelSession() {
    this.apiService.cancelSession(this.sessionInfo.id_session, this.sessionInfo.multi, this.reason, 'user')
      .subscribe(data => {
        if (isPlatformBrowser(this.platformId)) {
          this.upcomingSessions = this.upcomingSessions.filter(data => {
            return data.id_session != this.sessionInfo.id_session
          })
          this.formingSessionApi(null);
          this.tostr.success('Session canceled successfully');
          $("#canceleSession").modal("hide");
        }
      },
        (error) => {
          if (isPlatformBrowser(this.platformId)) {
            this.tostr.error('Error in cancelling the session');
            $("#canceleSession").modal("hide");
          }
        })
  }

  chooseSession(session: any) {
    if (isPlatformBrowser(this.platformId)) {
      $("#resheduleAvaibilitySession").modal("hide");
      this.sessionToBeReplaced = session;
      $("#resheduleSessionFinal").modal("show");
    }
  }
}
