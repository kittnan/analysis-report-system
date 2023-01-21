import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalMasterComponent } from './electrical-master.component';

describe('ElectricalMasterComponent', () => {
  let component: ElectricalMasterComponent;
  let fixture: ComponentFixture<ElectricalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
