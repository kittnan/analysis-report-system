import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormConfig } from 'app/shared/engineer-form/reusable-form.component';

@Component({
  selector: 'app-progress-form3-fm-wrapper',
  template: `
    <app-reusable-form 
      [config]="formConfig"
      (onSaveComplete)="handleSaveComplete($event)"
      (onFormChange)="handleFormChange($event)">
    </app-reusable-form>
  `,
  styleUrls: ['../pagesStyle.css']
})
export class ProgressForm3FmWrapperComponent implements OnInit {

  formConfig: FormConfig = {
    formType: 'progress',
    formNumber: 3,
    formTitle: 'Analysis Request Form - Progress Form 3 FM',
    componentName: 'progress-form3-fm',
    enableAnalysisForm: true,
    enableTreatmentOfNg: true,
    enableJudgementDefect: true,
    enableOperatorAnalysis: false, // Different config for Form 3
    redirectRoute: '/manageForm',
    customValidationRules: {
      // Add any custom validation rules specific to Progress Form 3 FM
      // Example: Different validation for Form 3
    }
  };

  constructor() { }

  ngOnInit(): void {
    // Any additional initialization specific to Progress Form 3 FM
  }

  handleSaveComplete(result: any) {
    console.log('Progress Form 3 FM saved successfully:', result);
    // Handle any post-save logic specific to Progress Form 3 FM
  }

  handleFormChange(changes: any) {
    console.log('Form changes:', changes);
    // Handle form changes if needed
  }
}