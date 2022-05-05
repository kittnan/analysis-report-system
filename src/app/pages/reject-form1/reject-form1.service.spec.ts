import { TestBed } from '@angular/core/testing';

import { RejectForm1Service } from './reject-form1.service';

describe('RejectForm1Service', () => {
  let service: RejectForm1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RejectForm1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
