import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoprighttwoComponent } from './shoprighttwo.component';

describe('ShoprighttwoComponent', () => {
  let component: ShoprighttwoComponent;
  let fixture: ComponentFixture<ShoprighttwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoprighttwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoprighttwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
