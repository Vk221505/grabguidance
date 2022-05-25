import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertProfileDetailsComponent } from './expert-profile-details.component';

describe('ExpertProfileDetailsComponent', () => {
  let component: ExpertProfileDetailsComponent;
  let fixture: ComponentFixture<ExpertProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertProfileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
