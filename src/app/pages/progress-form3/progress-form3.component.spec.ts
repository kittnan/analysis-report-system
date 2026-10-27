import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { ProgressForm3Component } from './progress-form3.component';

describe('ProgressForm3Component', () => {
  let component: ProgressForm3Component;
  let fixture: ComponentFixture<ProgressForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressForm3Component, FileSizePipe ],
      imports: [ HttpClientTestingModule, RouterTestingModule.withRoutes([{ path: '**', children: [] }]) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
