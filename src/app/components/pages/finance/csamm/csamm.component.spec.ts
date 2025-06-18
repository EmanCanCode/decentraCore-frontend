import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsammComponent } from './csamm.component';

describe('CsammComponent', () => {
  let component: CsammComponent;
  let fixture: ComponentFixture<CsammComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsammComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsammComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
