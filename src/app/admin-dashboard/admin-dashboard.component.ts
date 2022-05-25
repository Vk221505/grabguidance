import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { UtilityService } from 'src/services/utility.service';
import { CurrentSessionResponse, Transaction } from '../models/admin.model';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  dummyJSONData: any;
  currentMonthlyTrans: Transaction;
  previousMonthkyTrans: Transaction;
  totalTransaction: Transaction;
  currentSessions: any[];
  emptySessions: any[];
  classes: any[] = [];
  boards: any[] = [];
  subjectGuidance: any[] = [];
  personalGuidance: any[] = [];
  editClasses: boolean = false;
  editBoards: boolean = false;
  editSubjectGuidance: boolean = false;
  editPersonalGuidance: boolean = false;
  classPayload: any[] = [];
  boardPayload: any[] = [];
  subjectPayload: any[] = [];
  personalpayload: any[] = [];

  @ViewChild('classInput', { static: false }) classInput: ElementRef

  constructor(private apiService: ApiService,
    private route: Router,
    private UtilityService: UtilityService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private tostr: ToastrService) { }

  ngOnInit(): void {
    this.getCurrentSession();
    this.getThisMonthTransaction();
    this.getPreviousMonthTransaction();
    this.getTotalTransaction();
    this.fetchClasses();
    this.fetchBoards();
    this.fetchSubjectGudaince();
    this.fetchPersonalGudaince();
  }

  fetchClasses() {
    this.apiService.fetchClasses().subscribe(res => {
      if (res.code == 1000) {
        this.classes = res.class;
      }
    })
  }

  fetchBoards() {
    this.apiService.fetchBoards().subscribe(res => {
      if (res.code == 1000) {
        this.boards = res.boards;
      }
    });
  }

  fetchSubjectGudaince() {
    this.apiService.fetchSubjectGuidance().subscribe(res => {
      if (res.code == 1000) {
        this.subjectGuidance = res.subjects;
      }
    });
  }

  fetchPersonalGudaince() {
    this.apiService.fetchPersonalGuidance().subscribe(res => {
      if (res.code == 1000) {
        this.personalGuidance = res.personal;
      }
    });
  }

  downloadCurrentMonthUser() {
     this.apiService.adminDownloadCurrentUser()
      .subscribe( response  =>  this.downLoadFile(response, "text/csv; charset=utf-8", "current_month_user.csv"))
  }

  downloadCurrentMonthExpert() {
    this.apiService.adminDownloadCurrentExpert()
     .subscribe( response  =>  this.downLoadFile(response, "text/csv; charset=utf-8", "current_month_expert.csv"))
 }

 downloadCurrentMonthSession() {
  this.apiService.adminDownloadCurrSession()
   .subscribe( response  =>  this.downLoadFile(response, "text/csv; charset=utf-8", "current_month_session.csv"))
}

 downloadPreviousMonthUser() {
  this.apiService.adminDownloadPreviousUser()
   .subscribe( response  =>  this.downLoadFile(response, "text/csv; charset=utf-8", "previous_month_user.csv"))
}

downloadPreviousMonthExpert() {
 this.apiService.adminDownloadPreviousExpert()
  .subscribe( response  =>  this.downLoadFile(response, "text/csv; charset=utf-8", "previous_month_expert.csv"))
}

downloadPreviousMonthSession() {
  this.apiService.adminDownloadPrevSession()
   .subscribe( response  =>  this.downLoadFile(response, "text/csv; charset=utf-8", "previous_month_session.csv"))
 }

