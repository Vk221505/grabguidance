import { Inject, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input, Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-search-expert',
  templateUrl: './search-expert.component.html',
  styleUrls: ['./search-expert.component.css']
})
export class SearchExpertComponent implements OnInit {
  @ViewChild('autoCompleteObject') private autoCompleteObject: any;
  loginForm: FormGroup;
  classes: any;
  name: string;
  results = [];
  submitted: boolean;
  guidanceSelected: any;
  class: any;
  result: any;
  clss: any;
  returnUrl: string;
  @Input() searchCriteria: any;
  @Input() loginpage: Boolean;
  @Output() searchChanged: EventEmitter<any> = new EventEmitter();
  subbar: any;
  constructor(
    private apiService: ApiService,
    private dataService: DataService,
    private fb: FormBuilder,
    private route: Router,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      classDropDown: ['', [Validators.required]],
      searchValue: ['', [Validators.required]]
    });
    this.fetchClasses();
    if (this.searchCriteria && this.searchCriteria.class) {
      this.loginForm.controls.classDropDown.patchValue(this.searchCriteria.class);
    }

    if (this.searchCriteria && this.searchCriteria.roleObj) {
      this.loginForm.controls.searchValue.patchValue(this.searchCriteria.roleObj);
    }

  }

  fetchClasses() {
    this.apiService.fetchClasses().subscribe((res) => {
      this.classes = res.class;
    });
  }

  search() {
    if (isPlatformBrowser(this.platformId)) {
      let classData: string;
      let subData: string;
      sessionStorage.removeItem('class');
      sessionStorage.removeItem('roleObj');
      sessionStorage.removeItem('searchedClass');
      sessionStorage.removeItem('searchedSubject');
      localStorage.removeItem('class');
      localStorage.removeItem('roleObj');
      this.setExpertSearchCriteria(this.loginForm.value, false);
      this.searchChanged.emit('btnClicked');
      if (sessionStorage.getItem('class')) {
        let selectedClass = sessionStorage.getItem('class');
        classData = selectedClass.slice(3, 15).trim()
      }
      if (localStorage.getItem('roleObj')) {
        let roleobj = JSON.parse(localStorage.getItem('roleObj'));
        subData = roleobj.name.split(" ").join('-');
      }
      if (classData == null && subData == null) {
        this.route.navigate(['/expert-list']);
      } else {
        if (!subData && classData) {
          let roled: any = "all-subject";
          this.route.navigate(['/expert-list/', "class-" + classData, roled]);
        } else if (subData && !classData) {
          let allClass = "all-classes";
          this.route.navigate(['/expert-list/', allClass, subData]);
        } else {
          this.route.navigate(['/expert-list/', "class-" + classData, subData]);
        }
      }
    }
  }

  autocompleteValue(event: any) {
    this.clss = this.loginForm.value;
    this.apiService.search(this.clss.classDropDown, this.clss.searchValue).subscribe((res) => {
      this.result = res.result;
      this.results = this.result.filter((c) =>
        c.name.toLowerCase().startsWith(this.clss.searchValue.toLowerCase())
      );
    });
  }

  navigate(option: any) {
    if (option.role == 'Expert') {
      this.setExpertSearchCriteria(option, false);
      this.searchChanged.emit('optionchanges');
      let burl = option.name;
      let fg = burl.split(' ');
      let join = fg.join('-');
      this.route.navigate(['/expert/' + option.id + '/' + join]);
    }
  }
  setExpertSearchCriteria(formValue: any, isExpert: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (isExpert) {
        this.dataService.setSearchCiteria({
          class: null,
          roleObj: formValue
        });
        sessionStorage.setItem('roleObj', JSON.stringify(formValue));
        localStorage.setItem('roleObj', JSON.stringify(formValue));
        console.log('class ');
      } else {
        this.dataService.setSearchCiteria({
          class: formValue.classDropDown,
          roleObj: formValue.searchValue
        });
        if (formValue.classDropDown) {
          sessionStorage.setItem('class', this.loginForm.value.classDropDown.trim());
          localStorage.setItem('class', this.loginForm.value.classDropDown.trim());
        }
        if (formValue.searchValue) {
          sessionStorage.setItem('roleObj', JSON.stringify(this.loginForm.value.searchValue));
          localStorage.setItem('roleObj', JSON.stringify(this.loginForm.value.searchValue));
        }
      }
    }
  }
  onChange(event: any) {
    this.autoCompleteObject.focusInput();
    if (this.autoCompleteObject._elementRef) {
      this.renderer.setStyle(this.autoCompleteObject._elementRef.nativeElement, 'backgroundColor', 'blue');
    }
  }
}

