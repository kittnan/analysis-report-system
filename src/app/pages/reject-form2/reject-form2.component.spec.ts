import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RejectForm2Component } from './reject-form2.component';

describe('RejectForm2Component', () => {
  let component: RejectForm2Component;
  let fixture: ComponentFixture<RejectForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm2Component ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
