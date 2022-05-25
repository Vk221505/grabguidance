import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';
import { Title, Meta } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-user-signin',
  templateUrl: './user-signin.component.html',
  styleUrls: ['./user-signin.component.css']
})
export class UserSigninComponent implements OnInit {

  signInForm: FormGroup;
  submitted: boolean;
  spinnerFlag: boolean;
  hideNumnber: string;
  OTPform: FormGroup;
  userType: string;
  errorMsg: string;

  constructor(
    private title: Title,
		private meta: Meta,
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.submitted = false;
    this.spinnerFlag = false;
  }

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
  ngOnInit(): void {

    // meta tags

this.title.setTitle('Best Online Sessions and Classes for Students | Sign In Now!');
this.meta.updateTag({
  name: 'description',
  content:
    'We provide online career counselling & academic guidance to help you with your queries & doubts. So go ahead & sign up!'
});
this.meta.updateTag({
  name: 'keywords',
  content:
    'sign in, online classes, online sessions, online career counselling, online career guidance, online doubt solving, best career counselling online, online doubt solving platform'
});
    this.signInForm = this.fb.group({
      'phNumber': ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    });

  }

  login() {
    this.submitted = true;
    if (this.signInForm.valid) {
      this.spinnerFlag = true;
      this.apiService.sendUserOtp(this.signInForm.value.phNumber)
        .subscribe(data => {
          this.spinnerFlag = false;
          if (data.code == 1000) {
            this.setDataInLocalStorage(data.id);
            this.route.navigate(['/confirmation-otp'])
          } else {
            this.errorMsg = data['status'];
          }
        })
    }
  }

  setDataInLocalStorage(id: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.hideNumnber = this.signInForm.value.phNumber.substring(6);
      localStorage.setItem('mobile', this.signInForm.value.phNumber);
      localStorage.setItem('hideNumber', this.hideNumnber)
      localStorage.setItem('userType', "User");
      localStorage.setItem('id', id);
    }
  }

  close() {
    if (isPlatformBrowser(this.platformId)) {
      this.signInForm.reset();
      localStorage.clear();
      this.errorMsg = null;
      this.apiService.closeExpertSignInModal();
    }
  }

}
