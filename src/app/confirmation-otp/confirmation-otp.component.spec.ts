import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationOtpComponent } from './confirmation-otp.component';

describe('ConfirmationOtpComponent', () => {
  let component: ConfirmationOtpComponent;
  let fixture: ComponentFixture<ConfirmationOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
