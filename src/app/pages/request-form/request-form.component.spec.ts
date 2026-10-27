import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { RequestFormComponent } from './request-form.component';

describe('RequestFormComponent', () => {
  let component: RequestFormComponent;
  let fixture: ComponentFixture<RequestFormComponent>;

  beforeEach(async () => {
    localStorage.setItem('AR_UserFirstName', 'Test');
    localStorage.setItem('AR_UserLastName', 'User');
    await TestBed.configureTestingModule({
      declarations: [ RequestFormComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('AR_UserFirstName');
    localStorage.removeItem('AR_UserLastName');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
