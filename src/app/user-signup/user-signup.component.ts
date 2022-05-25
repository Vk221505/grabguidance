import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Title, Meta } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {


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

this.title.setTitle('Best Online Sessions and Classes for Students | Sign Up Now!');
this.meta.updateTag({
  name: 'description',
  content:
    'We provide online career counselling & academic guidance to help you with your queries & doubts. So go ahead & sign up!'
});
this.meta.updateTag({
  name: 'keywords',
  content:
    'sign up, online career counselling, online career guidance, online doubt solving, best career counselling online, online doubt solving platform'
});
    this.submitted = false;
    this.signupForm = this.fb.group({
      'expert_email': ['', [Validators.required, Validators.email]],
      'expert_mobile': ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'full_name': ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
    })
  }



  signup(form: FormGroup) {
    this.submitted = true;
    if (this.signupForm.valid) {
      if (isPlatformBrowser(this.platformId)) {
        this.userType = $("#ModalLabel").text().split(' ')[0]
      }
      let user = {
        "user_email": this.signupForm.value.expert_email,
        "user_mobile": this.signupForm.value.expert_mobile,
        "full_name": this.signupForm.value.full_name
      }
      this.apiService.sendUserSignUpOtp(user.user_email, user.user_mobile, user.full_name)
        .subscribe(data => {
          if (data.code == 1000) {
            this.setDataInLocalStorage(user)
            this.route.navigate(['/confirmation-otp'])
          } else {
            if (data.code == '1001') {
              this.errorMsg = "User " + data['status'];
            }
          }
        })
    }
  }

  setDataInLocalStorage(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('hideNumnber', this.signupForm.value.expert_mobile.substring(6))
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', "User");
      localStorage.setItem('isSignUp', "true");
      this.errorMsg = null;
      this.signupForm.reset();
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
