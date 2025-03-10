import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoprightComponent } from './shopright.component';

describe('ShoprightComponent', () => {
  let component: ShoprightComponent;
  let fixture: ComponentFixture<ShoprightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoprightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoprightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
