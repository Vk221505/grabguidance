import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CurrentSession } from '../models/admin.model';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  userId: string;
  modalRef: BsModalRef;
  dummyJSONData: any;ß
  userProfile: any;
  upcomingEvent: CurrentSession[];
  emptySessions: any[];
  dummyData: { name: string; education: string; experience: string; rating: string; reviews: string; ratePerSession: string; place: string; }[];

  constructor(

  ) { }

  ngOnInit(): void {

  }





}
