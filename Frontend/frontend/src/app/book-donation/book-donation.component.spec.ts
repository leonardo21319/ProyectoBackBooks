import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDonationComponent } from './book-donation.component';

describe('BookDonationComponent', () => {
  let component: BookDonationComponent;
  let fixture: ComponentFixture<BookDonationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDonationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
