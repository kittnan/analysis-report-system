import { TestBed } from '@angular/core/testing';

import { RejectForm3Service } from './reject-form3.service';

describe('RejectForm3Service', () => {
  let service: RejectForm3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RejectForm3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
