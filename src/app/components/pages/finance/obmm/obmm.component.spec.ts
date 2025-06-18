import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObmmComponent } from './obmm.component';

describe('ObmmComponent', () => {
  let component: ObmmComponent;
  let fixture: ComponentFixture<ObmmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObmmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObmmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
