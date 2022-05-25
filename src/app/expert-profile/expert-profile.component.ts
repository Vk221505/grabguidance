import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { DataService } from 'src/services/data.service';

declare let ga: Function;

@Component({
  selector: 'app-expert-profile',
  templateUrl: './expert-profile.component.html',
  styleUrls: ['./expert-profile.component.css']
})
export class ExpertProfileComponent implements OnInit {

  profileForm: FormGroup;
  submitted: boolean;
  pincodes: any;
  addressData: any;
  gender: any;
  city: any;
  state: any;
  expertId: string;
  expertEmail: string;
  expertMobile: string;
  expertName: string;
  genders: any;
  showProfileActive: boolean;
  routeIn: string;
  spinnerFlag: boolean;
  selectedFile: any
  imageUrl: any;
  showImg: boolean = false;
  profilePic: any;
  isSignUp: string;
  isAdmin: string;
  imageError: boolean
  savedValue: any;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
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

  ngOnInit() {
    this.profileForm = this.fb.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'phNumber': ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      'gender': ['', Validators.required],
      'address': ['', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'pincode': ['', Validators.required],
      'pan': ['']

    });
    this.genders = this.dataService.getGender();
    this.routeIn = "profile";
    this.fetchGender();
    this.expertId = localStorage.getItem('id_expert');
    this.expertEmail = localStorage.getItem('expert_email');
    this.expertMobile = localStorage.getItem('expert_mobile');
    this.expertName = localStorage.getItem('expert_name');
    this.savedValue = localStorage.getItem('value');

    console.log(typeof this.savedValue);

    if (this.expertEmail) {
      this.profileForm.patchValue({
        'email': this.expertEmail
      });
    }
    if (this.expertMobile) {
      this.profileForm.patchValue({
        'phNumber': this.expertMobile
      });
    }
    if (this.expertName) {
      this.profileForm.patchValue({
        'name': this.expertName
      });
    }

    if (this.isSignUp) {
      if (this.savedValue != "0") {
        this.fecthData();
      }
    } else {
      this.fecthData();
    }
  }

  fecthData() {
    this.fetchProfileDetails();
    this.fetchExpertProfilePitcher();
  }

  onChangePincode(pincode) {
    this.apiService.fetchPincode(pincode.target.value).subscribe(res => {
      this.addressData = res;
      if (this.addressData != undefined) {
        // this.city = this.addressData.data.city;
        // this.state = this.addressData.data.state;
        this.profileForm.patchValue({
          'city': this.addressData.data.city,
          'state': this.addressData.data.state
        });
      }
    })
  }

  fetchGender() {
    this.apiService.fetchGenders().subscribe(res => {
      this.genders = res;
      this.genders = this.genders.gender;
      console.log("gender = " + JSON.stringify(this.genders))
    })
  }

  onChangeGender(event) {
    console.log(event.target.value)
    this.profileForm.patchValue({
      'gender': event.target.value
    })
  }

  onSubmit(buttonType: any) {
    this.submitted = true;
    if (this.profileForm.valid) {
      this.spinnerFlag = true;
      this.apiService.saveExpertProfile(this.profileForm.value, this.expertId, this.isAdmin).subscribe(res => {
        this.spinnerFlag = false;
        let respCode = res['code'];
        if (respCode == '1000') {

          if (this.isSignUp) {
            this.apiService.updateExpert(this.expertId, '1').subscribe(data => {
              if (data.code == '1000') {
                if (buttonType === 'next') {
                  this.route.navigate(['/expert/education']);
                  this.routeIn = 'education';
                } else {
                  this.route.navigate(['/expert/dashboard/']);
                }
              }
  
  
            })
          }else{
            if (buttonType === 'next') {
              this.route.navigate(['/expert/education']);
              this.routeIn = 'education';
            } else {
              this.route.navigate(['/expert/dashboard/']);
            }
          }
          
        }
      })
    }
  }

  onSelectImg(event: any) {
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
    fd.append('id_expert', this.expertId)
    this.apiService.uploadExpertProfilePitcher(fd)
      .subscribe((data) => {
        this.spinnerFlag = false;
        console.log(data);
      })
  }

  fetchExpertProfilePitcher() {
    this.apiService.fetchProfilePitcher(this.expertId)
      .subscribe((data: any) => {
        if (data.code == 1000) {
          if (data.file.data && data.file.data.length > 0) {
            this.imageUrl = this.createImage(data.file.data);
          }
        }
      })
  }

  createImage(data: any) {
    this.showImg = true;
    var base64String = btoa(new Uint8Array(data).reduce(
      function (data, byte) {
        return data + String.fromCharCode(byte);
      }, ''));
    return this.sanitizer
      .bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + base64String)
  }

  sanitize(img) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + img);
  }

  fetchProfileDetails() {
    this.apiService.fetchExpertProfileDetails(this.expertId).subscribe(res => {
      let response = res['expert'];
      if (response != '' || response != undefined) {
        if (response.profile_pic) {
          this.showImg = true;
          this.imageUrl = response.profile_pic;
        }
        this.profileForm.patchValue({
          'name': response.full_name,
          'email': response.expert_email,
          'phNumber': response.expert_mobile,
          'address': response.address,
          'city': response.city,
          'state': response.state,
          'pincode': response.pincode,
          'pan': response.pan
        });
        this.profileForm.controls.gender.setValue(response.id_gender.toString());
      }
    })
  }
}
