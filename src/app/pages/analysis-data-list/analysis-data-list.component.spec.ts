import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AnalysisDataListComponent } from './analysis-data-list.component';

describe('AnalysisDataListComponent', () => {
  let component: AnalysisDataListComponent;
  let fixture: ComponentFixture<AnalysisDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisDataListComponent ],
      imports: [ RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ],
      providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
