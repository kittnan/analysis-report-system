import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressForm2Component } from './progress-form2.component';

describe('ProgressForm2Component', () => {
  let component: ProgressForm2Component;
  let fixture: ComponentFixture<ProgressForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
