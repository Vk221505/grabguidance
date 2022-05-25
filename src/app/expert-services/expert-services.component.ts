import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { ClassService } from '../models/expert.service.model';

declare let ga: Function;

@Component({
  selector: 'app-expert-services',
  templateUrl: './expert-services.component.html',
  styleUrls: ['./expert-services.component.css']
})
export class ExpertServicesComponent implements OnInit {

  dummyClassData: {};
  servicesForm: FormGroup;
  submitted: boolean;
  classes: any;
  boards: any;
  erroMessage: boolean;
  subjectGuidance: any;
  personalGuidance: any;
  personalGuidanceList: any[] = [];
  subjectGuidanceList: any[] = [];
  boardsList: any[];
  classesList: ClassService[];
  expertId: any;
  personalGuidanceJson: any;
  subjectGuidanceJson: any;
  boardsJson: any;
  classesJson: any;
  showServicesActive: boolean;
  routeIn: string;
  spinnerFlag: boolean;
  isSignUp: string;
  isAdmin: string;
  savedValue: any;
  canFecth: boolean = false;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.submitted = false;
    this.spinnerFlag = false;
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

  ngOnInit(): void {
    this.expertId = localStorage.getItem('id_expert');
    this.classesList = [];
    this.boardsList = [];
    this.subjectGuidanceList = [];
    this.personalGuidanceList = [];

    this.servicesForm = this.fb.group({
      'class': [''],
      'boards': [''],
      'subjectGuidance': [''],
      'personalGuidance': ['']
    });
    this.routeIn = "services";
    this.savedValue = localStorage.getItem('value');
    this.isSignUp = localStorage.getItem('isSignUp');

    this.fetchClasses();
    this.fetchBoards();
    this.fetchSubjectGudaince();
    this.fetchPersonalGudaince();

    if (this.isSignUp) {
      if (this.savedValue != '2') {
        this.canFecth = true;
      }
    } else {
      this.canFecth = true;
    }
  }

  onSubmit(buttonType) {
    this.erroMessage = true;
    this.submitted = true;
    this.servicesForm.value.class = this.classesList;
    this.servicesForm.value.boards = this.boardsList;
    this.servicesForm.value.subjectGuidance = this.subjectGuidanceList;
    this.servicesForm.value.personalGuidance = this.personalGuidanceList;
    if (this.classesList.length > 0 &&
      this.boardsList.length > 0 && this.subjectGuidanceList.length > 0 &&
      this.personalGuidanceList.length > 0) {
      this.spinnerFlag = true;
      this.apiService.saveExpertServices(this.servicesForm.value, this.expertId, this.isAdmin).subscribe(res => {
        this.spinnerFlag = false;
        if (this.isSignUp) {
          this.apiService.updateExpert(this.expertId, '3').subscribe(data => {
            if (data.code == '1000') {
              if (buttonType === 'next') {
                this.route.navigate(['/expert/availability']);
              } else {
                this.route.navigate(['/expert/dashboard/']);
              }
            }
          })
        } else {
          if (buttonType === 'next') {
            this.route.navigate(['/expert/availability']);
          } else {
            this.route.navigate(['/expert/dashboard/']);
          }
        }
        
      })
    } else {
      this.erroMessage = true;
    }
  }

  back() {
    this.route.navigate(['/expert/education']);
  }

  fetchClasses() {
    this.apiService.fetchClasses().subscribe(res => {
      this.classes = res.class;
      if (this.canFecth) {
        this.fetchClassesById();
      }
    });
  }

  fetchBoards() {
    this.apiService.fetchBoards().subscribe(res => {
      this.boards = res['boards'];
      if (this.canFecth) {
        this.fetchBoardsById();
      }
    });
  }

  fetchSubjectGudaince() {
    this.apiService.fetchSubjectGuidance().subscribe(res => {
      this.subjectGuidance = res['subjects'];
      if (this.canFecth) {
        this.fetchSubjectById();
      }
    });
  }

  fetchPersonalGudaince() {
    this.apiService.fetchPersonalGuidance().subscribe(res => {
      this.personalGuidance = res['personal'];
      if (this.canFecth) {
        this.fetchPersonalById();
      }
    });
  }

