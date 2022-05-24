import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewEquipmentComponent } from './preview-equipment.component';

describe('PreviewEquipmentComponent', () => {
  let component: PreviewEquipmentComponent;
  let fixture: ComponentFixture<PreviewEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewEquipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
