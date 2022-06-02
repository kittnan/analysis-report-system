import { TestBed } from '@angular/core/testing';

import { ExportFilteredService } from './export-filtered.service';

describe('ExportFilteredService', () => {
  let service: ExportFilteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportFilteredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
