import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersTabComponent } from './admin-users-tab.component';

describe('AdminUsersTabComponent', () => {
  let component: AdminUsersTabComponent;
  let fixture: ComponentFixture<AdminUsersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUsersTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
