import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormConfig } from 'app/shared/engineer-form/reusable-form.component';

@Component({
  selector: 'app-reject-form3-fm-wrapper',
  template: `
    <app-reusable-form 
      [config]="formConfig"
      (onSaveComplete)="handleSaveComplete($event)"
      (onFormChange)="handleFormChange($event)">
    </app-reusable-form>
  `,
  styleUrls: ['../pagesStyle.css']
})
export class RejectForm3FmWrapperComponent implements OnInit {

  formConfig: FormConfig = {
    formType: 'reject',
    formNumber: 3,
    formTitle: 'Analysis Request Form - Reject Form 3 FM',
    componentName: 'reject-form3-fm',
    enableAnalysisForm: false, // Reject forms typically don't need full analysis
    enableTreatmentOfNg: false, // Reject forms may not need treatment
    enableJudgementDefect: false, // Different requirements for reject forms
    enableOperatorAnalysis: false, // Simplified reject form
    redirectRoute: '/manageForm',
    customValidationRules: {
      // Add any custom validation rules specific to Reject Form 3 FM
      // Reject forms might have simplified validation rules
      'NoteReject': [Validators.required], // Require rejection note for reject forms
    }
  };

  constructor() { }

  ngOnInit(): void {
    // Any additional initialization specific to Reject Form 3 FM
  }

  handleSaveComplete(result: any) {
    console.log('Reject Form 3 FM saved successfully:', result);
    // Handle any post-save logic specific to Reject Form 3 FM
    // This might include sending reject notifications, etc.
  }

  handleFormChange(changes: any) {
    console.log('Form changes:', changes);
    // Handle form changes if needed
  }
}