import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressForm4Component } from './progress-form4.component';

describe('ProgressForm4Component', () => {
  let component: ProgressForm4Component;
  let fixture: ComponentFixture<ProgressForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
