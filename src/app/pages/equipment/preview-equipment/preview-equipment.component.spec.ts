import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FileSizePipe } from 'app/pages/progress-form3/file-size.pipe';
import { PreviewEquipmentComponent } from './preview-equipment.component';

describe('PreviewEquipmentComponent', () => {
  let component: PreviewEquipmentComponent;
  let fixture: ComponentFixture<PreviewEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewEquipmentComponent, FileSizePipe ],
      providers: [ NgbActiveModal ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewEquipmentComponent);
    component = fixture.componentInstance;
    component.fromParent = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
