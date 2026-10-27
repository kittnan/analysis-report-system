import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProgressForm2Component } from './progress-form2.component';

describe('ProgressForm2Component', () => {
  let component: ProgressForm2Component;
  let fixture: ComponentFixture<ProgressForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm2Component ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
