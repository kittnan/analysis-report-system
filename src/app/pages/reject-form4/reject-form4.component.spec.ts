import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectForm4Component } from './reject-form4.component';

describe('RejectForm4Component', () => {
  let component: RejectForm4Component;
  let fixture: ComponentFixture<RejectForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
