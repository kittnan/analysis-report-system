import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentManageComponent } from './equipment-manage.component';

describe('EquipmentManageComponent', () => {
  let component: EquipmentManageComponent;
  let fixture: ComponentFixture<EquipmentManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
