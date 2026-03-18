import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReusableFormComponent } from './reusable-form.component';
import { HttpService } from 'app/service/http.service';
import { HelperMasterFMService } from 'app/service/helper-master-fm.service';

describe('ReusableFormComponent', () => {
  let component: ReusableFormComponent;
  let fixture: ComponentFixture<ReusableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReusableFormComponent ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NgbModule,
        HttpClientTestingModule
      ],
      providers: [
        HttpService,
        HelperMasterFMService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default config', () => {
    expect(component.config.formType).toBe('progress');
    expect(component.config.formNumber).toBe(4);
    expect(component.config.enableAnalysisForm).toBe(true);
  });

  it('should apply form configuration correctly', () => {
    component.config = {
      formType: 'reject',
      formNumber: 3,
      formTitle: 'Test Form',
      componentName: 'test-form',
      enableAnalysisForm: false,
      enableTreatmentOfNg: false,
      enableJudgementDefect: false,
      enableOperatorAnalysis: false
    };
    
    component.applyFormConfiguration();
    
    expect(component.ResultForm.get('JudgementDefect')?.valid).toBe(true);
    expect(component.ResultForm.get('OperatorName')?.valid).toBe(true);
  });

  it('should validate forms correctly', () => {
    // Test with minimal valid data
    component.ResultForm.patchValue({
      AnalyzeDate: '2026-01-01',
      ResultDate: '2026-01-02',
      ReportDate: '2026-01-03',
      Result: 'Test result',
      SourceOfDefect: 'Test source',
      CategoryCause: 'Test cause',
      AnalysisLevel: 'Level 1',
      CanAnalysis: 'Yes',
      RelatedToESD: 'No',
      ReportNo: 'TEST-001',
      Approve: 'test-approver-id',
      JudgementDefect: 'Latent',
      OperatorName: 'Test Operator',
      DifficultyOfWork: 'Easy',
      CorrectOfWork: 'Correct',
      AnalysisTime: '2 hours'
    });
    
    expect(component.isFormValid()).toBe(false); // Still invalid due to missing data
  });

  it('should add and remove result2 items', () => {
    const initialLength = component.Result2.length;
    
    component.addResult2Item();
    expect(component.Result2.length).toBe(initialLength + 1);
    
    component.removeResult2Item(0);
    expect(component.Result2.length).toBe(initialLength);
  });

  it('should add and remove analysis items when enabled', () => {
    component.config.enableAnalysisForm = true;
    const initialLength = component.analysisFormArray.length;
    
    component.addAnalysisItem();
    expect(component.analysisFormArray.length).toBe(initialLength + 1);
    
    component.removeAnalysisItem(0);
    expect(component.analysisFormArray.length).toBe(initialLength);
  });
});