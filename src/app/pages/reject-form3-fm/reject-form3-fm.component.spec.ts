import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectForm3FmComponent } from './reject-form3-fm.component';

describe('RejectForm3FmComponent', () => {
  let component: RejectForm3FmComponent;
  let fixture: ComponentFixture<RejectForm3FmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectForm3FmComponent ]
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
