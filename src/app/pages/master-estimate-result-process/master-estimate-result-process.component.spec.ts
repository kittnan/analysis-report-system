import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterEstimateResultProcessComponent } from './master-estimate-result-process.component';

describe('MasterEstimateResultProcessComponent', () => {
  let component: MasterEstimateResultProcessComponent;
  let fixture: ComponentFixture<MasterEstimateResultProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterEstimateResultProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterEstimateResultProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
