import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from '@angular/common';


declare let ga: Function;

@Component({
  selector: 'app-review-and-rating',
  templateUrl: './review-and-rating.component.html',
  styleUrls: ['./review-and-rating.component.css']
})
export class ReviewAndRatingComponent implements OnInit {

  showReviewBox: boolean = false;
  feedback: string = "";
  startRating: number = 0;
  agoraObj: any;
  expertId: any;
  userId: string;
  expertName: string;
  userName: string;
  sessionId: any;
  multi: any;
  userType: string;

  constructor(private apiService: ApiService,
    private toastrService: ToastrService,
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.showReviewBox = false;
      this.agoraObj = JSON.parse(sessionStorage.getItem('agoraObj'));
      this.expertId = this.agoraObj?.id_expert;
      this.userId = this.agoraObj?.id_user;
      this.expertName = this.agoraObj?.expertName;
      this.userName = this.agoraObj?.userName;
      this.sessionId = this.agoraObj?.sessionId;
      this.multi = this.agoraObj?.multi;
      this.userType = localStorage.getItem(('user_role'));
    }
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

  rating(ratingValue: number) {
    this.startRating = ratingValue;
    this.showReviewBox = true;
  }

  continueWithFeedBack() {
    this.showReviewBox = true;
  }

  rejoin() {
    this.route.navigate(['/agora-test'])
    // ,{ queryParams: { sessionId: this.sessionId, multi: this.multi } });
  }

  endSession() {
    if (this.userType == 'expert') {
      this.route.navigate(['/expert/dashboard']);
    }
  }

  submitFeedBack() {
    this.apiService.userAddReview(this.expertId, this.userId, this.startRating, this.feedback)
      .subscribe(data => {
        if (data.code == 1000) {
          if (this.userType == 'user') {
            this.toastrService.success("Your feedback is submitted");
            setTimeout(() => {
              this.route.navigate(['/user/dashboard']);
            }, 2000);
          }
        }
      })
  }

}
