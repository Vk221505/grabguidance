import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-review-slider',
  templateUrl: './review-slider.component.html',
  styleUrls: ['./review-slider.component.css']
})
export class ReviewSliderComponent implements OnInit {

  reviews: any[];
  slideConfig: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.reviews = this.dataService.getReviewForSlider();
    this.slideConfig = {"slidesToShow": 3, "slidesToScroll": 1};
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

}
