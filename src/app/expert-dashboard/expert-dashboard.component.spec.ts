import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDashboardComponent } from './expert-dashboard.component';

describe('ExpertDashboardComponent', () => {
  let component: ExpertDashboardComponent;
  let fixture: ComponentFixture<ExpertDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
