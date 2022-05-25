import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationUpcomingComponent } from './reservation-upcoming.component';

describe('ReservationUpcomingComponent', () => {
  let component: ReservationUpcomingComponent;
  let fixture: ComponentFixture<ReservationUpcomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationUpcomingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationUpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
