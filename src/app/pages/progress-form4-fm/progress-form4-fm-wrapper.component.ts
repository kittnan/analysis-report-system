import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormConfig } from 'app/shared/engineer-form/reusable-form.component';

@Component({
  selector: 'app-progress-form4-fm-wrapper',
  template: `
    <app-reusable-form 
      [config]="formConfig"
      (onSaveComplete)="handleSaveComplete($event)"
      (onFormChange)="handleFormChange($event)">
    </app-reusable-form>
  `,
  styleUrls: ['../pagesStyle.css']
})
export class ProgressForm4FmWrapperComponent implements OnInit {

  formConfig: FormConfig = {
    formType: 'progress',
    formNumber: 4,
    formTitle: 'Analysis Request Form - Progress Form 4 FM',
    componentName: 'progress-form4-fm',
    enableAnalysisForm: true,
    enableTreatmentOfNg: true,
    enableJudgementDefect: true,
    enableOperatorAnalysis: true,
    redirectRoute: '/manageForm',
    customValidationRules: {
      // Add any custom validation rules specific to Progress Form 4 FM
    }
  };

  constructor() { }

  ngOnInit(): void {
    // Any additional initialization specific to Progress Form 4 FM
  }

  handleSaveComplete(result: any) {
    console.log('Progress Form 4 FM saved successfully:', result);
    // Handle any post-save logic specific to Progress Form 4 FM
  }

  handleFormChange(changes: any) {
    console.log('Form changes:', changes);
    // Handle form changes if needed
  }
}