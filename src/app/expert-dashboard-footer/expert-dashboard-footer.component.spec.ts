import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDashboardFooterComponent } from './expert-dashboard-footer.component';

describe('ExpertDashboardFooterComponent', () => {
  let component: ExpertDashboardFooterComponent;
  let fixture: ComponentFixture<ExpertDashboardFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertDashboardFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertDashboardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
