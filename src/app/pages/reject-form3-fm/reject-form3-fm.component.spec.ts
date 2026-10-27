import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { RejectForm3FmComponent } from './reject-form3-fm.component';

describe('RejectForm3FmComponent', () => {
  let component: RejectForm3FmComponent;
  let fixture: ComponentFixture<RejectForm3FmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm3FmComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectForm3FmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