  onChangePersonal(personalGuidance, event) {
    if (event.target.checked == true) {
      personalGuidance.checked = event.target.checked;
      this.personalGuidanceList.push(personalGuidance);
    } else {
      let index = this.personalGuidanceList.findIndex(x => x.id_guidance === event.target.id);
      this.personalGuidanceList.splice(index, 1);
    }
  }

  onChangeSubject(subject, event) {
    if (event.target.checked == true) {
      subject.checked = event.target.checked;
      this.subjectGuidanceList.push(subject);
    } else {
      let index = this.subjectGuidanceList.findIndex(x => x.id_subject === event.target.id);
      this.subjectGuidanceList.splice(index, 1);
    }
  }

  onChangeBoard(board, event) {
    if (event.target.checked == true) {
      board.checked = event.target.checked;
      this.boardsList.push(board);
    } else {
      let index = this.boardsList.findIndex(x => x.id_board === event.target.id);
      this.boardsList.splice(index, 1);
    }
  }

  onChangeClass(classes, event) {
    if (event.target.checked == true) {
      classes.checked = event.target.checked;
      this.classesList.push(classes);
    } else {
      let index = this.classesList.findIndex(x => x.id_class === event.target.id);
      this.classesList.splice(index, 1);
    }
  }

  fetchClassesById() {
    this.apiService.fetchClassesById(this.expertId).subscribe(res => {
      // this.classDataById = res['expertClass'];
      this.classesList = res['expertClass'];
      this.classPatchValues();
    });
  }

  fetchBoardsById() {
    this.apiService.fetchBoardsById(this.expertId).subscribe(res => {
      //this.boardsRespId = res['expertBoard'];
      this.boardsList = res['expertBoard'];
      this.boardsPatchValues();
    })
  }

  fetchSubjectById() {
    this.apiService.fetchSubjectById(this.expertId).subscribe(res => {
      //this.subjectRespId = res['expertsSubject'];
      this.subjectGuidanceList = res['expertsSubject'];
      this.subjectPatchValues();
    });
  }

  fetchPersonalById() {
    this.apiService.fetchPersonalById(this.expertId).subscribe(res => {
      //this.personalRespById = res['expertsPersonal'];
      this.personalGuidanceList = res['expertsPersonal'];
      this.personalGuidancePatchValues();
    })
  }

  classPatchValues() {
    if (this.classesList != null && this.classesList.length > 0) {
      for (let i = 0; i < this.classesList.length; i++) {
        for (let j = 0; j < this.classes?.length; j++) {
          if (this.classesList[i].id_class == this.classes[j].id_class) {
            this.classes[j]["checked"] = true;
            this.classes[j]['id_class'] = this.classesList[i].id_class;
          }
        }
      }
    }
  }

  personalGuidancePatchValues() {
    if (this.personalGuidanceList != null && this.personalGuidanceList.length > 0) {
      for (let i = 0; i < this.personalGuidanceList?.length; i++) {
        for (let j = 0; j < this.personalGuidance?.length; j++) {
          if (this.personalGuidanceList[i].id_guidance == this.personalGuidance[j].id_guidance) {
            this.personalGuidance[j]["checked"] = true;
            this.personalGuidance[j]['id_guidance'] = this.personalGuidanceList[i].id_guidance;
          }
        }
      }
    }
  }

  boardsPatchValues() {
    if (this.boardsList != null && this.boardsList.length > 0) {
      for (let i = 0; i < this.boardsList?.length; i++) {
        for (let j = 0; j < this.boards?.length; j++) {
          if (this.boardsList[i].id_board == this.boards[j].id_board) {
            this.boards[j]["checked"] = true;
            this.boards[j]['id_board'] = this.boardsList[i].id_board;
          }
        }
      }
    }
  }

  subjectPatchValues() {
    if (this.subjectGuidanceList != null && this.subjectGuidanceList.length > 0) {
      for (let i = 0; i < this.subjectGuidanceList?.length; i++) {
        for (let j = 0; j < this.subjectGuidance?.length; j++) {
          if (this.subjectGuidanceList[i].id_subject == this.subjectGuidance[j].id_subject) {
            this.subjectGuidance[j]["checked"] = true;
            this.subjectGuidance[j]['id_subject'] = this.subjectGuidanceList[i].id_subject;
          }
        }
      }
    }
  }



}
