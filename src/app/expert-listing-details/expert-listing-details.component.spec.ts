import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertListingDetailsComponent } from './expert-listing-details.component';

describe('ExpertListingDetailsComponent', () => {
  let component: ExpertListingDetailsComponent;
  let fixture: ComponentFixture<ExpertListingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertListingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertListingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
