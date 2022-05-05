import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisDataListComponent } from './analysis-data-list.component';

describe('AnalysisDataListComponent', () => {
  let component: AnalysisDataListComponent;
  let fixture: ComponentFixture<AnalysisDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
