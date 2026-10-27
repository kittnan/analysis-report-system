import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { AddEquipmentComponent } from './add-equipment.component';

describe('AddEquipmentComponent', () => {
  let component: AddEquipmentComponent;
  let fixture: ComponentFixture<AddEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEquipmentComponent, FileSizePipe ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
