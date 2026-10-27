import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { OutsourceAnalysisComponent } from './outsource-analysis.component';

describe('OutsourceAnalysisComponent', () => {
  let component: OutsourceAnalysisComponent;
  let fixture: ComponentFixture<OutsourceAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsourceAnalysisComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsourceAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
