import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-tabs',
  templateUrl: './reservation-tabs.component.html',
  styleUrls: ['./reservation-tabs.component.css']
})
export class ReservationTabsComponent implements OnInit, AfterViewInit {

  @Input() expertId: any;
  @ViewChild('upcoming', {static: false}) upcomingTab: ElementRef;

  constructor(
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
      this.upcomingTab.nativeElement.click();
  }

}
