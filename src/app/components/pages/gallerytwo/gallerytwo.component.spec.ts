import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerytwoComponent } from './gallerytwo.component';

describe('GallerytwoComponent', () => {
  let component: GallerytwoComponent;
  let fixture: ComponentFixture<GallerytwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallerytwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerytwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
