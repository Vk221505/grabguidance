import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertOtpVerifyComponent } from './expert-otp-verify.component';

describe('ExpertOtpVerifyComponent', () => {
  let component: ExpertOtpVerifyComponent;
  let fixture: ComponentFixture<ExpertOtpVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertOtpVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertOtpVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
