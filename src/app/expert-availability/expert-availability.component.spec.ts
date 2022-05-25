import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertAvailabilityComponent } from './expert-availability.component';

describe('ExpertAvailabilityComponent', () => {
  let component: ExpertAvailabilityComponent;
  let fixture: ComponentFixture<ExpertAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertAvailabilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
