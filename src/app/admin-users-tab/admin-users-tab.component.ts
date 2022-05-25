import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { AdminUserResponse, User } from '../models/admin.model';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import {isPlatformBrowser} from "@angular/common";


declare var $: any;

@Component({
  selector: 'app-admin-users-tab',
  templateUrl: './admin-users-tab.component.html',
  styleUrls: ['./admin-users-tab.component.css']
})
export class AdminUsersTabComponent implements OnInit {

  cols: any;
  resultSet: any;
  users: User[];
  totalUser: number;
  lastCreatedDate: any;
  selectedUser: any;
  Imgurl: any;
  selectedUSerId: string;
  totalRecords: number;
  fileUrl: any;
  status
  stat
btn
  constructor(
    private route: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'sno', header: 'S. NO.' },
      { field: 'userName', header: 'USER NAME' },
      { field: 'email', header: 'EMAIL' },
      { field: 'phone', header: 'PHONE' },
      { field: 'gender', header: 'GENDER' },
      { field: 'sessions', header: 'SESSIONS' },
      { field: 'lastEdited', header: "LAST UPDATED" },
      { field: 'since', header: 'SINCE' },
      { field: 'status', header: 'STATUS' }

    ];
    this.resultSet = [];
    this.getAdminUserList();
    localStorage.removeItem('id_expert');
    localStorage.removeItem('id_session');
  }

  editUser(id: any) {
    localStorage.setItem('id_user', id)
    this.route.navigate(['/user/profile']);
  }

  downloadUser() {
    this.apiService.adminDownloadAllUser()
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
      a.download = 'user.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
   
  }


  OpenDeleteUserModal(id: any, status:any) {
    console.log("id " ,id , "stat " , statusbar)
    if (status == "Active") {
      this.stat = "Delete The User"
      this.btn="Delete"
    }
    if (status == "Archieved") {
      this.stat = "Unarchive The User"
      this.btn="Unarchive"

    }
    this.selectedUSerId = id;
    this.apiService.getUserProfile(id)
      .subscribe(data => {
        console.log(data)
        if (data.code == 1000) {
          this.selectedUser = data.user[0];
          this.fetchProfilePitcher(this.selectedUser.id_user);
        }
      })
      if(isPlatformBrowser(this.platformId)){
        $("#deleteUserModal").modal("show");
      }
  }

  fetchProfilePitcher(id: any) {
    this.apiService.getUserProfilePitcher(id)
      .subscribe(data => {
        if (data.code == 1000) {
          this.Imgurl = data.file;
        } else {
          this.Imgurl = "../../assets/images/image.png";
        }
      })
  }


  deleteUser() {

    if (this.selectedUser.status == 1) {
      this.status = 0
    } else {
      this.status = 1

    }
    console.log("status " , status)

    this.apiService.AdminDeleteUser(this.selectedUSerId, this.status)
      .subscribe(data => {
        if(isPlatformBrowser(this.platformId)){
          $("#deleteUserModal").modal("hide");
          this.resultSet = [];
          this.getAdminUserList();
        }
      })
  }


  viewProfile(id: any) {
    localStorage.setItem('id_user', id)
    this.route.navigate(['/user/dashboard']);
  }

  getUserStatus(status) {
    if (status == 0) {
      return "Archieved";
    }
    if (status == 1) {
      return "Active"
    }
  }
  getAdminUserList() {
    this.apiService.fetchAdminUserList()
      .subscribe((data: AdminUserResponse) => {
        this.totalUser = data.users.length;
        console.log('user ', data)
        this.lastCreatedDate = this.formatDate(data.users[0].add_date);
        if (data.users && data.users.length > 0) {
          this.totalRecords = data.users.length;
          data.users.forEach((user, i) => {
            this.resultSet.push({
              sno: i + 1,
              userId: user.id_user,
              userName: user.full_name,
              email: user.user_email,
              phone: user.user_mobile,
              lastEdited: this.formatDate(user.edit_date) + " by " + user.edit_by,
              gender: this.getExpertGender(user.gender),
              sessions: user.sessions,
              since: this.formatDate(user.add_date),
              status: this.getUserStatus(user.status)

            })
          })

        }
      })
  }

  formatDate(date) {
    return moment(date).format('Do MMM YYYY');
  }

  getExpertGender(gender) {
    if (gender === 1) {
      return "M"
    } else if (gender === 2) {
      return "F"
    }
    return ""
  }
  refresh(){
    if(isPlatformBrowser(this.platformId)){
      window.location.reload();
    }
  }
}
