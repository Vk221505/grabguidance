import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserExpertNavbarComponent } from './user-expert-navbar.component';

describe('UserExpertNavbarComponent', () => {
  let component: UserExpertNavbarComponent;
  let fixture: ComponentFixture<UserExpertNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserExpertNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExpertNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
