import { TestBed } from '@angular/core/testing';

import { ExportEquipmentService } from './export-equipment.service';

describe('ExportEquipmentService', () => {
  let service: ExportEquipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportEquipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
