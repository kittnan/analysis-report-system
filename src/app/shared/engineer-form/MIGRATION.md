# Migration Guide: Updating Existing Components

## Step-by-Step Migration Process

### 1. Update App Routing

Replace the old component imports with the new wrapper components in your routing module:

```typescript
// Before (old routing)
import { ProgressForm3FmComponent } from './pages/progress-form3-fm/progress-form3-fm.component';
import { ProgressForm4FmComponent } from './pages/progress-form4-fm/progress-form4-fm.component';
import { ProgressForm5FmComponent } from './pages/progress-form5-fm/progress-form5-fm.component';
import { RejectForm3FmComponent } from './pages/reject-form3-fm/reject-form3-fm.component';

// After (new routing with wrappers)
import { ProgressForm3FmWrapperComponent } from './pages/progress-form3-fm/progress-form3-fm-wrapper.component';
import { ProgressForm4FmWrapperComponent } from './pages/progress-form4-fm/progress-form4-fm-wrapper.component';
import { ProgressForm5FmWrapperComponent } from './pages/progress-form5-fm/progress-form5-fm-wrapper.component';
import { RejectForm3FmWrapperComponent } from './pages/reject-form3-fm/reject-form3-fm-wrapper.component';

const routes: Routes = [
  // Update route components
  { path: 'progress-form3-fm', component: ProgressForm3FmWrapperComponent },
  { path: 'progress-form4-fm', component: ProgressForm4FmWrapperComponent },
  { path: 'progress-form5-fm', component: ProgressForm5FmWrapperComponent },
  { path: 'reject-form3-fm', component: RejectForm3FmWrapperComponent },
];
```

### 2. Update Module Declarations

Update your module to include the new components:

```typescript
import { ReusableFormComponent } from './shared/engineer-form/reusable-form.component';
import { ProgressForm3FmWrapperComponent } from './pages/progress-form3-fm/progress-form3-fm-wrapper.component';
import { ProgressForm4FmWrapperComponent } from './pages/progress-form4-fm/progress-form4-fm-wrapper.component';
import { ProgressForm5FmWrapperComponent } from './pages/progress-form5-fm/progress-form5-fm-wrapper.component';
import { RejectForm3FmWrapperComponent } from './pages/reject-form3-fm/reject-form3-fm-wrapper.component';

@NgModule({
  declarations: [
    // Add the reusable component
    ReusableFormComponent,
    
    // Add the wrapper components
    ProgressForm3FmWrapperComponent,
    ProgressForm4FmWrapperComponent,
    ProgressForm5FmWrapperComponent,
    RejectForm3FmWrapperComponent,
    
    // Keep old components if you want gradual migration
    // or remove them if migrating all at once
  ],
  // ...
})
```

### 3. Testing the Migration

#### Before Fully Replacing (Safe Approach)

Create parallel routes for testing:

```typescript
const routes: Routes = [
  // Old routes (keep temporarily)
  { path: 'progress-form4-fm-old', component: ProgressForm4FmComponent },
  
  // New routes for testing
  { path: 'progress-form4-fm', component: ProgressForm4FmWrapperComponent },
  { path: 'progress-form4-fm-new', component: ProgressForm4FmWrapperComponent },
];
```

#### Testing Checklist

- [ ] Form loads with correct data
- [ ] All form fields are populated correctly  
- [ ] Validation works as expected
- [ ] File uploads function properly
- [ ] Form submission saves data correctly
- [ ] Email notifications work (if applicable)
- [ ] Routing redirects properly after save
- [ ] All conditional sections show/hide correctly

### 4. Configuration Differences Between Forms

Each form type may have different requirements. Here are common configurations:

#### Progress Form 3 FM
```typescript
formConfig: FormConfig = {
  formType: 'progress',
  formNumber: 3,
  enableAnalysisForm: true,
  enableTreatmentOfNg: true,
  enableJudgementDefect: true,
  enableOperatorAnalysis: false, // Different from Form 4
};
```

#### Progress Form 4 FM (Full Features)
```typescript
formConfig: FormConfig = {
  formType: 'progress',
  formNumber: 4,
  enableAnalysisForm: true,
  enableTreatmentOfNg: true,
  enableJudgementDefect: true,
  enableOperatorAnalysis: true, // Full features
};
```

#### Progress Form 5 FM
```typescript
formConfig: FormConfig = {
  formType: 'progress',
  formNumber: 5,
  enableAnalysisForm: true,
  enableTreatmentOfNg: true,
  enableJudgementDefect: true,
  enableOperatorAnalysis: true,
  // May have additional custom validation
  customValidationRules: {
    // Form 5 specific rules
  }
};
```

#### Reject Form 3 FM (Simplified)
```typescript
formConfig: FormConfig = {
  formType: 'reject',
  formNumber: 3,
  enableAnalysisForm: false, // Simplified reject form
  enableTreatmentOfNg: false,
  enableJudgementDefect: false,
  enableOperatorAnalysis: false,
};
```

### 5. Remove Old Components (After Testing)

Once you've verified everything works correctly:

1. Delete the old component files:
   ```
   progress-form4-fm.component.ts
   progress-form4-fm.component.html
   progress-form4-fm.component.scss
   progress-form4-fm.component.spec.ts
   ```

2. Remove old component imports from modules

3. Update any direct references to old components

### 6. Benefits After Migration

- **Code Reuse**: Single component handles multiple form types
- **Consistency**: All forms have the same behavior and styling
- **Maintainability**: Updates to one component affect all forms
- **Configuration**: Easy to enable/disable features per form type
- **Testing**: Single component to test thoroughly
- **Flexibility**: Easy to add new form types

### 7. Advanced Customization

If you need form-specific customization beyond configuration:

#### Option 1: Extend the Wrapper Component

```typescript
export class ProgressForm4FmWrapperComponent implements OnInit {
  formConfig: FormConfig = {
    // ... config
  };

  ngOnInit(): void {
    // Form-specific initialization
    this.setupForm4SpecificLogic();
  }

  private setupForm4SpecificLogic() {
    // Custom logic for Form 4
  }

  handleSaveComplete(result: any) {
    // Form 4 specific save handling
    this.sendForm4Notification(result);
    super.handleSaveComplete(result);
  }
}
```

#### Option 2: Use Template Inputs

```typescript
// In wrapper component
@ViewChild('reusableForm') reusableFormRef: ReusableFormComponent;

ngAfterViewInit() {
  // Access the reusable form instance for advanced customization
  this.reusableFormRef.someCustomMethod();
}
```

### 8. Rollback Plan

Keep the old components until you're confident in the migration:

1. Keep old component files in a `backup/` folder
2. Maintain parallel routes during transition period
3. Have database backup before major changes
4. Test in development/staging environments first

This allows quick rollback if issues are discovered after deployment.