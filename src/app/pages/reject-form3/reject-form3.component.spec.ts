import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { RejectForm3Component } from './reject-form3.component';

describe('RejectForm3Component', () => {
  let component: RejectForm3Component;
  let fixture: ComponentFixture<RejectForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm3Component, FileSizePipe ],
      imports: [ RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ],
      providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm3Component);
    component = fixture.componentInstance;
    component.result = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
