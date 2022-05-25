import { HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { EventEmitter } from '@angular/core';
import { Renderer2, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from "@angular/common";

declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, OnDestroy {
  guidanceData: any[];
  personalData: any[];
  navbarfixed: boolean = false;
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
  @ViewChild('autoCompleteObject') private autoCompleteObject: any;
  @Output() searchChanged: EventEmitter<any> = new EventEmitter();
  subbar: any;

  responsive: boolean = false;
  subjectshow: boolean = true;
  dropdownData: string[];
  filteredResults: any[];
  isUserLoggedIn: string;
  isExpertLoggedIn: string;
  loggedInUserName: string;
  id_expert: any
  isAdmin: any;
  id_user: any;
  Imgurl: string;
  userType: string;
  userStatus: Subscription;
  searchCriteriaSub: Subscription;
  currentUrl: string = "";
  criteria: any;
  open: boolean = false;
  username: string;
  searchcriteria: boolean;
  scrHeight: any;
  scrWidth: any;
  searchclass: string;
  searchsubject: string;
  login: boolean = false;
  subjectData: any = [];

  constructor(
    private route: Router,
    private apiService: ApiService,
    private dataService: DataService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isAdmin = localStorage.getItem('isadmin');
    this.isUserLoggedIn = "false";
    this.isExpertLoggedIn = "false";
    this.userType = localStorage.getItem('user_role');
    this.username = localStorage.getItem('user_name');
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url.split("/")[1];
        if (!this.currentUrl) {
          this.login = true;
        } else {
          this.login = false;
        }
      }
    });

  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    if (isPlatformBrowser(this.platformId)) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;
      if (this.scrWidth <= 991) {
        this.searchcriteria = false;
      } else {
        this.searchcriteria = true;
      }
    }
  }
  top_var=false;
  @HostListener('window:scroll', ['$event'])
  onscroll() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.scrollY > 10 && this.currentUrl !== window.location.href) {
        this.navbarfixed = true;
        this.top_var = true;
      }
      else {
        this.navbarfixed = false;
        this.top_var = false;
      }
    }
  }





  toogleSearchCriteria() {
    this.searchcriteria = true;
  }


  openSideNav() {
    this.open = !this.open
  }


  searchChangedHandler(value) {
    this.searchcriteria = false;
  }

  ngOnDestroy() {
    if (this.userStatus) {
      this.userStatus?.unsubscribe();
    }
    if (this.searchCriteriaSub) {
      this.searchCriteriaSub?.unsubscribe();
    }
  }

  back() {
    close();
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

  ngOnInit() {
    let roleObj: any = null;
    let classObj: any = null;
    let activatedRouteCriteria: any;
    this.activatedRoute.params.subscribe(data => {
      if (data.searchedClass && data.searchedClass != 'all-classes') {
        let classData = this.dataService.classes.filter((c) => {
          return c.class == data.searchedClass.split("-")[1];
        });
        classObj = classData[0].id_class + "-" + classData[0].class_name;
      }

      if (data.searchedSubject) {
        let sub: any = data.searchedSubject.split("-").join(" ");
        let academicSub = this.dataService.acadmicSubject.filter((acdemic) => {
          return acdemic.subject_name == sub;
        })
        if (academicSub.length > 0) {
          roleObj = {
            id: academicSub[0].id_subject,
            name: academicSub[0].subject_name,
            role: "Academic"
          };
        } else {
          let carrerSub = this.dataService.careerSubject.filter((carrer) => {
            return carrer.guidance_name == sub;
          });
          if (carrerSub.length > 0) {
            roleObj = {
              id: carrerSub[0].id_guidance,
              name: carrerSub[0].guidance_name,
              role: "Career"
            };
          }
        }
      }
      activatedRouteCriteria = {
        class: classObj,
        roleObj: roleObj
      }
    })

    if (isPlatformBrowser(this.platformId)) {
      window.onscroll = function () { scrollFunction() };
    }

    function scrollFunction() {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        if (document.getElementById("mobile")) {
          document.getElementById("mobile").style.fontSize = "30px";
        }
      } else {
        if (document.getElementById("mobile")) {
          document.getElementById("mobile").style.fontSize = "90px";
        }
      }
    }

    this.subjectData = this.dataService.getSubjectData();
    this.userStatus = this.dataService.isUserLoggedInSub$
      .subscribe(data => {
        this.isUserLoggedIn = data;
        this.fetchDataFromLocalStorage();
      })

    this.searchCriteriaSub = this.dataService.searchCriteriaSub$.subscribe(searchCriteria => {
      if (searchCriteria.class == null && searchCriteria.roleObj == null && (activatedRouteCriteria.class != null || activatedRouteCriteria.roleObj != null)) {
        this.criteria = activatedRouteCriteria;
        this.dataService.setSearchCiteria(activatedRouteCriteria);
      } else {
        this.criteria = searchCriteria;
      };
    })
    if (this.userType == "user") {
      this.isExpertLoggedIn = "true"
    } else if (this.userType == "expert") {

    }
    if (isPlatformBrowser(this.platformId)) {
      this.scrWidth = window.innerWidth
    }
    if (this.scrWidth <= 576) {
      this.searchcriteria = false;
    } else {
      this.searchcriteria = true;
    }
    this.fetchClasses();
  }

  change=true;

  fetchClasses() {
    this.apiService.fetchClasses().subscribe(res => {
      this.classes = res.class;
    })
  }

  setExpertSearchCriteria(formValue: any, isExpert: any) {
    if (isExpert) {
      this.dataService.setSearchCiteria({
        class: null,
        roleObj: formValue
      });
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.setItem('roleObj', JSON.stringify(formValue));
      }

    } else {
      this.dataService.setSearchCiteria({
        class: formValue.classDropDown,
        roleObj: formValue.searchValue
      });
      if (formValue.classDropDown) {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('class', this.loginForm.value.classDropDown.trim())
        }
      }
      if (formValue.searchValue) {
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('roleObj', JSON.stringify(this.loginForm.value.searchValue));
        }
      }
    }
  }
  onChange(event) {
    this.autoCompleteObject.focusInput();
    this.renderer.setStyle(this.autoCompleteObject._elementRef.nativeElement, "backgroundColor", "blue");
  }

  fetchDataFromLocalStorage() {
    this.userType = localStorage.getItem('user_role');
    this.id_user = localStorage.getItem('id_user');
    this.id_expert = localStorage.getItem('id_expert');
    this.Imgurl = localStorage.getItem('admin_pic');
    if (this.userType && this.userType == "user") {
      this.fetchUserProfilePitcher();
    }
    if (this.userType && this.userType == "expert") {
      this.fetchExpertProfilePitcher();
    }
    if (!this.Imgurl) {
      this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
    }
  }

  fetchDataFromSessionStorage() {
    if (isPlatformBrowser(this.platformId)) {
      this.searchsubject = sessionStorage.getItem('searchedSubject');
      this.searchclass = sessionStorage.getItem('searchedClass')
    }
  }


  fetchExpertProfilePitcher() {
    this.apiService.fetchProfilePitcher(this.id_expert)
      .subscribe((data: any) => {
        if (data.code == 1000) {
          this.Imgurl = data.file;
        } else {
          this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
        }
      })
  }

  fetchUserProfilePitcher() {
    if (this.id_user) {
      this.apiService.getUserProfilePitcher(this.id_user)
        .subscribe(data => {
          if (data.code == 1000) {
            this.Imgurl = data.file;
          } else {
            this.Imgurl = "../../assets/images/Grabguidance PP@2x.png";
          }
        })
    }
  }

  dashBoard() {
    if (this.userType == 'admin') {
      this.route.navigate(['admin/dashboard']);
    } else if (this.userType == 'user') {
      this.route.navigate(['user/dashboard']);
    } else {
      this.route.navigate(['expert/dashboard'])
    }
  }
  autocompleteValue(event) {
    this.clss = this.loginForm.value;
    this.apiService.search(this.clss.classDropDown, this.clss.searchValue).subscribe(res => {
      this.result = res.result;
      this.results = this.result.filter(c => c.name.toLowerCase().startsWith(this.clss.searchValue.toLowerCase()));
    })
  }

  createImgUrl() {
    if (this.Imgurl) {
      return this.Imgurl
    } else {
      return "../../assets/images/Grabguidance PP@2x.png";
    }
  }

  loginScreen() {
    this.apiService.openExpertSignInModal("User Login");
  }

  becomeAnExpert() {
    this.apiService.openExpertSignInModal("Expert Login");
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      sessionStorage.clear();
    }
    this.Imgurl = null;
    this.dataService.setUserLoggingStatus(null);
    this.route.navigate(['/']);
  }

  editProfile() {
    if (this.userType == 'user') {
      this.route.navigate(['/user/profile']);
    } else {
      this.route.navigate(['/expert/profile']);
    }
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
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('class', null)
      sessionStorage.setItem('roleObj', JSON.stringify(roleObj));
    }
    this.route.navigate(['/expert-list']);
  }

  exploreNavigate(subjectVal: any, classobj: any, subjetType: string) {

    let roleObj: any = {};
    if (subjetType == "Career") {
      roleObj = {
        id: subjectVal.id_guidance,
        name: subjectVal.guidance_name,
        role: subjetType
      }
    } else {
      roleObj = {
        id: subjectVal.id_subject,
        name: subjectVal.subject_name,
        role: subjetType
      }
    }
    let selectedSubject = {
      class: classobj.id_class + "-" + classobj.class_name,
      roleObj: roleObj
    }
    this.dataService.setSearchCiteria(selectedSubject);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('class', selectedSubject.class)
      sessionStorage.setItem('roleObj', JSON.stringify(roleObj));
      localStorage.setItem('class', selectedSubject.class)
      localStorage.setItem('roleObj', JSON.stringify(roleObj));
    }
    let fg = roleObj.name.split(' ');
    let fgclass = classobj.class_name.split(' ').toString();
    let trim = fgclass.trim();
    let join = fg.join('-');
    if (this.currentUrl) {
      this.route.navigate(['/expert-list/', "class-" + trim, join])
        .then(() => {
          if (isPlatformBrowser(this.platformId)) {
            window.location.reload();
          }
        });
    }
    else {
      this.route.navigate(['/expert-list/', "class-" + trim, join]);
    }
  }

}
