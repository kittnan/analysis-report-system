import { TestBed } from '@angular/core/testing';

import { RejectForm2Service } from './reject-form2.service';

describe('RejectForm2Service', () => {
  let service: RejectForm2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RejectForm2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
