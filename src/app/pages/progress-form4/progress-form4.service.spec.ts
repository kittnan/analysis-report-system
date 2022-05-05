import { TestBed } from '@angular/core/testing';

import { ProgressForm4Service } from './progress-form4.service';

describe('ProgressForm4Service', () => {
  let service: ProgressForm4Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressForm4Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
