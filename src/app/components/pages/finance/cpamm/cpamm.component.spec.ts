import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpammComponent } from './cpamm.component';

describe('CpammComponent', () => {
  let component: CpammComponent;
  let fixture: ComponentFixture<CpammComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpammComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpammComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
