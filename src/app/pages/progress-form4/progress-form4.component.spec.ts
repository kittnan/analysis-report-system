import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProgressForm4Component } from './progress-form4.component';

describe('ProgressForm4Component', () => {
  let component: ProgressForm4Component;
  let fixture: ComponentFixture<ProgressForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm4Component ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
