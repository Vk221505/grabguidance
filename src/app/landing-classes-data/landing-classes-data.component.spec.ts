import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingClassesDataComponent } from './landing-classes-data.component';

describe('LandingClassesDataComponent', () => {
  let component: LandingClassesDataComponent;
  let fixture: ComponentFixture<LandingClassesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingClassesDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingClassesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
