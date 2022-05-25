import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/services/api.service';
import { UtilityService } from 'src/services/utility.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from "@angular/common";

declare let ga: Function;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  cardshow: boolean = false;
  checkOutObj: any = {};
  username: any
  selectedClass: string;
  selectRole: string;
  expert: any;
  languages: any;
  education: any;
  subject: any;
  session: any;
  price: string;
  count: string;
  total: any;
  userImgUrl: any;
  expertImgUrl: any;
  userId: string;
  userType: string;
  userEmail: string;
  userPhoneNumber: string;
  isAdmin: string;
  userAdminList: any[] = [];
  multi: number;
  query: string = "";
  admin: any;
  imageError: boolean;
  joiningList: any[] = [];
  documents: any[] = [];
  fileData: any;
  pic: any;
  discount
  totalDiscount
  isPromoCodeApplied: boolean = false;
  promocode
  dur
  prmo


  constructor(private UtilityService: UtilityService,
    private sanitizer: DomSanitizer,
    private apiService: ApiService,
    private route: Router,
    private tostr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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

  back() {
    if (isPlatformBrowser(this.platformId)) {
      window.history.back();
    }
  }

  showResponsiveCard() {
    this.cardshow = !this.cardshow
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.checkOutObj = JSON.parse(sessionStorage.getItem('checkout'));
      this.selectedClass = sessionStorage.getItem('searchedClass') == "null" ? null : sessionStorage.getItem('searchedClass');
      this.selectRole = sessionStorage.getItem('searchedSubject') == "null" ? null : sessionStorage.getItem('searchedSubject');
      this.isAdmin = localStorage.getItem('isadmin');
      this.userEmail = localStorage.getItem('user_email');
      this.userPhoneNumber = localStorage.getItem('user_mobile');
      this.userType = localStorage.getItem('user_role');
      this.admin = localStorage.getItem('isadmin');
    }

    this.session = this.checkOutObj.session;
    this.expert = this.checkOutObj.expert;
    this.education = this.expert.education[0];
    this.subject = this.expert.subject;
    this.languages = this.filterLanguage(this.expert.languages);
    this.price = this.checkOutObj.price;
    this.count = this.checkOutObj.count;
    this.total = (+this.price) * (+this.count);
    this.joiningList[1] = { name: this.expert.name, profession: 'expert' }
    this.joiningList[2] = { name: "GrabGuidance Moderator", profession: 'A supervisor from the company may join the room for quality & traning purposes' }


    this.fetchExpertProfilePitcher();
    if (this.userType == 'admin' && this.admin) {
      this.getAdminUserList();
    } else {
      this.userId = localStorage.getItem('id_user');
      this.username = localStorage.getItem('user_name');
      this.joiningList[0] = { name: this.username, profession: "You" }
      this.fetchUserProfilePitcher();
    }
  }

  filterLanguage(languages: string) {
    return languages.split(", ").filter(lang => {
      return lang != "undefined";
    }).join(",")
  }

  formatSessionDate(date: string) {
    var todaysDate = moment(new Date()).format().split("T")[0];
    var endDate = moment(date).format().split("T")[0];
    var diff = moment(endDate).diff(moment(todaysDate), 'days');
    if (diff === 0) {
      return "Today";
    }
    return moment(date).format('ddd, DD MMM');
  }

  createTimeFormat(date: string) {
    let currentDate = moment(new Date()).format("YYYY-MM-DD");
    let currentDateTime = currentDate + "T" + date + "+05:30";
    return moment(currentDateTime).format('h:mm a');
  }

  calculateSessionDuration(sessionStart: string, sessionEnd: string, sessionDate: string) {
    this.dur = this.UtilityService.calculateSessionDuration(sessionStart, sessionEnd, sessionDate);
    return this.UtilityService.calculateSessionDuration(sessionStart, sessionEnd, sessionDate);
  }

  onFileSelected(event) {
    let reader = new FileReader();
    if ((event.target.files[0].size) / 400000 > 1) {
      this.imageError = true;
      return;
    } else {
      this.imageError = false;
      if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.documents.push({
            pic: event.target.result
          })
        }
        this.uploadImage(event);
      }
    }
  }

  uploadImage(event) {

    let selectedImg = <File>event.target.files[0];
    let fd = new FormData()
    fd.append("file", selectedImg, selectedImg.name)
    fd.append('type', this.findTheImageType(selectedImg.type));
    fd.append('isFile', "1")
    this.fileData = fd;
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

      })
  }



  findUserProfile(profession: string) {
    if (profession == "You") {
      return this.userImgUrl;
    } else if (profession == "expert") {
      return this.expertImgUrl;
    } else {
      return "../../assets/images/Asset 5.png";
    }
  }

  fetchUserProfilePitcher() {
    if (this.userId) {
      this.apiService.getUserProfilePitcher(this.userId)
        .subscribe(data => {
          if (data.code == 1000) {
            this.userImgUrl = data.file;
          } else {
            this.userImgUrl = "../../assets/images/image.png";
          }
        })
    }
  }

  fetchExpertProfilePitcher() {
    if (this.expert?.id) {
      this.apiService.fetchProfilePitcher(this.expert.id)
        .subscribe((data: any) => {
          if (data.code == 1000) {
            this.expertImgUrl = data.file;
          } else {
            this.expertImgUrl = "../../assets/images/image.png";
          }
        })
    }
  }

  createImgUrl(data) {
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

  getAdminUserList() {
    this.apiService.getUserListForDropDown()
      .subscribe(data => {
        this.userAdminList = data.user;
      })
  }
  onChange(event) {
    // console.log("event " , event.target.value);
    this.userId = event.target.value
  }
  confirmPayment() {
    if (this.query || this.fileData != null) {
      let fd: FormData;
      if (this.fileData) {
        fd = this.fileData;
      } else {
        fd = new FormData();
        fd.append('isFile', "0")
      }
      fd.append("name", this.username)
      fd.append("email", this.userEmail)
      fd.append("mobile", this.userPhoneNumber)
      if (this.totalDiscount) {
        fd.append("amount", this.totalDiscount)
      } else {
        fd.append("amount", this.total)

      }
      fd.append("original_amount", this.total)
      fd.append("id_user", this.userId)
      fd.append("id_expert", this.expert.id)
      fd.append("multi", this.session.multi)
      if (this.session.multi == 1) {
        fd.append("days", JSON.stringify(this.session.days));
        fd.append('end_date', this.session.endDate);
        fd.append('start_date', this.session.startDate)
      }
      fd.append("start_time", this.session.start_time)
      fd.append("end_time", this.session.end_time)
      fd.append("session_date", this.session.date)
      fd.append("classes", this.selectedClass)
      fd.append("subject", this.selectRole)
      fd.append("query", this.query)
      fd.append("promo", this.promocode)
      if (this.discount) {
        fd.append("discount", this.discount)
      } else {
        fd.append("discount", '0')

      }



      if (this.userType == 'admin') {
        this.apiService.adminSessionBooking('0', this.session.date, this.expert.id, this.userId, this.session.start_time, this.session.end_time, this.selectedClass, this.selectRole, this.query, '[]')
          .subscribe(data => {
            if (data.code == 1000) {
              this.route.navigate(['/payment-confirmation']);

            } else {
              this.route.navigate(['/payment-confirmation']);

            }
          })

      } else {
        this.apiService.createPayment(fd)
          .subscribe(payment => {
            this.post({
              action: "https://securegw.paytm.in/order/process",
              params: payment
            })
          })
      }

    } else {
      alert("You need to enter/upload your query/topic to be discussed during the session");
    }
  }

  isDate(val: any) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
  }

  isObj(val: any) {
    return typeof val === 'object'
  }

  stringifyValue(val) {
    if (this.isObj(val) && !this.isDate(val)) {
      return JSON.stringify(val)
    } else {
      return val
    }
  }

  buildForm({ action, params }) {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', this.stringifyValue(params[key]))
      form.appendChild(input)
    })
    return form
  }

  post(details: any) {
    const form = this.buildForm(details)
    document.body.appendChild(form)
    form.submit();

    form.remove()
  }
  promo() {
    this.promocode = this.prmo
    this.apiService.getPromoCode(this.promocode, this.userId, this.dur, this.expert.id, this.total).subscribe(res => {
      if (res.code == 1000) {
        let dt = res.promo[0]
        this.discount = ((this.total) * (dt.discount / 100)).toFixed(2)
        this.totalDiscount = this.total - this.discount
        this.tostr.success('Promocode Applied Successfully');

      } else if (res.code == 1001) {
        this.discount = ""
        this.totalDiscount = this.total
        this.tostr.error('Invalid Promocode');

      } else if (res.code == 1002) {
        this.discount = ""
        this.totalDiscount = this.total
        this.tostr.error('You Already Availed this promocode');

      } else if (res.code == 1003) {
        this.discount = ""
        this.totalDiscount = this.total
        this.tostr.error('Error');

      }
      else if (res.code == 1004) {
        let dt = res.fees
        this.discount = this.total - dt
        this.totalDiscount = dt
        this.tostr.success('Promocode Applied Successfully');

      } else if (res.code == 1005) {
        let dt = res.fees
        this.discount = ""
        this.totalDiscount = this.total
        this.tostr.error('Not Applicable with selected expert');

      } else if (res.code == 1007) {
        this.discount = ""
        this.totalDiscount = this.total
        this.tostr.error('Please use GRAB10');
      }
      this.isPromoCodeApplied = true;
    })

  }
}
