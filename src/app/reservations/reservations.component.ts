import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { UtilityService } from 'src/services/utility.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  expertId: string;
  upcomingSessions: any;
  pastSession: any;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: ApiService,
              private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

}
