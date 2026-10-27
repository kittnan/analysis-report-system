import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { ProgressForm5FmComponent } from './progress-form5-fm.component';

describe('ProgressForm5FmComponent', () => {
  let component: ProgressForm5FmComponent;
  let fixture: ComponentFixture<ProgressForm5FmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm5FmComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm5FmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
