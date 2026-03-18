import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressForm4FmComponent } from './progress-form4-fm.component';

describe('ProgressForm4FmComponent', () => {
  let component: ProgressForm4FmComponent;
  let fixture: ComponentFixture<ProgressForm4FmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm4FmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm4FmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
