import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterOutsourceComponent } from './master-outsource.component';

describe('MasterOutsourceComponent', () => {
  let component: MasterOutsourceComponent;
  let fixture: ComponentFixture<MasterOutsourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterOutsourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterOutsourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
