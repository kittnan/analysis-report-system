import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsourceAnalysisComponent } from './outsource-analysis.component';

describe('OutsourceAnalysisComponent', () => {
  let component: OutsourceAnalysisComponent;
  let fixture: ComponentFixture<OutsourceAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsourceAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsourceAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
