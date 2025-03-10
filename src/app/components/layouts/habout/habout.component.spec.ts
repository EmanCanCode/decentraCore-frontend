import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaboutComponent } from './habout.component';

describe('HaboutComponent', () => {
  let component: HaboutComponent;
  let fixture: ComponentFixture<HaboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HaboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HaboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
