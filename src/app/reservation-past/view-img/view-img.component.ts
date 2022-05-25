import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-view-img',
  templateUrl: './view-img.component.html',
  styleUrls: ['./view-img.component.css']
})
export class ViewImgComponent implements OnInit {
  myParam:any;
  page:any;
  constructor(private router: Router,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    //this.activatedRoute.params.subscribe((params: Params) => this.myParam = params['path']);
    console.log(this.myParam);

    this.myParam = this.activatedRoute
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.page = params['path'];
      });
      console.log(this.page);
  }

}
