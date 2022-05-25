import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { AdminExpertResponse, Expert } from '../models/admin.model';
import * as moment from 'moment';
import {isPlatformBrowser} from "@angular/common";

declare var $: any;
@Component({
  selector: 'app-admin-experts-tab',
  templateUrl: './admin-experts-tab.component.html',
  styleUrls: ['./admin-experts-tab.component.css']
})
export class AdminExpertsTabComponent implements OnInit {

  cols: any;
  resultSet: any;
  totalExpert: number;
  latestCreatedDate: any;
  selectedExpertName: string;
  selecxtedExpertSpec: string;
  selectedExpertDegree: string;
  selcectedExpertTotalExperience: any;
  selectedExpertId: any;
  selectedheading: string;
  selectedType: string;
  imgUrl: any;
  totalRecords: number;

  constructor(
    private route: Router,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'sno', header: 'S. NO.', width: '4%' },
      { field: 'userName', header: 'EXPERT NAME', width: '11%' },
      { field: 'email', header: 'EMAIL', width: '15%' },
      { field: 'phone', header: 'PHONE', width: '8%' },
      { field: 'gender', header: 'GENDER', width: '7%' },
      { field: 'basePrice', header: 'BASE PRICE', width: '9%' },
      { field: 'sessions', header: 'SESSIONS', width: '9%' },
      { field: 'since', header: 'SINCE', width: '9%' },
      { field: 'lastEdited', header: "LAST UPDATED", width: '12%' },
      { field: 'status', header: 'STATUS', width: '9%' }
    ];
    this.resultSet = [];
    this.getAdminExpertList();
    localStorage.removeItem('id_user');
    localStorage.removeItem('id_session');
  }

  editUser(id: any) {
    localStorage.setItem('id_expert', id);
    this.route.navigate(['/expert/dashboard']);
  }

  openDeleteExpert(id: any,status:any) {
    console.log(status)
    this.fetchProfilePitcher(id)
    if(status == 'Unarchived'){
      this.fetchProfileDetails(id, "Delete this expert", 'delete');
    }else if (status == 'Archieved'){
      this.fetchProfileDetails(id, "Unarchieve this expert", 'delete');
    }else{
      this.fetchProfileDetails(id, "Delete this expert", 'delete');

    }
  }

  openApproveExpert(id: any) {
    this.fetchProfilePitcher(id);
    this.fetchProfileDetails(id, "Approve this expert", 'approve');
  }

  downloadExperts() {
    this.apiService.adminDownloadAllExpert()
     .subscribe( response => this.downLoadFile(response,  "text/csv; charset=utf-8'"))
  }

  downLoadFile(data: any, type: string) {
    const blob = new Blob([data], { type: type });
    if(isPlatformBrowser(this.platformId)){
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'expert.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  fetchProfileDetails(id: any, selectedheading: string, selectedType: string) {
    this.apiService.fetchUserExpertDetails(id, null).subscribe(res => {
      this.selectedExpertName = res.experts.name;
      this.selectedExpertDegree = res.experts.education[0]?.degree;
      this.selecxtedExpertSpec = res.experts.education[0]?.specialization;
      this.selcectedExpertTotalExperience = res.experts.total_experience;
      this.selectedExpertId = res.experts.id;
      this.selectedheading = selectedheading;
      this.selectedType = selectedType;
      if(isPlatformBrowser(this.platformId)){
        $("#resheduleSessionFinal").modal("show");
      }
      
    })
  }

  fetchProfilePitcher(id: any) {
    this.apiService.fetchProfilePitcher(id)
      .subscribe((data: any) => {
        if (data.code == 1000) {
          this.imgUrl = data.file;
        } else {
          this.imgUrl = "../../assets/images/image.png";
        }
      })
  }

  submit() {
    if (this.selectedType == 'delete') {
      this.apiService.AdminDeleteExpert(this.selectedExpertId)
        .subscribe(data => {
          if(isPlatformBrowser(this.platformId)){
            $("#resheduleSessionFinal").modal("hide");
          }
          this.resultSet = [];
          this.getAdminExpertList();
        })
    } else {
      this.apiService.AdminApproveExpert(this.selectedExpertId)
        .subscribe(data => {
          if(isPlatformBrowser(this.platformId)){
            $("#resheduleSessionFinal").modal("hide");
          }
          this.resultSet = [];
          this.getAdminExpertList();
        })
    }
  }

  viewProfile(expertId: any, name: any) {
    this.route.navigate(['/expert/' + expertId + '/' + name]);
  }

  getAdminExpertList() {
    this.apiService.fetchAdminExpertList()
      .subscribe((data: AdminExpertResponse) => {
        console.log(data)
        this.totalExpert = data.experts.length;
        this.latestCreatedDate = this.formatDate(data.experts[0].add_date);
        if (data.experts && data.experts.length > 0) {
          this.totalRecords=data.experts.length;
          data.experts.forEach((expert, i) => {
            this.resultSet.push({
              sno: i + 1,
              expertId: expert.id_expert,
              userName: expert.full_name,
              email: expert.expert_email,
              phone: expert.epert_mobile,
              gender: this.getExpertGender(expert.id_gender),
              basePrice: expert.base_price,
              sessions: expert.sessions,
              since: moment(expert.add_date).format('Do MMM YYYY'),
              lastEdited: moment(expert.edit_date).format('Do MMM YYYY') + " by " + expert.edit_by,
              status: this.getExpertStatus(expert.approved, expert.details, expert.status)
            })
          })
        }
      })
  }

  formatDate(date) {
    return moment(date).format('Do MMM YYYY');
  }

  getExpertGender(gender) {
    if (gender === 0) {
      return ""
    } else if (gender === 1) {
      return "M"
    }
    return "F"
  }

  getExpertStatus(approved, detail, status) {
    if (status == 0) {
      return "Archieved";
    }
    if (detail < 5) {
      return "Pending"
    } else {
      if (approved === 0) {
        return "Not Approved"
      }
    }
    return "Approved";
  }
  refresh(){
    if(isPlatformBrowser(this.platformId)){
      window.location.reload();
    }
  }

}
