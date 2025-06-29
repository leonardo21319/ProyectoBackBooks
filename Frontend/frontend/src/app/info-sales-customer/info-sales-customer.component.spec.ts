import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSalesCustomerComponent } from './info-sales-customer.component';

describe('InfoSalesCustomerComponent', () => {
  let component: InfoSalesCustomerComponent;
  let fixture: ComponentFixture<InfoSalesCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSalesCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSalesCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
