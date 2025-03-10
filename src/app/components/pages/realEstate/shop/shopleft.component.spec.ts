import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopleftComponent } from './shopleft.component';

describe('ShopleftComponent', () => {
  let component: ShopleftComponent;
  let fixture: ComponentFixture<ShopleftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopleftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopleftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
