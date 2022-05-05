import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectForm3Component } from './reject-form3.component';

describe('RejectForm3Component', () => {
  let component: RejectForm3Component;
  let fixture: ComponentFixture<RejectForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
