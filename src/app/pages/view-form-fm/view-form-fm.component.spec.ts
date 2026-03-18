import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormFmComponent } from './view-form-fm.component';

describe('ViewFormFmComponent', () => {
  let component: ViewFormFmComponent;
  let fixture: ComponentFixture<ViewFormFmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFormFmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFormFmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
