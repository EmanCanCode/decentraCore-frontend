import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterthreeComponent } from './footerthree.component';

describe('FooterthreeComponent', () => {
  let component: FooterthreeComponent;
  let fixture: ComponentFixture<FooterthreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterthreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
