import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalTftDrivingComponent } from './electrical-tft-driving.component';

describe('ElectricalTftDrivingComponent', () => {
  let component: ElectricalTftDrivingComponent;
  let fixture: ComponentFixture<ElectricalTftDrivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalTftDrivingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalTftDrivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
