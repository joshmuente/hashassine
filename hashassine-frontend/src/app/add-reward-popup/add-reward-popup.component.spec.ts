import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRewardPopupComponent } from './add-reward-popup.component';

describe('AddRewardPopupComponent', () => {
  let component: AddRewardPopupComponent;
  let fixture: ComponentFixture<AddRewardPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRewardPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRewardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
