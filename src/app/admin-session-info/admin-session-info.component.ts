import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import {isPlatformBrowser} from "@angular/common";


declare var $: any;

@Component({
  selector: 'app-admin-session-info',
  templateUrl: './admin-session-info.component.html',
  styleUrls: ['./admin-session-info.component.css']
})
export class AdminSessionInfoComponent implements OnInit {

  uupcomingSessions: any[];
  userType: string;
  expertId: any;
  userId: string
  sessionInfo: any;
  subjectGuidance: any;
  selectedSessionId: any;
  selectedMulti: number;
  joiningList: { name: string; profession: string; pic: any, userId: string }[] = [];
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
  selectedSessionDuration: any;
  rescheduleAvaibility: any[];
  selectedSessionprice: string;
  sessionToBeReplaced: any;
  isEditSession: boolean = false;
  minLeftForSession: number;
  sessionId: any;
  multi: any;
  sessionBtn: string;
  sessionString: string;
  status: string;



  constructor(private apiService: ApiService,
    private tostr: ToastrService,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object) { }

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
    this.sessionId = localStorage.getItem('id_session');
    this.multi = localStorage.getItem('multi');
    this.rescheduleAvaibility = [];
    this.status = localStorage.getItem('status');
    this.getSessionInfo(this.multi, this.sessionId);
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
   return "../../assets/images/Grabguidance PP@2x.png"
  
  }


  getSessionInfo(multi: any, sessionId: any) {
    if (multi == 0) {

      this.apiService.getSingleSession(sessionId)
        .subscribe(data => {
          // console.log("hhhhhhh" + data);
          localStorage.setItem('id_user', data.appointment.id_user)
          this.sessionDetails = true;
          this.selectedSessionId = data.appointment.id_session
          this.selectedMulti = data.appointment.multi;
          this.sessionInfo = data.appointment;
          this.expertId = data.appointment.id_expert
          this.subjectGuidance = data.appointment.subject_guidance;
          this.joiningList[0] = { name: data.appointment.user_name, profession: "User", pic: data.appointment.user_pic, userId: data.appointment.id_user }
          this.joiningList[1] = { name: data.appointment.expert_name, profession: 'expert', pic: data.appointment.expert_pic, userId: 'NA' }
          this.joiningList[2] = { name: "GrabGuidance Moderator", profession: 'A supervisor from the company may join the room for quality & traning purposes', pic: '../../assets/images/Asset 5.png', userId: 'NA' }
          this.calculateTimeLeftForSession();
          console.log("===111====" + JSON.stringify(this.joiningList));
        })
    } else {
      this.apiService.getMultiSession(sessionId)
        .subscribe(data => {
          console.log("hhhhhhh" + data);
          this.sessionDetails = true;
          this.selectedSessionId = data.appointment.id_session
          this.selectedMulti = data.appointment.multi;
          this.sessionInfo = data.appointment;
          this.subjectGuidance = data.appointment.subject_guidance;
          this.joiningList[0] = { name: data.appointment.user_name, profession: "User", pic: data.appointment.user_pic.data, userId: data.appointment.id_user }
          this.joiningList[1] = { name: data.appointment.expert_name, profession: 'expert', pic: data.appointment.expert_pic.data, userId: 'NA' }
          this.joiningList[2] = { name: data.appointment.supervisior, profession: 'A supervisor from the company may join the room for quality & traning purposes', pic: '../../assets/images/Asset 5.png', userId: 'NA' }
          this.calculateTimeLeftForSession();
        })
    }
    console.log("===111====" + this.joiningList);
  }

  calculateTimeLeftForSession() {
    let today = moment();
    let sesiionDate = this.sessionInfo.date.split('T')[0];
    let sessionStartTime = moment(sesiionDate + "T" + this.sessionInfo.start_time);
    this.minLeftForSession = moment(sessionStartTime).diff(today, 'minutes');
    if (this.minLeftForSession > 0 && this.status == "Upcoming") {
      this.sessionBtn = "Join the Session"
      this.sessionString = "Upcoming"
    } else if (this.status == "Completed") {
      this.sessionBtn = "View the Session"
      this.sessionString = "Completed";
    } else {
      this.sessionBtn = this.status;
      this.sessionString = null;
    }
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
    if(isPlatformBrowser(this.platformId)){
      sessionStorage.setItem('agoraObj', JSON.stringify(agoraObj));
      this.route.navigate(['/agora-test'])
    }
  }

  resheduleSession() {
    this.selectedText = this.userResheduleText;
    this.selectedReasons = this.userReasons;
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
    }
    let dateAfter15hours = moment(new Date()).add(15, "hours").format();
    let dateAfter15Days = moment(new Date()).add(15, "hours").format().split('T');
    let dateValue = dateAfter15Days[0];
    let timeValue = dateAfter15Days[1].split("+")[0];
    let dateAfter7Days = moment(dateAfter15hours).add(7, 'days').format("YYYY-MM-DD")
    let sessionDuration = this.calculateSessionDuration(this.sessionInfo?.start_time, this.sessionInfo?.end_time)
    console.log(sessionDuration);
    if (this.selectedSessionDuration == 60) {
      this.apiService.userGetSixtySession(dateValue, timeValue, dateAfter7Days, this.expertId)
        .subscribe(data => {
          this.createAvailabalitySession(data.sixty);
          this.selectedSessionprice = data.price
          if (isPlatformBrowser(this.platformId)) {
            $("#resheduleAvaibilitySession").modal("show");
          }
        })
    }

    if (this.selectedSessionDuration == 40) {
      this.apiService.userGetFortySession(dateValue, timeValue, dateAfter7Days, this.expertId)
        .subscribe(data => {
          console.log(data);
          this.createAvailabalitySession(data.forty);
          this.selectedSessionprice = data.price
          if (isPlatformBrowser(this.platformId)) {
            $("#resheduleAvaibilitySession").modal("show");
          }
        })
    }

    if (this.selectedSessionDuration == 20) {
      this.apiService.userGetTwentySession(dateValue, timeValue, dateAfter7Days, this.expertId)
        .subscribe(data => {
          console.log(data);
          this.createAvailabalitySession(data.twenty);
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
        }
        this.route.navigate(['/admin-sessions'])
      }, (error) => {
        if (isPlatformBrowser(this.platformId)) {
          $("#resheduleSessionFinal").modal("hide");
          this.tostr.error('Error in rescheduling the session');
        }
      })
  }


  openCancelSession(session: any) {
    this.selectedText = this.userCancelText;
    this.selectedReasons = this.userReasons;
    this.reason = "";
    if (isPlatformBrowser(this.platformId)) {
      $("#canceleSession").modal("show");
    }
  }

  cancelSession() {
    this.apiService.cancelSession(this.sessionInfo.id_session, this.sessionInfo.multi, this.reason, 'admin')
      .subscribe(data => {
        if (isPlatformBrowser(this.platformId)) {
          $("#canceleSession").modal("hide");
          this.route.navigate(['/admin-sessions'])
        }
      },
        (error) => {
          if (isPlatformBrowser(this.platformId)) {
            $("#canceleSession").modal("hide");
            this.tostr.error('Error in cancelling the session');
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

  info(data) {
    console.log(data)
    if (data == 'User') {
      this.route.navigate(['user/dashboard'])
    } else if (data == 'expert') {
      this.route.navigate(['expert/dashboard'])
    }
  }
}
