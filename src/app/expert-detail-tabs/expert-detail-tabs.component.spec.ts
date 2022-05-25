import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDetailTabsComponent } from './expert-detail-tabs.component';

describe('ExpertDetailTabsComponent', () => {
  let component: ExpertDetailTabsComponent;
  let fixture: ComponentFixture<ExpertDetailTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertDetailTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertDetailTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
