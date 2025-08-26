import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEquipmentTableComponent } from './booking-equipment-table.component';

describe('BookingEquipmentTableComponent', () => {
  let component: BookingEquipmentTableComponent;
  let fixture: ComponentFixture<BookingEquipmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEquipmentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEquipmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
