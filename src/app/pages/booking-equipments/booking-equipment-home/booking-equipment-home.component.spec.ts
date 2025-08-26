import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEquipmentHomeComponent } from './booking-equipment-home.component';

describe('BookingEquipmentHomeComponent', () => {
  let component: BookingEquipmentHomeComponent;
  let fixture: ComponentFixture<BookingEquipmentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEquipmentHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEquipmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
