import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookExchangeOfferComponent } from './book-exchange-offer.component';

describe('BookExchangeOfferComponent', () => {
  let component: BookExchangeOfferComponent;
  let fixture: ComponentFixture<BookExchangeOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookExchangeOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookExchangeOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
