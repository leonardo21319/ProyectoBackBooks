import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSaleComponent } from './book-sale.component';

describe('BookSaleComponent', () => {
  let component: BookSaleComponent;
  let fixture: ComponentFixture<BookSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
