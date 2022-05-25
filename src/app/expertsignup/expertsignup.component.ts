import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-expertsignup',
  templateUrl: './expertsignup.component.html',
  styleUrls: ['./expertsignup.component.css']
})

export class ExpertsignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted: boolean;
  token: any;
  errorMsg: any;
  userType: string;

  constructor(
    private title: Title,
		private meta: Meta,
    private route: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 15,
    autoHeight: true,
    navSpeed: 600,
    navText: [],
    autoplay: true,
    autoplayTimeout: 5000,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
  ngOnInit() {

// meta tags

this.title.setTitle('Best Online teaching platform for experts | Sign Up Now!');
this.meta.updateTag({
  name: 'description',
  content:
    'GrabGuidance is the best online teaching platform for top leading experts. Sign up and become an expert now!'
});
this.meta.updateTag({
  name: 'keywords',
  content:
    'sign up, best online teaching platform, online career guidance, online doubt solving, online doubt solving platform'
});

    this.submitted = false;
    this.signupForm = this.fb.group({
      'expert_email': ['', [Validators.required, Validators.email]],
      'expert_mobile': ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'full_name': ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
    })
  }

  signup(form: any) {
    console.log(form)
    this.submitted = true;
    if (this.signupForm.valid) {
      let expert = this.signupForm.value;
      this.apiService.sendExpertSignUpOtp(expert.expert_email, expert.expert_mobile, expert.full_name)
        .subscribe(data => {
          if (data.code == 1000) {
            localStorage.setItem('hideNumnber', this.signupForm.value.expert_mobile.substring(6))
            localStorage.setItem('expert', JSON.stringify(this.signupForm.value));
            localStorage.setItem('userType', 'Expert');
            localStorage.setItem('isSignUp', "true");
            this.errorMsg = null;
            this.signupForm.reset();
            this.route.navigate(['/confirmation-otp'])
          } else {
            if (data.code == '1001') {
              this.errorMsg = "Expert " + data['status'];
            }
          }
        })
    }
  }

  close() {
    if (isPlatformBrowser(this.platformId)) {
      this.errorMsg = null;
      this.signupForm.reset();
      localStorage.clear();
      this.apiService.closeExpertSignUpModal();
    }
  }
}
