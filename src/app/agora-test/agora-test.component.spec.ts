import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgoraTestComponent } from './agora-test.component';

describe('AgoraTestComponent', () => {
  let component: AgoraTestComponent;
  let fixture: ComponentFixture<AgoraTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgoraTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgoraTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
