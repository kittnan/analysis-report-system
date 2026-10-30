import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MasterOutsourceComponent } from './master-outsource.component';

describe('MasterOutsourceComponent', () => {
  let component: MasterOutsourceComponent;
  let fixture: ComponentFixture<MasterOutsourceComponent>;

  beforeEach(async () => {
    localStorage.setItem('AR_UserEmployeeCode', 'admin');
    await TestBed.configureTestingModule({
      declarations: [ MasterOutsourceComponent ],
      imports: [ RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ],
      providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterOutsourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('AR_UserEmployeeCode');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
