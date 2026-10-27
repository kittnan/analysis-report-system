import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ManageFormComponent } from './manage-form.component';

describe('ManageFormComponent', () => {
  let component: ManageFormComponent;
  let fixture: ComponentFixture<ManageFormComponent>;

  beforeEach(async () => {
    localStorage.setItem('AR_UserLevel1', '1');
    await TestBed.configureTestingModule({
      declarations: [ ManageFormComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('AR_UserLevel1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
