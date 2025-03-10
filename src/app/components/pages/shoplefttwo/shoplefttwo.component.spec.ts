import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoplefttwoComponent } from './shoplefttwo.component';

describe('ShoplefttwoComponent', () => {
  let component: ShoplefttwoComponent;
  let fixture: ComponentFixture<ShoplefttwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoplefttwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoplefttwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
