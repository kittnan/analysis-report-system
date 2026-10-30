import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RejectForm4Component } from './reject-form4.component';

describe('RejectForm4Component', () => {
  let component: RejectForm4Component;
  let fixture: ComponentFixture<RejectForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm4Component ],
      imports: [ RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ],
      providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm4Component);
    component = fixture.componentInstance;
    component.form = { fileList: [] };
    component.result = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
