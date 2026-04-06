import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterFmPositionComponent } from './master-fm-position.component';

describe('MasterFmPositionComponent', () => {
  let component: MasterFmPositionComponent;
  let fixture: ComponentFixture<MasterFmPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterFmPositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterFmPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
