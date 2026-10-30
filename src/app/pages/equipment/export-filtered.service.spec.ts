import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ExportFilteredService } from './export-filtered.service';

describe('ExportFilteredService', () => {
  let service: ExportFilteredService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ] });
    service = TestBed.inject(ExportFilteredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
