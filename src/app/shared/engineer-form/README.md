# Reusable Form Component Usage Guide

## Overview

The `ReusableFormComponent` is a generic, configurable form component based on the `progress-form4-fm` component that can be reused for multiple form types including:

- `progress-form3-fm`
- `progress-form4-fm` 
- `progress-form5-fm`
- `reject-form3-fm`

## Installation

### 1. Import the Component

Add the `ReusableFormComponent` to your module:

```typescript
import { ReusableFormComponent } from 'app/shared/engineer-form/reusable-form.component';

@NgModule({
  declarations: [
    // ... other components
    ReusableFormComponent
  ],
  // ...
})
export class YourModule { }
```

### 2. Import Required Dependencies

Make sure your module includes:

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    // ... other imports
  ],
  // ...
})
```

## Configuration Interface

```typescript
export interface FormConfig {
  formType: 'progress' | 'reject';
  formNumber: 3 | 4 | 5;
  formTitle: string;
  componentName: string;
  enableAnalysisForm?: boolean;
  enableTreatmentOfNg?: boolean;
  enableJudgementDefect?: boolean;
  enableOperatorAnalysis?: boolean;
  customValidationRules?: any;
  redirectRoute?: string;
}
```

## Usage Examples

### Example 1: Progress Form 4 FM (Full Features)

```typescript
import { Component } from '@angular/core';
import { FormConfig } from 'app/shared/engineer-form/reusable-form.component';

@Component({
  selector: 'app-progress-form4-fm',
  template: `
    <app-reusable-form 
      [config]="formConfig"
      (onSaveComplete)="handleSaveComplete($event)">
    </app-reusable-form>
  `
})
export class ProgressForm4FmComponent {
  formConfig: FormConfig = {
    formType: 'progress',
    formNumber: 4,
    formTitle: 'Analysis Request Form - Progress Form 4 FM',
    componentName: 'progress-form4-fm',
    enableAnalysisForm: true,
    enableTreatmentOfNg: true,
    enableJudgementDefect: true,
    enableOperatorAnalysis: true,
    redirectRoute: '/manageForm'
  };

  handleSaveComplete(result: any) {
    console.log('Form saved:', result);
  }
}
```

### Example 2: Reject Form 3 FM (Simplified)

```typescript
@Component({
  selector: 'app-reject-form3-fm',
  template: `
    <app-reusable-form 
      [config]="formConfig"
      (onSaveComplete)="handleSaveComplete($event)">
    </app-reusable-form>
  `
})
export class RejectForm3FmComponent {
  formConfig: FormConfig = {
    formType: 'reject',
    formNumber: 3,
    formTitle: 'Analysis Request Form - Reject Form 3 FM',
    componentName: 'reject-form3-fm',
    enableAnalysisForm: false,
    enableTreatmentOfNg: false,
    enableJudgementDefect: false,
    enableOperatorAnalysis: false,
    redirectRoute: '/manageForm'
  };

  handleSaveComplete(result: any) {
    console.log('Reject form saved:', result);
    // Handle rejection-specific logic
  }
}
```

### Example 3: Progress Form 3 FM (Partial Features)

```typescript
@Component({
  selector: 'app-progress-form3-fm',
  template: `
    <app-reusable-form 
      [config]="formConfig"
      (onSaveComplete)="handleSaveComplete($event)">
    </app-reusable-form>
  `
})
export class ProgressForm3FmComponent {
  formConfig: FormConfig = {
    formType: 'progress',
    formNumber: 3,
    formTitle: 'Analysis Request Form - Progress Form 3 FM',
    componentName: 'progress-form3-fm',
    enableAnalysisForm: true,
    enableTreatmentOfNg: true,
    enableJudgementDefect: true,
    enableOperatorAnalysis: false, // Different from Form 4
    redirectRoute: '/manageForm'
  };

