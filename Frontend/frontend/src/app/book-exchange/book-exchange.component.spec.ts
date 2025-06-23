import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookExchangeComponent } from './book-exchange.component';

describe('BookExchangeComponent', () => {
  let component: BookExchangeComponent;
  let fixture: ComponentFixture<BookExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookExchangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
