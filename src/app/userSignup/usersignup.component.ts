import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-usersignup',
  templateUrl: './usersignup.component.html',
  styleUrls: ['./usersignup.component.css']
})
export class UsersignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted: boolean;
  token: any;
  errorMsg: any;

  constructor(
    private route: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.submitted = false;
    this.signupForm = this.fb.group({
      'expert_email': ['', [Validators.required, Validators.email]],
      'expert_mobile': ['', Validators.required],
      'full_name': ['', Validators.required],
    })
  }

  signin() {
    // this.apiService.openSignInModal();
    // this.apiService.closeSignUpModal();
  }

  signup() {
    this.submitted = true;
    if (this.signupForm.valid) {

       let user = {
         "user_email": this.signupForm.value.expert_email,
         "user_mobile": this.signupForm.value.expert_mobile,
         "full_name": this.signupForm.value.full_name
       }

      this.apiService.signup(this.signupForm.value).subscribe(data => {
        console.log("signup",data);
        let responseCode = data['code'];
        if (responseCode == '1001') {
          this.errorMsg = data['status'];
          this.toastr.error(this.errorMsg, "Error");
        } else {
          this.token = data['token'];
          let expertData = data['expert'];
          // let expertEmail = data['expert.expert_email'];
          // let expertMobile = data['expert.expert_mobile'];

          console.log("res = " + JSON.stringify(data))
          localStorage.setItem('token', this.token);
          localStorage.setItem('id_expert', expertData.id_expert);
          localStorage.setItem('expert_email', expertData.expert_email);
          localStorage.setItem('expert_mobile', expertData.expert_mobile);
          localStorage.setItem('expert_name', expertData.full_name);
          localStorage.setItem('isSignUp', 'true');
          this.toastr.success("Sign up succesful", "Success");
        //  this.apiService.closeSignUpModal();
          this.route.navigate  (['/expert-welcome/expert-profile']);
        }
      });
    }
  }

  // login(){
  //   this.route.navigate(['/signin']);
  // }


}
