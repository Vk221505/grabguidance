import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertEducationComponent } from './expert-education.component';

describe('ExpertEducationComponent', () => {
  let component: ExpertEducationComponent;
  let fixture: ComponentFixture<ExpertEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertEducationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
