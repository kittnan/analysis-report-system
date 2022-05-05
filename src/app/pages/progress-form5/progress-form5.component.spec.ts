import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressForm5Component } from './progress-form5.component';

describe('ProgressForm5Component', () => {
  let component: ProgressForm5Component;
  let fixture: ComponentFixture<ProgressForm5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
