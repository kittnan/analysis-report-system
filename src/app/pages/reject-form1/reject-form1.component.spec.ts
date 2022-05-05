import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectForm1Component } from './reject-form1.component';

describe('RejectForm1Component', () => {
  let component: RejectForm1Component;
  let fixture: ComponentFixture<RejectForm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
