import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertDasboardPageComponent } from './expert-dasboard-page.component';

describe('ExpertDasboardPageComponent', () => {
  let component: ExpertDasboardPageComponent;
  let fixture: ComponentFixture<ExpertDasboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertDasboardPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertDasboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
