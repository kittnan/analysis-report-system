import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressForm5FmComponent } from './progress-form5-fm.component';

describe('ProgressForm5FmComponent', () => {
  let component: ProgressForm5FmComponent;
  let fixture: ComponentFixture<ProgressForm5FmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm5FmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm5FmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
