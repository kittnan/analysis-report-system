import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { HelperMasterFMService } from './helper-master-fm.service';

describe('HelperMasterFMService', () => {
  let service: HelperMasterFMService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting() ] });
    service = TestBed.inject(HelperMasterFMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
