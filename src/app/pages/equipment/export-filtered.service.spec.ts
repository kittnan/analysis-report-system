import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ExportFilteredService } from './export-filtered.service';

describe('ExportFilteredService', () => {
  let service: ExportFilteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ HttpClientTestingModule ] });
    service = TestBed.inject(ExportFilteredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
