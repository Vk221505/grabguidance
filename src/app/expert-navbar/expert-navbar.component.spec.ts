import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertNavbarComponent } from './expert-navbar.component';

describe('ExpertNavbarComponent', () => {
  let component: ExpertNavbarComponent;
  let fixture: ComponentFixture<ExpertNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
