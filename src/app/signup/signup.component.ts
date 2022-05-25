import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from '@angular/common';


declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted: boolean;
  token: any;
  errorMsg: any;
  userType: string;

  constructor(
    private route: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.signupForm = this.fb.group({
      'expert_email': ['', [Validators.required, Validators.email]],
      'expert_mobile': ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'full_name': ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
    })
  }


  signin() {
    this.close();
    if (isPlatformBrowser(this.platformId)) {
      if ($("#ModalLabel").text().split(' ')[0] == "User") {
        this.apiService.openExpertSignInModal("User SignIn")
      } else {
        this.apiService.openExpertSignInModal("Expert Login")
      }
    }
  }

  signup(form: any) {
    console.log(form)
    this.submitted = true;
    if (this.signupForm.valid) {
      if (isPlatformBrowser(this.platformId)) {
        this.userType = $("#ModalLabel").text().split(' ')[0]
      }
      if (this.userType == "User") {
        let user = {
          "user_email": this.signupForm.value.expert_email,
          "user_mobile": this.signupForm.value.expert_mobile,
          "full_name": this.signupForm.value.full_name
        }
        this.apiService.sendUserSignUpOtp(user.user_email, user.user_mobile, user.full_name)
          .subscribe(data => {
            if (data.code == 1000) {
              localStorage.setItem('hideNumnber', this.signupForm.value.expert_mobile.substring(6))
              localStorage.setItem('user', JSON.stringify(user));
              localStorage.setItem('userType', this.userType);
              localStorage.setItem('isSignUp', "true");
              this.errorMsg = null;
              this.signupForm.reset();
              this.apiService.closeExpertSignUpModal();
              this.apiService.openOtpVerificationModal();
            } else {
              if (data.code == '1001') {
                this.errorMsg = "User " + data['status'];
              }
            }
          })
      } else {
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
              this.apiService.closeExpertSignUpModal();
              this.apiService.openOtpVerificationModal();
            } else {
              if (data.code == '1001') {
                this.errorMsg = "Expert " + data['status'];
              }
            }
          })
      }
    }
  }

  close() {
    this.errorMsg = null;
    this.signupForm.reset();
    localStorage.clear();
    this.apiService.closeExpertSignUpModal();
  }
}
