import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertsignupComponent } from './expertsignup.component';

describe('ExpertsignupComponent', () => {
  let component: ExpertsignupComponent;
  let fixture: ComponentFixture<ExpertsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertsignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
