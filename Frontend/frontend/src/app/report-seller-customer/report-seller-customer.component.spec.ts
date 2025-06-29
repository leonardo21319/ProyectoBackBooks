import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSellerCustomerComponent } from './report-seller-customer.component';

describe('ReportSellerCustomerComponent', () => {
  let component: ReportSellerCustomerComponent;
  let fixture: ComponentFixture<ReportSellerCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSellerCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSellerCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
