import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalResistanceComponent } from './electrical-resistance.component';

describe('ElectricalResistanceComponent', () => {
  let component: ElectricalResistanceComponent;
  let fixture: ComponentFixture<ElectricalResistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalResistanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalResistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
