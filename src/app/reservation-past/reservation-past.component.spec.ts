import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPastComponent } from './reservation-past.component';

describe('ReservationPastComponent', () => {
  let component: ReservationPastComponent;
  let fixture: ComponentFixture<ReservationPastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationPastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationPastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
