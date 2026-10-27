import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SectionManageComponent } from './section-manage.component';

describe('SectionManageComponent', () => {
  let component: SectionManageComponent;
  let fixture: ComponentFixture<SectionManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionManageComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
