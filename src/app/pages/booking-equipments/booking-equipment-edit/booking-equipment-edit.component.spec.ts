import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEquipmentEditComponent } from './booking-equipment-edit.component';

describe('BookingEquipmentEditComponent', () => {
  let component: BookingEquipmentEditComponent;
  let fixture: ComponentFixture<BookingEquipmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEquipmentEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEquipmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
