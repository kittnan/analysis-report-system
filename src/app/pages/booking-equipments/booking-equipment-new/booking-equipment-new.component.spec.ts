import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEquipmentNewComponent } from './booking-equipment-new.component';

describe('BookingEquipmentNewComponent', () => {
  let component: BookingEquipmentNewComponent;
  let fixture: ComponentFixture<BookingEquipmentNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEquipmentNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEquipmentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
