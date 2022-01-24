import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionPopupComponent } from './solution-popup.component';

describe('SolutionPopupComponent', () => {
  let component: SolutionPopupComponent;
  let fixture: ComponentFixture<SolutionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
