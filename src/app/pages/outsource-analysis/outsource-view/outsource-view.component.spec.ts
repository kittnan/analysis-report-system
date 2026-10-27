import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { OutsourceViewComponent } from './outsource-view.component';

describe('OutsourceViewComponent', () => {
  let component: OutsourceViewComponent;
  let fixture: ComponentFixture<OutsourceViewComponent>;

  beforeEach(async () => {
    sessionStorage.setItem('dataAll', JSON.stringify({ registerNo: '', urlFile: [] }));
    await TestBed.configureTestingModule({
      declarations: [ OutsourceViewComponent ],
      providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.removeItem('dataAll');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
