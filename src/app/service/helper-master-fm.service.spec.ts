import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HelperMasterFMService } from './helper-master-fm.service';

describe('HelperMasterFMService', () => {
  let service: HelperMasterFMService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ HttpClientTestingModule ] });
    service = TestBed.inject(HelperMasterFMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
