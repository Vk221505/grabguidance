import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from '@angular/common';


declare var $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  signInForm: FormGroup;
  submitted: boolean;
  spinnerFlag: boolean;
  hideNumnber: string;
  OTPform: FormGroup;
  userType: string;
  errorMsg: string;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.submitted = false;
    this.spinnerFlag = false;
  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      'phNumber': ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    });
  }

  login() {
    this.submitted = true;
    if (this.signInForm.valid) {
      if (isPlatformBrowser(this.platformId)) {
        this.userType = $("#ModalLabel").text().split(' ')[0];
      }
      if (this.userType == 'User') {
        this.spinnerFlag = true;
        this.apiService.sendUserOtp(this.signInForm.value.phNumber)
          .subscribe(data => {
            this.spinnerFlag = false;
            if (data.code == 1000) {
              this.setDataInLocalStorage(data.id);
            } else {
              this.errorMsg = data['status'];
            }
          })
      } else {
        this.userType = "Expert";
        this.spinnerFlag = true;
        this.apiService.sendExpertOtp(this.signInForm.value.phNumber)
          .subscribe(data => {
            this.spinnerFlag = false;
            if (data.code == 1000) {
              this.setDataInLocalStorage(data.id);
              
            } else {
              this.errorMsg =  data['status'];
            }
          })
      }
    }
  }

  signup() {
    this.close();
    if (isPlatformBrowser(this.platformId)) {
      if (($("#ModalLabel").text().split(' ')[0]) == "User") {
        this.apiService.openExpertSignUpModal("User Sign Up")
      } else {
        this.apiService.openExpertSignUpModal("Expert Sign Up")
      }
    }
  }

  setDataInLocalStorage(id: any) {
    this.hideNumnber = this.signInForm.value.phNumber.substring(6);
    localStorage.setItem('mobile', this.signInForm.value.phNumber);
    localStorage.setItem('hideNumber', this.hideNumnber)
    localStorage.setItem('userType', this.userType);
    localStorage.setItem('id', id);
    this.apiService.closeExpertSignInModal();
    this.apiService.openOtpVerificationModal();
  }

  close() {
    this.signInForm.reset();
    localStorage.clear();
    this.errorMsg = null;
    this.apiService.closeExpertSignInModal();
  }

}
