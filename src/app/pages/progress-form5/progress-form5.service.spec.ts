import { TestBed } from '@angular/core/testing';

import { ProgressForm5Service } from './progress-form5.service';

describe('ProgressForm5Service', () => {
  let service: ProgressForm5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressForm5Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
