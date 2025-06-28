import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleshomeComponent } from './saleshome.component';

describe('SaleshomeComponent', () => {
  let component: SaleshomeComponent;
  let fixture: ComponentFixture<SaleshomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleshomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleshomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