downLoadFile(data: any, type: string, filename: string) {
  const blob = new Blob([data], { type: type });
  if(isPlatformBrowser(this.platformId)){
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

  getCurrentSession() {
    this.apiService.fetchCurrentSession()
      .subscribe((data: CurrentSessionResponse) => {
        if (data.recentRecords && data.recentRecords.length > 3) {
          this.currentSessions = data.recentRecords.slice(0, 4);
        } else {
          if (data.recentRecords) {
            this.currentSessions = data.recentRecords;
            let remaining = (3 - data.recentRecords.length)
            this.emptySessions = new Array(remaining);
          }
        }

      })
  }

  upcomingSession(data: any) {
    localStorage.setItem('id_expert', data.id_expert);
    localStorage.setItem('id_session', data.id_session);
    localStorage.setItem('multi', data.multi);
    localStorage.setItem('status', "Upcoming");
    this.route.navigate(['admin/session-info']);
  }

  createTimeFormat(date) {
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let currentDateTime = currentDate + "T" + date + "+05:30";
    return moment(currentDateTime).format('h:mm a');
  }

  formatSessionDate(date: string) {
    return this.UtilityService.formatSessionDate(date);
  }


  calculateSessionDuration(sessionStart: string, sessionEnd: string, sessionDate: string) {
    return this.UtilityService.calculateSessionDuration(sessionStart, sessionEnd, sessionDate);
  }


  getThisMonthTransaction() {
    this.apiService.fetchThisMonthTransaction()
      .subscribe((data: Transaction) => {
        data.totalAmount = this.toFixedMethod(data.totalAmount);
        this.currentMonthlyTrans = data;
      })
  }

  getPreviousMonthTransaction() {
    this.apiService.fetchPreviousMonthTransaction()
      .subscribe((data: Transaction) => {
        data.totalAmount = this.toFixedMethod(data.totalAmount);
        this.previousMonthkyTrans = data;
      })
  }

  getTotalTransaction() {
    this.apiService.fetchTotalRevenue()
      .subscribe((data: Transaction) => {
        data.totalAmount = this.toFixedMethod(data.totalAmount);
        this.totalTransaction = data;
      })
  }

  toFixedMethod(totalAmount) {
    return totalAmount ? parseFloat(totalAmount).toFixed(2) : "0"
  }

  editBoxes(type: string) {
    if (type == 'class') {
      this.editClasses = true;
    }

    if (type == 'board') {
      this.editBoards = true;
    }

    if (type == 'subjectGuidance') {
      this.editSubjectGuidance = true;
    }

    if (type == 'personalGuidance') {
      this.editPersonalGuidance = true;
    }
  }

  saveBoxes(type: string) {
    if (type == 'class') {
      this.editClasses = false;
      if(this.classPayload && this.classPayload.length > 0) {
        this.apiService.adminInsertClass(JSON.stringify(this.classPayload))
        .subscribe( res => {
          this.tostr.success("Classes added successfully");
          console.log(res);
        })
      }
    }

    if (type == 'board') {
      this.editBoards = false;
      if(this.boardPayload && this.boardPayload.length > 0) {
        this.apiService.adminInsertBoard(JSON.stringify(this.boardPayload))
        .subscribe( res => {
          this.tostr.success("boards added successfully");
          console.log(res);
        })
      }
    }

    if (type == 'subjectGuidance') {
      this.editSubjectGuidance = false;
      if(this.subjectPayload && this.subjectPayload.length > 0) {
        this.apiService.adminInsertSubjectGuidance(JSON.stringify(this.subjectPayload))
        .subscribe( res => {
          this.tostr.success("subjectGuidance added successfully");
          console.log(res);
        })
      }
    }

    if (type == 'personalGuidance') {
      this.editPersonalGuidance = false;
      if(this.personalpayload && this.personalpayload.length > 0) {
        this.apiService.adminInsertPersonalGuidance(JSON.stringify(this.personalpayload))
        .subscribe( res => {
          this.tostr.success("personalGuidance added successfully");
          console.log(res);
        })
      }
    }
  }

  deleteBox(type: string, value: any) {
    if (type == 'class') {
      let index = this.classes.findIndex(c => {
         return c.class_name == value.class_name;
      });
      let index2 = this.classPayload.findIndex( c => {
         return c.class = value.class_name
      })
      if (index == -1) {
        this.tostr.error('Class value is not exists for deleting');
      } else {
        let classToDelete = this.classes[index];
        if(!classToDelete.id_class) {
          this.classes.splice(index, 1)
          this.classPayload.splice(index2, 1);
          this.tostr.success(value.class_name + " class is deleted successfully");
        } else {
          this.apiService.adminDeleteClass(value.id_class)
          .subscribe( res => {
           this.classes.splice(index, 1)
           this.classPayload.splice(index2, 1);
           this.tostr.success(value.class_name + " class is deleted successfully");
          }, (error) => {
            this.tostr.error("Error while deleting the class " + value.class_name);
          })
        }
      }
    }

    if (type == 'board') {
      let index = this.boards.findIndex(b => {
        return b.board_name == value.board_name;
     });
     let index2 = this.boardPayload.findIndex( c => {
      return c.boards = value.board_name
     });
      if (index == -1) {
        this.tostr.error('Board value not exists for deleting');
      } else {
        let boardToDelete = this.boards[index];
        if(!boardToDelete.id_board) {
          this.boards.splice(index, 1)
          this.boardPayload.splice(index2, 1);
          this.tostr.success(value.board_name + " board is deleted successfully");
        } else {
          this.apiService.adminDeleteBoard(value.id_board)
          .subscribe( res => {
           this.boards.splice(index, 1)
           this.boardPayload.splice(index2, 1);
           this.tostr.success(value.board_name + " board is deleted successfully");
          }, (error) => {
            this.tostr.error("Error while deleting the board " + value.board_name);
          })
        }
      }
    }

    if (type == 'subjectGuidance') {
      let index = this.subjectGuidance.findIndex(b => {
        return b.subject_name == value.subject_name;
     });
     let index2 = this.subjectPayload.findIndex( c => {
       return c.subject = value.subject_name;
     });
      if (index == -1) {
        this.tostr.error('Subject value not exists for deleting');
      } else {
        let subjectToDelete = this.subjectGuidance[index];
        if(!subjectToDelete.id_subject) {
          this.subjectGuidance.splice(index, 1);
          this.subjectPayload.splice(index2, 1);
          this.tostr.success(value.subject_name + " subject is deleted successfully");
        } else {
          this.apiService.adminDeleteSubject(value.id_subject)
          .subscribe( res => {
           this.subjectGuidance.splice(index, 1)
           this.subjectPayload.splice(index2, 1);
           this.tostr.success(value.subject_name + " subjectGuidance is deleted successfully");
          }, (error) => {
           this.tostr.error("Error while deleting the subject " + value.subject_name);
         })
        }
      }
    }

    if (type == 'personalGuidance') {
      let index = this.personalGuidance.findIndex(b => {
        return b.guidance_name == value.guidance_name;
       });
       let index2 = this.personalpayload.findIndex( c => {
        return c.personal = value.guidance_name;
      });
      if (index == -1) {
        this.tostr.error('personal value  not exists for deleting');
      } else {
        let personalToDelete = this.personalGuidance[index];
        if(!personalToDelete.id_guidance) {
          this.personalGuidance.splice(index, 1);
          this.personalpayload.splice(index2, 1);
          this.tostr.success(value.guidance_name + " personalGuidance is deleted successfully");
        } else {
          this.apiService.adminDeletePersonal(value.id_guidance)
          .subscribe( res => {
            this.personalGuidance.splice(index, 1);
            this.personalpayload.splice(index2, 1);
            this.tostr.success(value.guidance_name + " personalGuidance is deleted successfully");
          },  (error) => {
           this.tostr.error("Error while deleting the personal " + value.guidance_name);
         })
        }

      }
    }
  }

  onKey(event: any, type: string) {
    if (type == 'class') {
      let value = event.target.value;
      if(!value) {
        this.tostr.error("please enter the valid value");
        return
      }
      let index = this.classes.findIndex(c => {
        return c.class_name == value
       });
      if (index == -1) {
        this.classPayload.push({class: value});
        this.classes.push({id_class: null, class_name: value})
      } else {
        this.tostr.error(value + " class already exist");
      }
    }

   if (type == 'board') {
    let value = event.target.value;
    if(!value) {
      this.tostr.error("please enter the valid value");
      return
    }
    let index = this.boards.findIndex(b => {
      return b.board_name == value;
   });
    if (index == -1) {
      this.boardPayload.push({boards: value});
      this.boards.push({id_board: null, board_name: value})
    } else {
      this.tostr.error(value + " board already exist");
    }
  }

    if (type == 'subjectGuidance') {
      let value = event.target.value;
      if(!value) {
        this.tostr.error("please enter the valid value");
        return
      }
      let index = this.subjectGuidance.findIndex(b => {
        return b.subject_name == value;
     });
     if (index == -1) {
      this.subjectPayload.push({subject: value});
      this.subjectGuidance.push({id_subject: null, subject_name: value})
    } else {
      this.tostr.error(value + " subject already exist");
    }
  }

    if (type == 'personalGuidance') {
      let value = event.target.value;
      if(!value) {
        this.tostr.error("please enter the valid value");
        return
      }
      let index = this.personalGuidance.findIndex(b => {
        return b.guidance_name == value;
     });
     if (index == -1) {
      this.personalpayload.push({personal: value});
      this.personalGuidance.push({id_guidance: null, guidance_name: value})
    } else {
      this.tostr.error(value + " guidance already exist");
    }
    }
   }
}


