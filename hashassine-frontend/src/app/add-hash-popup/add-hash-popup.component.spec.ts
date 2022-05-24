import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHashPopupComponent } from './add-hash-popup.component';

describe('AddHashPopupComponent', () => {
  let component: AddHashPopupComponent;
  let fixture: ComponentFixture<AddHashPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHashPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHashPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
