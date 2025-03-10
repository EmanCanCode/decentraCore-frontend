import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoprelatedComponent } from './shoprelated.component';

describe('ShoprelatedComponent', () => {
  let component: ShoprelatedComponent;
  let fixture: ComponentFixture<ShoprelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoprelatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoprelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
