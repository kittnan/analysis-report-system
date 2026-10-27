import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReportManageComponent } from './report-manage.component';

describe('ReportManageComponent', () => {
  let component: ReportManageComponent;
  let fixture: ComponentFixture<ReportManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportManageComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
