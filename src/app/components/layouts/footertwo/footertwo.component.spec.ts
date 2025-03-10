import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootertwoComponent } from './footertwo.component';

describe('FootertwoComponent', () => {
  let component: FootertwoComponent;
  let fixture: ComponentFixture<FootertwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FootertwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FootertwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
