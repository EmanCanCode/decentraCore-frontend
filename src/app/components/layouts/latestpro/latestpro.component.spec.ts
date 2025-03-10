import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestproComponent } from './latestpro.component';

describe('LatestproComponent', () => {
  let component: LatestproComponent;
  let fixture: ComponentFixture<LatestproComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestproComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestproComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
