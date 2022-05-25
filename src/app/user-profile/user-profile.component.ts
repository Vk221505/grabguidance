import { Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';
import { UserProfile } from '../models/user.model';
import {isPlatformBrowser} from "@angular/common";

declare let ga: Function;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userProfileForm: FormGroup;
  submitted: boolean;
  isSignUp: any
  genders: any[] = [];
  username: string;
  userId: string;
  userType: string;
  isAdmin: string;
  showImg: boolean = false;
  imageUrl: any;
  spinnerFlag: boolean = false;
  imageError: boolean;
  addressData: any;
  a;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private apiService: ApiService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.submitted = false;
    this.isSignUp = localStorage.getItem('isSignUp');
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

  ngOnInit(): void {

    this.genders = this.dataService.getGender();//.filter(gender => {
    //  return gender.id_gender != 0 ;
    //});
    this.username = localStorage.getItem('user_name');
    this.userId = localStorage.getItem('id_user');
    this.isSignUp = localStorage.getItem('isSignup');
    this.isAdmin = localStorage.getItem('isadmin');
    this.userType = localStorage.getItem('user_role');
    this.userProfileForm = this.fb.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'phNumber': ['', Validators.required],
      'gender': ['1', Validators.required],
      'dob': ['', Validators.required],
      'address': ['', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'pincode': ['', Validators.required],
      'gstin': ['']

    })
    // this.userProfileForm.controls['gender'].setValue(-1);
    this.a = -1;
    if (!this.isSignUp) {
      this.getUserProfile();
      this.fetchProfilePitcher();
    } else {
      this.userProfileForm.patchValue({
        'name': this.username,
        'email': localStorage.getItem('user_email'),
        'phNumber': localStorage.getItem('user_mobile')
      })
    }
  }

  onSelectImg(event: any) {
    console.log("event ", event.target.files)
    this.showImg = true;
    let reader = new FileReader();
    if ((event.target.files[0].size) / 1000000 > 2) {
      this.imageError = true;
      return;
    } else {
      this.spinnerFlag = true;
      this.imageError = false;
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.imageUrl = event.target.result;
        }
        this.uploadImage(event);
      }
    }

  }

  uploadImage(event) {
    let selectedImg = <File>event.target.files[0];
    let fd = new FormData()
    fd.append("file", selectedImg, selectedImg.name)
    fd.append('id_user', this.userId)
    this.apiService.uploadUserProfilePitcher(fd)
      .subscribe((data) => {
        this.spinnerFlag = false;
        console.log(data);
      })
  }

  save() {
    this.submitted = true;
    if (this.userProfileForm.valid) {
      this.spinnerFlag = true;
      let formValue = this.userProfileForm.value;
      let user: UserProfile = {
        userId: this.userId,
        name: formValue.name,
        email: formValue.email,
        phNumber: formValue.phNumber,
        gender: formValue.gender,
        address: formValue.address,
        city: formValue.city,
        state: formValue.state,
        pincode: formValue.pincode,
        gstin: formValue.gstin,
        dob: moment(formValue.dob).format("YYYY-MM-DD")
      }
      this.apiService.saveUserProfile(user, this.userId, this.isAdmin)
        .subscribe(data => {
          this.spinnerFlag = false;
          localStorage.removeItem('isSignUp');
          if(isPlatformBrowser(this.platformId)){
            if (window.innerWidth < 992) {
              this.toastr.success("Your data is saved successfully");
            } else {
              if (this.userType == 'admin' && this.isAdmin) {
                this.route.navigate(['/admin-users']);
              } else {
                this.route.navigate(['/user/dashboard']);
              }
            }
          }
        })
    }
  }

  fetchProfilePitcher() {
    this.apiService.getUserProfilePitcher(this.userId)
      .subscribe(data => {
        if (data.code == 1000) {
          this.showImg = true;
          this.imageUrl = data.file;
        }
      })
  }

  createImgUrl(data: any) {
    if (data) {
      var base64String = btoa(new Uint8Array(data).reduce(
        function (data, byte) {
          return data + String.fromCharCode(byte);
        }, ''));

      return this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
    } else {
      return "../../assets/images/image.png";
    }
  }

  getUserProfile() {
    this.apiService.getUserProfile(this.userId)
      .subscribe(data => {
        let user = data.user[0];
        this.userProfileForm.patchValue({
          'name': user.full_name,
          'email': user.user_email,
          'phNumber': user.user_mobile,
          'dob': user.date_of_birth,
          'address': user.address,
          'city': user.city,
          'state': user.state,
          'pincode': user.pincode,
          'gstin': user.gstin

        })
        this.userProfileForm.controls.gender.setValue(user.id_gender);
      })
  }

  onChangePincode(pincode) {
    this.apiService.fetchPincode(pincode.target.value).subscribe(res => {
      this.addressData = res;
      if (this.addressData != undefined) {
        this.userProfileForm.patchValue({
          'city': this.addressData.data.city,
          'state': this.addressData.data.state
        });
      }
    })
  }

}
