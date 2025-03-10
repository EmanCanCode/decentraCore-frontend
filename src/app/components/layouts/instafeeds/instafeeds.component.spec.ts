import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstafeedsComponent } from './instafeeds.component';

describe('InstafeedsComponent', () => {
  let component: InstafeedsComponent;
  let fixture: ComponentFixture<InstafeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstafeedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstafeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
