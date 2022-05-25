import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from 'src/services/utility.service';

declare var $: any;

@Component({
  selector: 'app-expert-dashboard',
  templateUrl: './expert-dashboard.component.html',
  styleUrls: ['./expert-dashboard.component.css']
})
export class ExpertDashboardComponent implements OnInit {

  expertId: string = "0"
  expertSubscription: Subscription;

    constructor(private utilityService: UtilityService) {}

  ngOnInit(): void {
  }

}
