import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginConfirmationComponent } from './login-confirmation.component';

describe('LoginConfirmationComponent', () => {
  let component: LoginConfirmationComponent;
  let fixture: ComponentFixture<LoginConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
