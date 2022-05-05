import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectForm2Component } from './reject-form2.component';

describe('RejectForm2Component', () => {
  let component: RejectForm2Component;
  let fixture: ComponentFixture<RejectForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
