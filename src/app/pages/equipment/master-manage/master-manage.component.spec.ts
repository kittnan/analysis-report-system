import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterManageComponent } from './master-manage.component';

describe('MasterManageComponent', () => {
  let component: MasterManageComponent;
  let fixture: ComponentFixture<MasterManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
