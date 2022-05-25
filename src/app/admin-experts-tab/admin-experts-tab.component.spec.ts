import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpertsTabComponent } from './admin-experts-tab.component';

describe('AdminExpertsTabComponent', () => {
  let component: AdminExpertsTabComponent;
  let fixture: ComponentFixture<AdminExpertsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminExpertsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminExpertsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
