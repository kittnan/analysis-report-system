import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { EditViewComponent } from './edit-view.component';

describe('EditViewComponent', () => {
  let component: EditViewComponent;
  let fixture: ComponentFixture<EditViewComponent>;

  beforeEach(async () => {
    sessionStorage.setItem('dataAll', JSON.stringify({ registerNo: '', urlFile: [] }));
    await TestBed.configureTestingModule({
      declarations: [ EditViewComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditViewComponent);
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