  handleSaveComplete(result: any) {
    console.log('Form 3 saved:', result);
  }
}
```

## Configuration Options

### Required Properties

- **formType**: `'progress' | 'reject'` - Type of form
- **formNumber**: `3 | 4 | 5` - Form number identifier
- **formTitle**: `string` - Title displayed on the form
- **componentName**: `string` - Unique component identifier

### Optional Properties

- **enableAnalysisForm**: `boolean` (default: `true`)
  - Enables the detailed analysis form with image uploads
  - Includes mapping position, microscope images, FT-IR spectrum images
  - Analysis items with material, size, position, etc.

- **enableTreatmentOfNg**: `boolean` (default: `true`)
  - Shows the Treatment of NG dropdown field
  - Required for forms that need to specify NG treatment

- **enableJudgementDefect**: `boolean` (default: `true`)
  - Shows Judgement Defect dropdown and Remark textarea
  - Used for defect classification

- **enableOperatorAnalysis**: `boolean` (default: `true`)
  - Shows operator-related fields:
    - Operator Name
    - Difficulty of Work
    - Correct of Work
    - Analysis Time

- **customValidationRules**: `object` (optional)
  - Custom validation rules for specific form fields
  - Example: `{ 'ReportNo': [Validators.required, Validators.minLength(5)] }`

- **redirectRoute**: `string` (default: `'/manageForm'`)
  - Route to navigate to after successful form submission

## Events

### onSaveComplete

Emitted when the form is successfully saved.

```typescript
handleSaveComplete(result: any) {
  console.log('Saved data:', result);
  // result contains all form data
  // Handle post-save actions (notifications, navigation, etc.)
}
```

### onFormChange

Emitted when form values change (if needed).

```typescript
handleFormChange(changes: any) {
  console.log('Form changed:', changes);
  // Handle real-time form changes
}
```

## Form Features

### Base Form Fields (Always Included)

- Analysis dates (Start, Finish, Report)
- Result text area
- Result2 dynamic array with FM master items
- Source of Defect dropdown
- Category Cause dropdown
- Analysis Level dropdown
- Can Analysis (Yes/No)
- Related to ESD (Yes/No)
- Report Number
- Approval dropdown

### Conditional Form Sections

#### Analysis Form (`enableAnalysisForm: true`)
- Mapping Position images (max 5)
- Analysis items array with:
  - FM Position dropdown
  - Size (Length/Width)
  - Material dropdown
  - Estimate Result Process dropdown
  - Data Code, Color, Character
  - Microscope images (max 10 per item)
  - FT-IR Spectrum images (max 10 per item)
  - FT-IR Spectrum Graph images (max 10 per item)

#### Treatment of NG (`enableTreatmentOfNg: true`)
- Treatment dropdown selection

#### Judgement Defect (`enableJudgementDefect: true`)
- Judgement Defect dropdown
- Remark textarea

#### Operator Analysis (`enableOperatorAnalysis: true`)
- Operator Name dropdown
- Difficulty of Work dropdown
- Correct of Work dropdown
- Analysis Time dropdown

## Styling

The component uses:
- Bootstrap classes for layout
- Custom SCSS file: `reusable-form.component.scss`
- Parent stylesheet: `../pages/pagesStyle.css`

You can customize the appearance by:
1. Modifying the SCSS file
2. Overriding CSS classes in your component
3. Using Angular ViewEncapsulation

## API Integration

The component automatically handles:
- Form data retrieval via `formId` query parameter
- Master data loading (dropdowns, options)
- File uploads for analysis images
- Form validation and submission
- Result saving/updating

## Migration from Existing Components

To migrate from an existing component like `progress-form4-fm.component.ts`:

1. Create a wrapper component (see examples above)
2. Configure the `FormConfig` to match your requirements
3. Replace the old component template with the wrapper
4. Update routing to point to the new wrapper component
5. Test all functionality

## Validation

The component includes:
- Required field validation
- Conditional validation based on configuration
- Dynamic Result/Result2 validation (either one must have data)
- File upload validation with size limits
- Custom validation rules support

## File Upload Limits

- Mapping Position images: 5 maximum
- Microscope images: 10 per analysis item
- FT-IR Spectrum images: 10 per analysis item  
- FT-IR Spectrum Graph images: 10 per analysis item

## Troubleshooting

### Common Issues

1. **Form not displaying correctly**
   - Check if all required dependencies are imported
   - Verify the FormConfig is properly configured

2. **Validation errors**
   - Check if enableXXX flags match your form requirements
   - Verify custom validation rules syntax

3. **File upload not working**
   - Ensure the HttpService.UploadFileEng method exists
   - Check file size limits and network connectivity

4. **Styling issues**
   - Verify Bootstrap CSS is loaded
   - Check if component SCSS is being applied

### Debug Mode

Enable debug mode by setting the debug button visibility:

```html
<button type="button" class="btn btn-secondary" (click)="showDebug()" *ngIf="true">
  Debug
</button>
```

This will log form state and configuration to the browser console.