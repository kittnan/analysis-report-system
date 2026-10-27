import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProgressForm5Component } from './progress-form5.component';

describe('ProgressForm5Component', () => {
  let component: ProgressForm5Component;
  let fixture: ComponentFixture<ProgressForm5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm5Component ],
      imports: [ RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ],
      providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm5Component);
    component = fixture.componentInstance;
    component.result = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
