import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileShooperComponent } from './profile-shooper.component';

describe('ProfileShooperComponent', () => {
  let component: ProfileShooperComponent;
  let fixture: ComponentFixture<ProfileShooperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileShooperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileShooperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
