import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import {isPlatformBrowser} from "@angular/common";


@Component({
  selector: 'app-landing-classes-data',
  templateUrl: './landing-classes-data.component.html',
  styleUrls: ['./landing-classes-data.component.css']
})
export class LandingClassesDataComponent implements OnInit {

  guidanceData: any[];
  personalData: any[];



  constructor(private apiService: ApiService,
    private route: Router,
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object) { }


  ngOnInit(): void {
    this.fetchSubjectGuidance();
    this.fetchPersonalGuidance();

  }

  fetchSubjectGuidance() {
    this.apiService.fetchSubjectGuidance()
      .subscribe(res => {
        if (res.code === 1000) {
          this.guidanceData = res.subjects;
        }
      })
  }

  fetchPersonalGuidance() {
    this.apiService.fetchPersonalGuidance()
      .subscribe(res => {
        if (res.code === 1000) {
          this.personalData = res.personal;
        }
      })
  }

  searchExpert(subject: any) {

    let roleObj = {
      id: subject.id_subject,
      name: subject.subject_name,
      role: "Academic"
    }

    let selectedSubject = {
      class: null,
      roleObj: roleObj
    }

    this.dataService.setSearchCiteria(selectedSubject);
    if(isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('class', null)
      sessionStorage.setItem('roleObj', JSON.stringify(roleObj));
      this.route.navigate(['/expert-list']);
    }
  }


  searchGuidance(subject: any) {


    let roleObj = {
      id: subject.id_guidance,
      name: subject.guidance_name,
      role: "Career"
    }

    let selectedSubject = {
      class: null,
      roleObj: roleObj
    }

    this.dataService.setSearchCiteria(selectedSubject);
    if(isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('class', null)
      sessionStorage.setItem('roleObj', JSON.stringify(roleObj));
    }
    this.route.navigate(['/expert-list']);
  }

}
