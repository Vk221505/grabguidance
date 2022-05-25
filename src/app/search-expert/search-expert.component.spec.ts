import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchExpertComponent } from './search-expert.component';

describe('SearchExpertComponent', () => {
  let component: SearchExpertComponent;
  let fixture: ComponentFixture<SearchExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchExpertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
