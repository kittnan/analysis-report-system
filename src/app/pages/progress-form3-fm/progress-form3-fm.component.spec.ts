import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressForm3FmComponent } from './progress-form3-fm.component';

describe('ProgressForm3FmComponent', () => {
  let component: ProgressForm3FmComponent;
  let fixture: ComponentFixture<ProgressForm3FmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm3FmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm3FmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
