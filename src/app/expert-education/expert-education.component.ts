import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { ExperienceModel } from 'src/shared-files/experience.model';
import { QualificationModel } from 'src/shared-files/qualification.model';
import {isPlatformBrowser} from "@angular/common";


declare let ga: Function;

@Component({
  selector: 'app-expert-education',
  templateUrl: './expert-education.component.html',
  styleUrls: ['./expert-education.component.css']
})
export class ExpertEducationComponent implements OnInit {

  educationForm: FormGroup;
  educationAndExperienceForm: FormGroup;
  experienceForm: FormGroup;
  submitted: boolean;
  showAddAfterEducationHeading: boolean;
  showAddAfterExperienceHeading: boolean;
  expertId: any;
  qualificationData: QualificationModel[] = [];
  experienceData: ExperienceModel[] = [];
  totalExperience: number;
  routeIn: string;
  spinnerFlag: boolean;
  isSignUp: string;
  isAdmin: string;
  savedValue: any;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.submitted = false;
    this.spinnerFlag = false;
    this.isSignUp = localStorage.getItem('isSignUp');
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

  get experienceFormArray() {
    return <FormArray>this.educationAndExperienceForm.controls.experienceForm;
  }

  get educationFormArray() {
    return <FormArray>this.educationAndExperienceForm.controls.educationForm;
  }

  ngOnInit(): void {
    this.expertId = localStorage.getItem('id_expert');
    this.educationAndExperienceForm = this.fb.group({
      'educationForm': this.fb.array([this.createEducationFormGroup()]),
      'experienceForm': this.fb.array([this.createExperienceFormGroup()]),
      'totalExperience': ['', Validators.required]
    });
    this.routeIn = 'education';
    this.showAddAfterEducationHeading = false;
    this.showAddAfterExperienceHeading = true;
    this.savedValue = localStorage.getItem('value');

    if (this.isSignUp) {
      if (this.savedValue != "1") {
        this.fetchData();
      }
    } else {
      this.fetchData();
    }
  }

  fetchData() {
    this.fetchQualificationById();
    this.fetchExperienceById();
  }

  addEducationFormGroup() {
    this.showAddAfterEducationHeading = true;
    const education = this.educationAndExperienceForm.get('educationForm') as FormArray;
    education.push(this.createEducationFormGroup());
  }

  addExperienceFormGroup() {
    this.showAddAfterExperienceHeading = true;
    const experience = this.educationAndExperienceForm.get('experienceForm') as FormArray;
    experience.push(this.createExperienceFormGroup());
  }

  removeEducationFormGroup(index) {
    const education = this.educationAndExperienceForm.get('educationForm') as FormArray
    if (education.length > 1) {
      education.removeAt(index);
    } else {
      education.reset();
    }
  }

  removeExperienceFormGroup(index) {
    const experience = this.educationAndExperienceForm.get('experienceForm') as FormArray
    if (experience.length > 1) {
      experience.removeAt(index);
    } else {
      experience.reset();
    }
  }

  private createEducationFormGroup(): FormGroup {
    return this.educationForm = this.fb.group({
      'school': ['', Validators.required],
      'degree': ['', Validators.required],
      'specialization': ['', Validators.required],
      'passed_year': ['', Validators.required]
    })
  }

  private createExperienceFormGroup(): FormGroup {
    return this.experienceForm = this.fb.group({
      'duration': ['', Validators.required],
      'designation': ['', Validators.required],
      'company_name': ['', Validators.required]
    })
  }

  onSubmit(buttonType) {
    this.submitted = true;
    if (this.educationAndExperienceForm.valid) {
      this.spinnerFlag = true;
      this.apiService.saveExpertEducationAndExperience(this.educationAndExperienceForm.controls.educationForm.value,
        this.educationAndExperienceForm.controls.experienceForm.value, this.expertId, this.educationAndExperienceForm.value.totalExperience, this.isAdmin).subscribe(res => {
          this.spinnerFlag = false;
          if (this.isSignUp) {
            this.apiService.updateExpert(this.expertId, '2').subscribe(data => {
              if (data.code == '1000') {
                if (buttonType === 'next') {
                  this.route.navigate(['/expert/services']);
                } else {
                  this.route.navigate(['/expert/dashboard/']);
                }
              }
            })
          } else {
            if (buttonType === 'next') {
              this.route.navigate(['/expert/services']);
            } else {
              this.route.navigate(['/expert/dashboard/']);
            }
          }

        })
    }
  }

  back() {
    this.route.navigate(['/expert/profile']);
  }

  clearEducationFormControl() {
    const control = <FormArray>this.educationAndExperienceForm.controls['educationForm'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    // control.reset();
  }

  clearExperienceFormControl() {
    const control = <FormArray>this.educationAndExperienceForm.controls['experienceForm'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
    // control.reset();
  }

  fetchQualificationById() {
    this.apiService.fetchQualificationById(this.expertId).subscribe(res => {
      this.qualificationData = res['expertsQualification'];
      console.log(this.qualificationData)
      if (this.qualificationData.length > 0) {
        this.clearEducationFormControl();
        const control = <FormArray>this.educationAndExperienceForm.controls['educationForm'];
        this.qualificationData.forEach(x => {
          control.push(this.fb.group({
            school: [x.school, Validators.required],
            degree: [x.degree, Validators.required],
            specialization: [x.specialization, Validators.required],
            passed_year: [x.passed_year, Validators.required]
          }));
        });
      }
    });
  }

  fetchExperienceById() {
    this.apiService.fetchExperienceById(this.expertId).subscribe(res => {
      this.totalExperience = res['total_experience'];
      this.experienceData = res['expertExperience'];
      if (this.experienceData.length > 0) {
        this.clearExperienceFormControl();
        const control = <FormArray>this.educationAndExperienceForm.controls['experienceForm'];
        this.experienceData.forEach(x => {
          control.push(this.fb.group({
            duration: [x.duration, Validators.required],
            designation: [x.designation, Validators.required],
            company_name: [x.company_name, Validators.required],
          }));
        });
      }
      this.setTotalExperience();
    });
  }

  setTotalExperience() {
    this.educationAndExperienceForm.patchValue({
      'totalExperience': this.totalExperience
    })
  }
}
