import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import * as moment from 'moment';
import { AdminSessionResponse } from '../models/admin.model';
import {isPlatformBrowser} from "@angular/common";


@Component({
  selector: 'app-admin-sessions',
  templateUrl: './admin-sessions.component.html',
  styleUrls: ['./admin-sessions.component.css']
})
export class AdminSessionsComponent implements OnInit {

  cols: any;
  resultSet: any;
  totalSessions: number;
  lastCreatedDate: any;

  constructor(
    private route: Router,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'sno', header: 'S.NO.', width: '4%' },
      { field: 'userName', header: 'USER', width: '12%' },
      { field: 'expert', header: 'EXPERT', width: '12%' },
      { field: 'sessionDuration', header: 'SESSION DURATION', width: '12%' },
      { field: 'price', header: 'PRICE', width: '12%' },
      { field: 'createdOn', header: 'CREATED ON', width: '12%' },
      { field: 'scheduleon', header: 'SCHEDULED ON', width: '12%' },
      { field: 'sessiontime', header: 'TIME (IST)', width: '12%' },
      { field: 'status', header: 'STATUS', width: '12%' }
    ];
    this.resultSet = [];
    this.fetchAdminSessions();
    localStorage.removeItem('id_user');
    localStorage.removeItem('id_expert');
  }

  viewProfile() {
    this.route.navigate(['/expert-profile-details']);
  }

  downloadSession() {
    this.apiService.adminDownloadAllSession()
      .subscribe(response => this.downLoadFile(response, "text/csv; charset=utf-8'"))
  }

  downLoadFile(data: any, type: string) {
    const blob = new Blob([data], { type: type });
    if(isPlatformBrowser(this.platformId)){
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'session.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
   
  }

  fetchAdminSessions() {
    this.apiService.fetchAdminSessionList()
      .subscribe((data: AdminSessionResponse) => {
        this.totalSessions = data.recentRecords.length;
        this.lastCreatedDate = this.formatSessionDate(data.recentRecords[0].add_date);
        if (data.recentRecords.length > 0) {
          data.recentRecords.forEach((session, i) => {
            this.resultSet.push({
              sno: i + 1,
              userName: session.user_name,
              expert: session.expert_name,
              expertId: session.id_expert,
              multi: session.multi,
              sessionId: session.id_session,
              sessionDuration: this.calculateSessionDuration
                (session.session_start, session.session_end, session.session_date) + " min",

              sessiontime: this.createSessionTime(session.session_start, session.session_end),
              price: session.price,
              createdOn: this.formatSessionDate(session.add_date),
              scheduleon: this.formatSessionDate(session.session_date),
              lastEdited: this.getLastUpdated(session.recheduled, session.recheduled_on, session.cancelled, session.cancelled_on, session.session_date),
              status: this.getStatus(session.session_date, session.session_start, session.status)
            })
          })
        }
      }
      )
  }

  formatSessionDate(date) {
    // return moment(date).format('Do MMM YYYY')
    return moment(date).format('YYYY-MM-Do')
    // return moment(date).format('MM-Do-YYYY')
  }

  getLastUpdated(resheduledBy: string, rescheduleDate: string, cancelledBy: string, cancelledOn: string, scheduledOn: string) {
    if (!resheduledBy && !cancelledBy) {
      return this.formatSessionDate(scheduledOn) + ' by user'
    } else if (resheduledBy && !cancelledBy) {
      return 'reschedule by ' + resheduledBy;
    } else {
      return 'cancelled by ' + cancelledBy;
    }
  }

  getStatus(date: any, startTime: any, status: any) {
    if (status == -1) {
      return "Cancelled";
    }
    if (status == 0) {
      return "Not-Booked"
    }
    var today = moment().format().split("T")[0]
    var split = today.toString().split("T")

    var sessionDate = date.split("T")[0];
    let sessionTime = sessionDate + "T" + startTime;
    var diff = moment(sessionTime).diff(today, "minutes")

    // if (((sessionDate > today) || ((sessionDate == today) && (startTime > moment().format().split("T")[1].split("+")[0])))) {
    //   console.log("sessionDate " , sessionDate )
    //   console.log("today " , today )

    //   console.log("today time " , moment().format().split("T")[1].split("+")[0])
    //   console.log("start time " , startTime)


    //   console.log(sessionDate > today)
    //   console.log(startTime > moment().format().split("T")[1].split("+")[0])


    //   return "Upcoming";

    // } else {
    //   return "Completed";

    // }

    // if (sessionDate > today) {
    //   console.log("split ", moment().format().split("T")[1].split("+")[0])

    //   return "Upcoming";

    // } else if (startTime > moment().format().split("T")[1].split("+")[0]) {
    //   return "Upcoming";

    // } else {
    //   return "Completed";

    // }

    if (diff > 0) {
      return "Upcoming";
    } else {
      return "Completed";
    }
  }

  createSessionTime(startTime: string, endTime: string) {
    return (this.createTimeFormat(startTime) + " - " + this.createTimeFormat(endTime))
  }

  createTimeFormat(date: any) {
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let currentDateTime = currentDate + "T" + date + "+05:30";
    return moment(currentDateTime).format('h:mm a');
  }

  calculateSessionDuration(sessionStart, sessionEnd, sessionDate) {
    let dateTime = sessionDate.split('T');
    let startTime = dateTime[0] + "T" + sessionStart + "+05:30"
    let endTime = dateTime[0] + "T" + sessionEnd + "+05:30"
    return moment(endTime).diff(moment(startTime), "minutes");
  }

  navigateToSession(expertId: string, sessionId: string, multi: any, status: string) {
    console.log(expertId, sessionId);
    localStorage.setItem('id_expert', expertId);
    localStorage.setItem('id_session', sessionId);
    localStorage.setItem('multi', multi);
    localStorage.setItem('status', status);
    this.route.navigate(['admin/session-info']);
  }
}
