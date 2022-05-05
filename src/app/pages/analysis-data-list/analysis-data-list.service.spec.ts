import { TestBed } from '@angular/core/testing';

import { AnalysisDataListService } from './analysis-data-list.service';

describe('AnalysisDataListService', () => {
  let service: AnalysisDataListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisDataListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
