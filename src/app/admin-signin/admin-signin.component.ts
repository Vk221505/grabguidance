import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-admin-signin',
  templateUrl: './admin-signin.component.html',
  styleUrls: ['./admin-signin.component.css']
})
export class AdminSigninComponent implements OnInit {

  login = {
     email: "",
     paassword: ''
  }
  loginForm: FormGroup;
  isAdmin;
  expertId;
  userRole;

  constructor(private fb: FormBuilder,
              private apiService: ApiService,
              private route: Router) {
                this.isAdmin = localStorage.getItem('isadmin');
                this.expertId = localStorage.getItem('id_expert')
                this.userRole = localStorage.getItem('user_role')
              }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
   })
    if(this.userRole){
        if(this.userRole === "expert") {
          this.route.navigate(['/expert-dashboard/' + this.expertId]);
        } else {
          this.route.navigate(['/admin/dashboard']);
        }
    }
  }

  onSubmit(){
     if(this.loginForm.valid){
      this.apiService.adminSignIn({ email: this.loginForm.value.email,
             password: this.loginForm.value.password})
                .subscribe( res => {
                  let respCode = res['code'];
                  if(respCode == '1000'){
                    localStorage.setItem('isLoggedIn', "true");
                    localStorage.setItem('isadmin', "true");
                    if(res['info']) {
                      let data = res['info'];
                      localStorage.setItem('id_admin', data.id);
                      localStorage.setItem('admin_email', data.email);
                      localStorage.setItem('admin_pic', data.pic);
                      localStorage.setItem('user_role', 'admin');
                    }
                    this.route.navigate(['/admin/dashboard']);
                   }
                })
  }
 }

}
