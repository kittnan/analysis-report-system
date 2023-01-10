import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsourceViewComponent } from './outsource-view.component';

describe('OutsourceViewComponent', () => {
  let component: OutsourceViewComponent;
  let fixture: ComponentFixture<OutsourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutsourceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
