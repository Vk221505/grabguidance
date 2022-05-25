import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { PrimaryLanguages } from 'src/shared-files/primary-lang.model';
import { SecondaryLanguages } from 'src/shared-files/secondary-lang.model';
import {isPlatformBrowser} from "@angular/common";


declare let ga: Function;

@Component({
  selector: 'app-expert-listing-details',
  templateUrl: './expert-listing-details.component.html',
  styleUrls: ['./expert-listing-details.component.css']
})
export class ExpertListingDetailsComponent implements OnInit {

  imageUrl: string | ArrayBuffer | SafeResourceUrl;
  registrationForm: any;
  editFile: boolean;
  removeUpload: boolean;
  expertImage: any;
  showImg: boolean = true;
  primaryLang: any;
  secondaryLang: any;
  primaryLanguage: any;
  secondaryLanguage: any;
  description: any;
  expertId: string;
  expertListResponse: any;
  descriptionResponse: any;
  primaryLangResponse: any;
  secondaryLangResponse: any;
  listingForm: FormGroup;
  showListingActive: boolean;
  routeIn: string;
  spinnerFlag: boolean;
  secondaryLangFinalList: any[];
  primaryLangFinalList: any[];
  profileImg = null;
  documents = [];
  isSignUp: string;
  isAdmin: any;
  imageError: boolean = false;
  submitted: boolean = false;

  constructor(
    private route: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private tostr: ToastrService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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

  ngOnInit(): void {
    this.showImg = false;
    this.primaryLang = PrimaryLanguages;
    console.log(this.primaryLang);
    this.secondaryLang = SecondaryLanguages;
    this.expertId = localStorage.getItem('id_expert');
    this.routeIn = "listing";
    this.listingForm = this.fb.group({
      'description': ['', [Validators.required]],
      'primaryLanguage': ['', [Validators.required]],
      'secondaryLanguage': ['', [Validators.required]]
    })
    if (!this.isSignUp) {
      this.fetchExpertListById();
      this.fetchProfileDocument();
    }
  }


  publishListing() {
    this.submitted = true;
    if (this.listingForm.valid) {
      if (this.isSignUp) {
        this.apiService.sendWelcomeEmail(this.expertId)
          .subscribe(() => {
            // localStorage.removeItem('isSignUp');
          })
      }
      this.spinnerFlag = true;
      this.apiService.saveExpertListing(this.listingForm.value, this.expertId, this.isAdmin).subscribe(res => {
        this.spinnerFlag = false;
        let respCode = res['code'];
        if (respCode == '1000') {
          if (this.isSignUp) {
            this.apiService.updateExpert(this.expertId, '5').subscribe(data => {
              if (data.code == '1000') {
                localStorage.removeItem('isSignUp');
                this.route.navigate(['/expert/dashboard']);
              }
            })
          } else {
            this.route.navigate(['/expert/dashboard']);

          }
        }
        else {
          this.tostr.error("Error in saving the data.")
        }
      })
    }
  }

  back() {
    if (this.isAdmin) {
      this.route.navigate(['/expert/availability'], { queryParams: { 'id': this.expertId } });
    }
    this.route.navigate(['/expert/availability']);
  }

  onFileSelected(event) {
    this.showImg = true;
    let reader = new FileReader();
    if ((event.target.files[0].size) / 1000000 > 1) {
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
    fd.append('type', this.findTheImageType(selectedImg.type));
    this.apiService.uploadExpertDocumentPitcher(fd)
      .subscribe((data) => {
        this.fetchProfileDocument();
        this.spinnerFlag = false;
      })
  }

  findTheImageType(type: string) {
    if (type.indexOf('image') !== -1) {
      return "IMG"
    } else if (type.indexOf('pdf') !== -1) {
      return "PDF"
    } else if (type.indexOf('docx') !== -1) {
      return "DOCX"
    }
  }


  deleteImg(id_document) {
    this.apiService.deleteDocumentPitcher(id_document)
      .subscribe(data => {
        console.log(data);
        this.fetchProfileDocument();
      })
  }

  createImageUerlFromArrayBuffer(data) {
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


  fetchProfileDocument() {
    this.apiService.fetchDocumentPitcher(this.expertId)
      .subscribe((data: any) => {
        this.documents = data.documents;
      })
  }

  fetchExpertListById() {
    this.apiService.fetchExpertListById(this.expertId).subscribe(res => {
      //  console.log("Expert List = " + JSON.stringify(res))
      this.descriptionResponse = res['listDetails'];
      this.primaryLangResponse = res['languages'];
      this.secondaryLangResponse = res['signLanguages'];
      this.primaryLangFinalList = [];
      this.secondaryLangFinalList = [];

      if (res.code == '1000') {
        this.description = this.descriptionResponse[0].description;

        for (let index = 0; index < this.primaryLangResponse.length; index++) {
          this.primaryLangFinalList.push({ ["languages"]: this.primaryLangResponse[index].language });
        }

        for (let index = 0; index < this.secondaryLangResponse.length; index++) {
          this.secondaryLangFinalList.push({ ["languages"]: this.secondaryLangResponse[index].sign_language });
        }

        this.listingForm.patchValue({
          'description': this.description,
          'primaryLanguage': this.primaryLangFinalList,
          'secondaryLanguage': this.secondaryLangFinalList
        });
      }
    })
  }

}
