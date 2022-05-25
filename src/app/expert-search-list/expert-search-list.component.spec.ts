import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertSearchListComponent } from './expert-search-list.component';

describe('ExpertSearchListComponent', () => {
  let component: ExpertSearchListComponent;
  let fixture: ComponentFixture<ExpertSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
