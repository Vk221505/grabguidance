import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import * as moment from 'moment';
import { UtilityService } from 'src/services/utility.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare let ga: Function;

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  reviewsData = [];
  showReviewShortDesc = true;
  expertId: any;
  reviews: any;
  totalrating: any;
  showReviewShortDesc1 = true;
  showReviewShortDesc2 = true;
  showReviewShortDesc3 = true;
  showReviewShortDesc4 = true;

  constructor(private apiService: ApiService,
    private route: Router,
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

  ngOnInit(): void {
    this.expertId = localStorage.getItem('id_expert');
    this.showReviewShortDesc = true;
    this.reviews = [];
    this.getExpertReview();
  }

  createImageUrl(pic: string) {
    if (pic) {
      return pic
    }
    return "../../assets/images/image.png";
  }

  getReviewShortDescription(index: number) {
    switch (index) {
      case 0: return this.showReviewShortDesc1;
        break;
      case 1: return this.showReviewShortDesc2;
        break;
      case 2: return this.showReviewShortDesc3;
        break
      case 3: return this.showReviewShortDesc4;
    }
  }

  calculateStringData(review: string) {
    return review.split(" ").length;
  }

  toggleReviewShowMore(index: number) {
    switch (index) {
      case 0: this.showReviewShortDesc1 = !this.showReviewShortDesc1;
        break;
      case 1: this.showReviewShortDesc2 = !this.showReviewShortDesc2;
        break;
      case 2: this.showReviewShortDesc3 = !this.showReviewShortDesc3;
        break
      case 3: this.showReviewShortDesc4 = !this.showReviewShortDesc4;
        break;
    }
  }

  getExpertReview() {
    this.apiService.getExpertReview(this.expertId)
      .subscribe(data => {
        if (data.code == 1000) {
          this.reviewsData = data.reviews;
          console.log(this.reviewsData)
          this.calculateTotalRating(this.reviewsData);
        }
      })
  }

  formatSessionDate(date) {
    var todaysDate = moment(new Date()).format().split("T")[0];
    var endDate = moment(date).format().split("T")[0];
    var diff = moment(endDate).diff(moment(todaysDate), 'days');
    if (diff === 0) {
      return "Today";
    }
    return moment(date).format('Do MMM YYYY');
  }

  calculateTotalRating(data: any) {
    let sum = 0;
    this.reviewsData.forEach((data: any) => {
      sum += (+data.rating);
    })
    this.totalrating = (sum / this.reviewsData.length);
  }

}
