import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertWelcomePageComponent } from './expert-welcome-page.component';

describe('ExpertWelcomePageComponent', () => {
  let component: ExpertWelcomePageComponent;
  let fixture: ComponentFixture<ExpertWelcomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertWelcomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertWelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
