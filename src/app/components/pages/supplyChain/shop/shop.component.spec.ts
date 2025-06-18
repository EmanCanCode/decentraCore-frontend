import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplyChainShopComponent } from './supply-chain.component';

describe('SupplyChainShopComponent', () => {
  let component: SupplyChainShopComponent;
  let fixture: ComponentFixture<SupplyChainShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplyChainShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplyChainShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
