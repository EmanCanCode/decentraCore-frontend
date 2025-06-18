import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyChainViewComponent } from './view.component';

describe('SupplyChainViewComponent', () => {
  let component: SupplyChainViewComponent;
  let fixture: ComponentFixture<SupplyChainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplyChainViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyChainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
