import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricalOtpComponent } from './electrical-otp.component';

describe('ElectricalOtpComponent', () => {
  let component: ElectricalOtpComponent;
  let fixture: ComponentFixture<ElectricalOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricalOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricalOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
