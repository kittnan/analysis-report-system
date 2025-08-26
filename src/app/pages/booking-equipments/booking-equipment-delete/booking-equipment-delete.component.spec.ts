import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEquipmentDeleteComponent } from './booking-equipment-delete.component';

describe('BookingEquipmentDeleteComponent', () => {
  let component: BookingEquipmentDeleteComponent;
  let fixture: ComponentFixture<BookingEquipmentDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEquipmentDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEquipmentDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
