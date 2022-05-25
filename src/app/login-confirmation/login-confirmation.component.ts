import { Component, Inject, OnInit, PLATFORM_ID, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { isPlatformBrowser } from "@angular/common";


declare var $: any;
@Component({
  selector: 'app-login-confirmation',
  templateUrl: './login-confirmation.component.html',
  styleUrls: ['./login-confirmation.component.css']
})
export class LoginConfirmationComponent implements OnInit {

  OTPForm: FormGroup;
  userType: string;
  userId: string;
  expertId: string;
  finalOTP: string;
  isSignUp: string;
  mobile: string;
  spinnerFlag: boolean = false;
  hideNumber: string;
  userObj: any;
  expertobj: any;
  errorMsg: any;
  token: string;
  returnUrl: string;
  formInput = ['input1', 'input2', 'input3', 'input4'];
  @ViewChildren('formRow') rows: any;

  constructor(
    private route: Router,
    private toastr: ToastrService,
    private dataSerive: DataService,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.OTPForm = this.toFormGroup(this.formInput);
  }

  ngOnInit() {
    this.fetchDataFromLocalStorage();
  }


  toFormGroup(elements) {
    const group: any = {};

    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    event.preventDefault();
    event.stopPropagation();
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
    if (pos == this.formInput.length) {
      this.fetchDataFromLocalStorage();
      this.verifyOTP();
    }
  }

  fetchDataFromLocalStorage() {
    this.finalOTP = Object.values(this.OTPForm.value).join("");
    this.userType = localStorage.getItem('userType');
    this.isSignUp = localStorage.getItem('isSignUp');
    this.returnUrl = localStorage.getItem('redirectUrl');
    this.mobile = localStorage.getItem('mobile');
    this.userObj = JSON.parse(localStorage.getItem('user'));
    this.expertobj = JSON.parse(localStorage.getItem('expert'))
    if (this.userType && this.userType == 'User') {
      this.userId = localStorage.getItem('id');
    } else {
      this.expertId = localStorage.getItem('id');
    }
  }

  verifyOTP() {
    if (this.isSignUp) {
      if (this.userType == "User") {
        this.spinnerFlag = true;
        this.apiService.verifyUserSignUpOtp(this.userObj.user_email,
          this.userObj.user_mobile, this.userObj.full_name, this.finalOTP)
          .subscribe(data => {
            this.spinnerFlag = true;
            if (data.code == 1000) {
              this.spinnerFlag = false;
              this.removeDataFromLocalStorage()
              localStorage.removeItem('isSignUp');
              localStorage.removeItem('user');
              this.signUpConfirmation(data);
            } else {
              this.spinnerFlag = false;
              this.errorResponse();
            }
          })
      } else {
        this.spinnerFlag = true;
        this.apiService.verifyExpertSignUpOtp(this.expertobj.expert_email,
          this.expertobj.expert_mobile, this.expertobj.full_name, this.finalOTP)
          .subscribe(data => {
            this.spinnerFlag = true;
            if (data.code == 1000) {
              this.spinnerFlag = false;
              this.removeDataFromLocalStorage()
              localStorage.removeItem('isSignUp');
              localStorage.removeItem('expert');
              this.signUpConfirmation(data);
            } else {
              this.spinnerFlag = false;
              this.errorResponse();
            }
          })
      }
    } else {
      if (this.userType == "User") {
        this.spinnerFlag = true;
        this.apiService.verifyUserOtp(localStorage.getItem('id'), this.finalOTP)
          .subscribe(data => {
            this.spinnerFlag = false;
            if (data.code == 1000) {
              this.removeDataFromLocalStorage()
              this.loginconfirmation(data);
            } else {
              this.errorResponse();
            }
          }, (error => {
            this.errorResponse();
          }))
      } else {
        this.spinnerFlag = true;
        this.apiService.verifyExpertOtp(this.expertId, this.finalOTP)
          .subscribe(data => {
            this.spinnerFlag = false;
            if (data.code == 1000) {
              this.removeDataFromLocalStorage()
              this.loginconfirmation(data);
            } else {
              this.errorResponse();
            }
          }, (error) => {
            this.errorResponse();
          })
      }
    }
  }

  errorResponse() {
    this.spinnerFlag = false;
    this.toastr.error('Invalid OTP');
  }

  signUpConfirmation(data: any) {
    let responseCode = data['code'];
    if (responseCode == '1001') {
      this.errorMsg = data['status'];
      this.toastr.error(this.errorMsg, "Error");
    } else {
      this.token = data['token'];
      localStorage.setItem('token', this.token);
      if (data['expert']) {
        let expertData = data['expert'];
        localStorage.setItem('id_expert', expertData.id_expert);
        localStorage.setItem('expert_email', expertData.expert_email);
        localStorage.setItem('expert_mobile', expertData.expert_mobile);
        localStorage.setItem('expert_name', expertData.full_name);
        localStorage.setItem('isSignUp', 'true');
        this.toastr.success("Sign up succesful", "Success");
        this.apiService.closeOtpVerificationModal();
        this.dataSerive.setUserLoggingStatus('true')
        this.route.navigate(['/expert/profile']);
      } else {
        let userData = data['user'];
        localStorage.setItem('id_user', userData.id_user);
        localStorage.setItem('user_email', userData.user_email);
        localStorage.setItem('user_mobile', userData.user_mobile);
        localStorage.setItem('user_name', userData.full_name);
        this.toastr.success("Sign up succesful", "Success");
        localStorage.setItem('isSignUp', 'true')
        this.route.navigate(['/user/profile']);
        this.apiService.closeOtpVerificationModal();
        this.dataSerive.setUserLoggingStatus('true')
      }
    }
  }

  loginconfirmation(res: any) {
    let data = res['info'];
    let token = res['token'];
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', "true");
    localStorage.setItem('value', data.value);
    if (this.userType != "User") {
      localStorage.setItem('id_expert', data.id);
      localStorage.setItem('expert_email', data.email);
      localStorage.setItem('expert_name', data.name);
      localStorage.setItem('expert_mobile', this.mobile),
        localStorage.setItem('user_role', "expert");
      this.apiService.closeOtpVerificationModal();
      this.dataSerive.setUserLoggingStatus('true');

      if (+data.value < 5) {
        localStorage.setItem('isSignUp', "true");
      }
      if (+data.value == 1) {
        this.route.navigate(['/expert/education']);
      } else if (+data.value == 2) {
        this.route.navigate(['/expert/services']);
      } else if (+data.value == 3) {
        this.route.navigate(['/expert/availability']);

      } else if (+data.value == 4) {
        this.route.navigate(['/expert/listing']);

      } else if (+data.value == 5) {
        this.route.navigate(['/expert/dashboard']);
      } else {
        this.route.navigate(['/expert/profile']);
      }

    } else {
      localStorage.setItem('id_user', data.id);
      localStorage.setItem('user_email', data.email);
      localStorage.setItem('user_mobile', this.mobile);
      localStorage.setItem('user_name', data.name);
      localStorage.setItem('user_role', "user");
      this.apiService.closeOtpVerificationModal();
      this.dataSerive.setUserLoggingStatus('true');
      if (data.value == 1) {
        if (this.returnUrl) {
          this.route.navigate([this.returnUrl]);
        } else {
          this.route.navigate(['/']);
        }
      } else {
        localStorage.setItem('isSignUp', 'true')
        this.route.navigate(['/user/profile']);
      }
    }

  }

  removeDataFromLocalStorage() {
    localStorage.removeItem('mobile');
    localStorage.removeItem('hideNumber')
    localStorage.removeItem('userType');
    localStorage.removeItem('id');
  }

  back() {
    localStorage.clear();
    this.apiService.closeOtpVerificationModal();
    this.apiService.openExpertSignInModal('User SignIn');
  }

  close() {
    if (isPlatformBrowser(this.platformId)) {
      $("#loginConfirmModal").modal("hide");
      localStorage.clear();
      this.route.navigate([this.route.url]);
    }
  }


  resend() {
    this.userType = localStorage.getItem('userType');
    this.isSignUp = localStorage.getItem('isSignUp');
    this.mobile = localStorage.getItem("mobile");
    console.log(this.mobile);
    if (this.isSignUp == 'true') {
      let mobile = this.mobile;
      this.apiService.SignUpResendOTP(mobile)
        .subscribe(data => {
          if (data.code == 1000) {
            this.toastr.success("New OTP is send to you registered mobile")
          } else {
            this.toastr.error("Error in resending the OTP");
          }
        })
    } else {
      if (this.userType == 'User') {
        this.apiService.UsertLoginResndOTp(localStorage.getItem('id'))
          .subscribe(data => {
            if (data.code == 1000) {
              this.toastr.success("New OTP is send to you registered mobile")
            } else {
              this.toastr.error("Error in resending the OTP");
            }
          })
      } else {
        this.apiService.ExpertLoginResndOTp(localStorage.getItem('id'))
          .subscribe(data => {
            if (data.code == 1000) {
              this.toastr.success("New OTP is send to you registered mobile")
            } else {
              this.toastr.error("Error in resending the OTP");
            }
          })
      }
    }
  }

}
