import { TestBed } from '@angular/core/testing';

import { HelperMasterFMService } from './helper-master-fm.service';

describe('HelperMasterFMService', () => {
  let service: HelperMasterFMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperMasterFMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
